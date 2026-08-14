import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

/**
 * Lightweight structured request logging middleware.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const requestId = randomUUID();
  req.requestId = requestId;
  const start = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - start;
    const logEntry = {
      requestId,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs,
    };
    console.log(JSON.stringify(logEntry));
  });

  next();
}
