import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'dotenv';
import { PrismaClient } from '@prisma/client';

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export function databaseNameFromUrl(url: string): string {
  return new URL(url).pathname.replace(/^\//, '').split('?')[0];
}

/** Refuses to run integration tests against a non-test database. */
export function assertTestDatabase(): void {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set for tests. Copy backend/.env.test.example to backend/.env.test and create the streak_test database.'
    );
  }

  let dbName: string;
  try {
    dbName = databaseNameFromUrl(url);
  } catch {
    throw new Error(`Invalid test DATABASE_URL: ${url}`);
  }

  if (!dbName.endsWith('_test')) {
    throw new Error(
      `Refusing to run tests against "${dbName}". Test DATABASE_URL must use a database name ending with "_test" (e.g. streak_test).`
    );
  }
}

/** Reads the development DATABASE_URL from backend/.env without loading it into process.env. */
export function readDevDatabaseUrlFromEnvFile(): string | null {
  const envPath = path.join(backendRoot, '.env');
  if (!existsSync(envPath)) return null;

  const parsed = parse(readFileSync(envPath, 'utf8'));
  return parsed.DATABASE_URL ?? null;
}

export function createPrismaClientForUrl(url: string): PrismaClient {
  return new PrismaClient({
    datasources: { db: { url } },
    log: ['error'],
  });
}
