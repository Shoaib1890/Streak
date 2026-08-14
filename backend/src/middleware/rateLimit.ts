import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler.js';

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
}

interface RequestRecord {
  count: number;
  resetTime: number;
}

const records: Map<string, RequestRecord> = new Map();

/**
 * Basic in-memory rate limiter middleware.
 */
export function rateLimit(options: RateLimitOptions) {
  const { windowMs, max, message = 'Too many requests, please try again later.' } = options;

  return (req: Request, _res: Response, next: NextFunction): void => {
    // Determine client identifier: use IP or player ID if present
    const key = (req.headers['x-forwarded-for'] as string) || req.ip || 'anonymous';
    const now = Date.now();

    const record = records.get(key);

    if (!record || now > record.resetTime) {
      records.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      next();
      return;
    }

    record.count += 1;

    if (record.count > max) {
      return next(new AppError(429, 'RATE_LIMITED', message));
    }

    next();
  };
}

// Clean up expired records periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of records.entries()) {
    if (now > record.resetTime) {
      records.delete(key);
    }
  }
}, 60000); // Clean up every 1 minute
