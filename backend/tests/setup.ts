import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { assertTestDatabase } from './helpers/testDatabase.js';

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Always load test env before application modules import Prisma.
config({ path: path.join(backendRoot, '.env.test'), override: true });
process.env.NODE_ENV = 'test';

assertTestDatabase();
