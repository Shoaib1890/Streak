import { PrismaClient } from '@prisma/client';

const isProduction = process.env.NODE_ENV === 'production';

export const prisma = new PrismaClient({
  // Never log SQL in production — queries include puzzle answers.
  log: isProduction ? ['error'] : ['warn', 'error'],
});
