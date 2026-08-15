import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { config } from 'dotenv';
import { assertTestDatabase, databaseNameFromUrl } from '../tests/helpers/testDatabase.js';

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

config({ path: path.join(backendRoot, '.env.test'), override: true });
process.env.NODE_ENV = 'test';

assertTestDatabase();

const dbName = databaseNameFromUrl(process.env.DATABASE_URL!);
console.log(`Preparing test database "${dbName}"…`);

try {
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: process.env,
    cwd: backendRoot,
  });
} catch {
  console.error(
    `\nFailed to migrate test database "${dbName}". Create it first, for example:\n` +
      `  psql -U postgres -c "CREATE DATABASE ${dbName};"\n` +
      `Or with Docker:\n` +
      `  docker exec streak-db psql -U streak -c "CREATE DATABASE ${dbName};"\n`
  );
  process.exit(1);
}

console.log(`Test database "${dbName}" is ready.`);
