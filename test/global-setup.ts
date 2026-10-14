import { execSync } from 'node:child_process';

export default function setup() {
  // prisma.config.ts loads .env.test because NODE_ENV is 'test' under Vitest.
  execSync('prisma migrate deploy', {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'test' },
  });
}
