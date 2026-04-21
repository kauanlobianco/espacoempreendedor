import { execSync } from 'child_process';

export default async function globalSetup() {
  // Garante que as migrations do banco de teste estão aplicadas
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL_TEST ?? process.env.DATABASE_URL },
    stdio: 'pipe',
  });
}
