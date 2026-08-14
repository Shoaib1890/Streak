import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import { prisma } from '../../src/lib/prisma.js';

describe('Production rate limiting on main routes', () => {
  let prodApp: Express;
  const originalNodeEnv = process.env.NODE_ENV;
  const createdPlayerIds: string[] = [];

  beforeAll(async () => {
    vi.resetModules();
    process.env.NODE_ENV = 'production';
    const mod = await import('../../src/app.js');
    prodApp = mod.default;
  });

  afterAll(async () => {
    for (const id of createdPlayerIds) {
      await prisma.attempt.deleteMany({ where: { playerId: id } });
      await prisma.player.delete({ where: { id } });
    }
    process.env.NODE_ENV = originalNodeEnv;
    vi.resetModules();
  });

  it('should return 429 when player creation limit is exceeded on /api/v1/players', async () => {
    const statuses: number[] = [];

    for (let i = 0; i < 6; i++) {
      const res = await request(prodApp)
        .post('/api/v1/players')
        .send({ displayName: `Rate${i}` });
      statuses.push(res.status);
      if (res.status === 201) {
        createdPlayerIds.push(res.body.playerId);
      }
    }

    expect(statuses.filter((s) => s === 201)).toHaveLength(5);
    expect(statuses.filter((s) => s === 429)).toHaveLength(1);
    expect(statuses[5]).toBe(429);
  });
});
