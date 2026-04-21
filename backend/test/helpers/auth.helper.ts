import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export interface Credentials {
  accessToken: string;
  userId: string;
}

export async function registerAndLogin(
  app: INestApplication,
  overrides: Partial<{
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    enrollment: string;
    course: string;
    semester: number;
    department: string;
  }> = {},
): Promise<Credentials> {
  const defaults = {
    email: `user_${Date.now()}@test.com`,
    password: 'Senha@123Test',
    fullName: 'Usuário Teste',
    role: UserRole.STUDENT,
    enrollment: `MAT${Date.now()}`,
    course: 'Administração',
    semester: 3,
  };
  const payload = { ...defaults, ...overrides };

  const res = await request(app.getHttpServer())
    .post('/api/auth/register')
    .send(payload)
    .expect(201);

  return { accessToken: res.body.accessToken, userId: res.body.user.id };
}
