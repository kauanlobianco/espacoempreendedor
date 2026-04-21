/**
 * Teste e2e do fluxo completo:
 * 1. Microempreendedor envia solicitação pública
 * 2. Aluno lista a fila e assume o caso
 * 3. Aluno registra atendimento
 * 4. Aluno muda status para WAITING_SUPERVISION
 * 5. Professor lista validações pendentes e aprova
 * 6. Aluno registra horas extensionistas
 * 7. Professor valida horas
 * 8. Professor fecha o caso
 * 9. Microempreendedor rastreia pelo token
 */

import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { createApp, truncateTables } from '../helpers/app.helper';
import { registerAndLogin } from '../helpers/auth.helper';
import { PrismaService } from '@/modules/prisma/prisma.service';

describe('Fluxo completo (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let studentToken: string;
  let studentId: string;
  let professorToken: string;
  let professorId: string;

  let trackingToken: string;
  let caseId: string;
  let attendanceId: string;

  beforeAll(async () => {
    app = await createApp();
    prisma = app.get(PrismaService);
    await truncateTables(prisma);

    const student = await registerAndLogin(app, {
      email: 'aluno@test.com',
      fullName: 'Aluno Teste',
      role: UserRole.STUDENT,
      enrollment: 'MAT001',
    });
    studentToken = student.accessToken;
    studentId = student.userId;

    const professor = await registerAndLogin(app, {
      email: 'prof@test.com',
      fullName: 'Professor Teste',
      role: UserRole.PROFESSOR,
      department: 'Admin',
    });
    professorToken = professor.accessToken;
    professorId = professor.userId;
  });

  afterAll(async () => {
    await truncateTables(prisma);
    await app.close();
  });

  // ── 1. Solicitação pública ────────────────────────────────────────
  it('POST /api/requests — recebe solicitação e retorna trackingToken', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/requests')
      .send({
        fullName: 'Maria Empreendedora',
        email: 'maria@exemplo.com',
        phone: '11999990000',
        category: 'ABERTURA_MEI',
        description: 'Quero abrir meu MEI mas não sei como começar, preciso de ajuda com o processo.',
        consentAccepted: true,
      })
      .expect(201);

    expect(res.body).toHaveProperty('trackingToken');
    expect(res.body).toHaveProperty('requestId');
    trackingToken = res.body.trackingToken;
  });

  it('POST /api/requests — rejeita sem consentimento', async () => {
    await request(app.getHttpServer())
      .post('/api/requests')
      .send({
        fullName: 'Maria',
        phone: '11999990000',
        category: 'ABERTURA_MEI',
        description: 'Descrição mínima de dez caracteres.',
        consentAccepted: false,
      })
      .expect(400);
  });

  // ── 2. Aluno lista fila e assume caso ─────────────────────────────
  it('GET /api/cases — aluno vê caso NEW na fila', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/cases')
      .set('Authorization', `Bearer ${studentToken}`)
      .query({ status: 'NEW' })
      .expect(200);

    expect(res.body.total).toBeGreaterThanOrEqual(1);
    caseId = res.body.items[0].id;
  });

  it('POST /api/cases/:id/assign — aluno assume caso para si', async () => {
    const res = await request(app.getHttpServer())
      .post(`/api/cases/${caseId}/assign`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ studentId })
      .expect(201);

    expect(res.body.status).toBe('ASSIGNED');
  });

  it('POST /api/cases/:id/assign — conflito ao tentar assumir caso já atribuído', async () => {
    await request(app.getHttpServer())
      .post(`/api/cases/${caseId}/assign`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ studentId })
      .expect(409);
  });

  // ── 3. Aluno inicia atendimento ───────────────────────────────────
  it('PATCH /api/cases/:id/status — aluno muda para IN_PROGRESS', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/cases/${caseId}/status`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ status: 'IN_PROGRESS' })
      .expect(200);

    expect(res.body.status).toBe('IN_PROGRESS');
  });

  it('POST /api/cases/:id/attendances — aluno registra atendimento', async () => {
    const res = await request(app.getHttpServer())
      .post(`/api/cases/${caseId}/attendances`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        channel: 'PRESENCIAL',
        durationMin: 45,
        summary: 'Orientei a empreendedora sobre o processo de abertura do MEI no Portal do Empreendedor.',
        nextStep: 'Empreendedora vai tentar acessar o Portal gov.br e retornar em caso de dúvidas.',
      })
      .expect(201);

    attendanceId = res.body.id;
    expect(res.body.caseId).toBe(caseId);
  });

  it('GET /api/cases/:id/attendances — lista atendimentos do caso', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/cases/${caseId}/attendances`)
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(200);

    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].id).toBe(attendanceId);
  });

  // ── 4. Aluno solicita supervisão ──────────────────────────────────
  it('PATCH /api/cases/:id/status — aluno muda para WAITING_SUPERVISION', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/cases/${caseId}/status`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ status: 'WAITING_SUPERVISION', note: 'Atendimento registrado, aguardando revisão.' })
      .expect(200);

    expect(res.body.status).toBe('WAITING_SUPERVISION');
  });

  it('PATCH /api/cases/:id/status — aluno NÃO pode fechar caso (transição inválida)', async () => {
    // WAITING_SUPERVISION → CLOSED é inválida (só permite IN_PROGRESS, RESOLVED, CANCELLED)
    await request(app.getHttpServer())
      .patch(`/api/cases/${caseId}/status`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ status: 'CLOSED' })
      .expect(400); // Bad Request — transição inválida
  });

  // ── 5. Professor valida atendimento ───────────────────────────────
  it('GET /api/validations/pending — professor lista validações pendentes', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/validations/pending')
      .set('Authorization', `Bearer ${professorToken}`)
      .expect(200);

    expect(res.body.length).toBeGreaterThanOrEqual(1);
    const validation = res.body.find(
      (v: { attendanceId: string }) => v.attendanceId === attendanceId,
    );
    expect(validation).toBeDefined();
  });

  it('PATCH /api/validations/:id/decision — professor aprova atendimento', async () => {
    const pending = await request(app.getHttpServer())
      .get('/api/validations/pending')
      .set('Authorization', `Bearer ${professorToken}`);

    const attendanceValidation = pending.body.find(
      (v: { attendanceId: string; target: string }) =>
        v.attendanceId === attendanceId && v.target === 'ATTENDANCE',
    );
    expect(attendanceValidation).toBeDefined();

    const res = await request(app.getHttpServer())
      .patch(`/api/validations/${attendanceValidation.id}/decision`)
      .set('Authorization', `Bearer ${professorToken}`)
      .send({ status: 'APPROVED', comment: 'Atendimento bem documentado. Aprovado.' })
      .expect(200);

    expect(res.body.status).toBe('APPROVED');
  });

  it('PATCH /api/validations/:id/decision — não pode decidir duas vezes', async () => {
    const pending = await request(app.getHttpServer())
      .get('/api/validations/pending')
      .set('Authorization', `Bearer ${professorToken}`);

    // Nenhuma validação pendente para o mesmo atendimento
    const dup = pending.body.find(
      (v: { attendanceId: string }) => v.attendanceId === attendanceId,
    );
    expect(dup).toBeUndefined();
  });

  // ── 6. Aluno registra horas extensionistas ────────────────────────
  it('POST /api/extension-hours — aluno registra horas', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/extension-hours')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        referenceDate: new Date().toISOString(),
        hours: 1.5,
        activity: 'Atendimento presencial ao microempreendedor — orientação sobre abertura de MEI',
      })
      .expect(201);

    expect(res.body.hours).toBe(1.5);
    expect(res.body.status).toBe('PENDING');
  });

  it('GET /api/extension-hours/me — aluno lista suas horas', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/extension-hours/me')
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(200);

    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  // ── 7. Professor valida horas extensionistas ──────────────────────
  it('PATCH /api/validations/:id/decision — professor aprova horas extensionistas', async () => {
    const pending = await request(app.getHttpServer())
      .get('/api/validations/pending')
      .set('Authorization', `Bearer ${professorToken}`);

    const hoursValidation = pending.body.find(
      (v: { target: string }) => v.target === 'EXTENSION_HOURS',
    );
    expect(hoursValidation).toBeDefined();

    const res = await request(app.getHttpServer())
      .patch(`/api/validations/${hoursValidation.id}/decision`)
      .set('Authorization', `Bearer ${professorToken}`)
      .send({ status: 'APPROVED' })
      .expect(200);

    expect(res.body.status).toBe('APPROVED');
  });

  it('GET /api/extension-hours/students/:id/summary — professor vê resumo de horas', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/extension-hours/students/${studentId}/summary`)
      .set('Authorization', `Bearer ${professorToken}`)
      .expect(200);

    expect(res.body.APPROVED).toBeGreaterThan(0);
  });

  // ── 8. Professor fecha o caso ─────────────────────────────────────
  it('PATCH /api/cases/:id/status — professor muda para RESOLVED depois fecha', async () => {
    // Volta para IN_PROGRESS primeiro (professor pode)
    await request(app.getHttpServer())
      .patch(`/api/cases/${caseId}/status`)
      .set('Authorization', `Bearer ${professorToken}`)
      .send({ status: 'IN_PROGRESS' })
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/api/cases/${caseId}/status`)
      .set('Authorization', `Bearer ${professorToken}`)
      .send({ status: 'RESOLVED' })
      .expect(200);

    const res = await request(app.getHttpServer())
      .patch(`/api/cases/${caseId}/status`)
      .set('Authorization', `Bearer ${professorToken}`)
      .send({ status: 'CLOSED' })
      .expect(200);

    expect(res.body.status).toBe('CLOSED');
    expect(res.body.closedAt).toBeTruthy();
  });

  // ── 9. Rastreio público por token ─────────────────────────────────
  it('GET /api/requests/track/:token — microempreendedor rastreia solicitação', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/requests/track/${trackingToken}`)
      .expect(200);

    expect(res.body.case.status).toBe('CLOSED');
    expect(res.body.category).toBe('ABERTURA_MEI');
  });

  // ── Auth / segurança ──────────────────────────────────────────────
  it('GET /api/cases — rejeita sem token', async () => {
    await request(app.getHttpServer()).get('/api/cases').expect(401);
  });

  it('GET /api/validations/pending — aluno não tem acesso', async () => {
    await request(app.getHttpServer())
      .get('/api/validations/pending')
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(403);
  });

  it('GET /api/users — aluno não pode listar usuários', async () => {
    await request(app.getHttpServer())
      .get('/api/users')
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(403);
  });

  it('GET /api/auth/me — retorna dados do usuário autenticado', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(200);

    expect(res.body.role).toBe('STUDENT');
  });
});
