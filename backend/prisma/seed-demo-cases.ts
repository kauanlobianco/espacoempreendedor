import {
  AttendanceInteractionType,
  CaseCategory,
  CaseStatus,
  PrismaClient,
  ValidationStatus,
  ValidationTarget,
} from '@prisma/client';

const prisma = new PrismaClient();

type DemoCaseConfig = {
  kind: 'queue' | 'active' | 'closed';
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  category: CaseCategory;
  description: string;
  preferredChannel: string;
  summary: string;
  status: CaseStatus;
  priority: number;
  notes?: string;
  withAttendance?: boolean;
  occurredAtOffsetDays?: number;
  createdAtOffsetDays: number;
};

const DEMO_CASES: DemoCaseConfig[] = [
  {
    kind: 'queue',
    name: 'Marcia Oliveira',
    email: 'demo.fila1@empreendedor.local',
    phone: '11990000001',
    city: 'Sao Paulo',
    state: 'SP',
    category: CaseCategory.ABERTURA_MEI,
    description: 'Quer abrir MEI para servicos de manicure e precisa entender documentos e etapas iniciais.',
    preferredChannel: 'WHATSAPP',
    summary: 'Dúvidas sobre abertura de MEI para manicure.',
    status: CaseStatus.NEW,
    priority: 3,
    createdAtOffsetDays: 8,
  },
  {
    kind: 'queue',
    name: 'Carlos Henrique Dias',
    email: 'demo.fila2@empreendedor.local',
    phone: '11990000002',
    city: 'Osasco',
    state: 'SP',
    category: CaseCategory.NOTA_FISCAL,
    description: 'Precisa emitir nota fiscal de servico pela primeira vez e nao sabe por onde comecar.',
    preferredChannel: 'EMAIL',
    summary: 'Primeira emissao de nota fiscal de servico.',
    status: CaseStatus.NEW,
    priority: 2,
    createdAtOffsetDays: 6,
  },
  {
    kind: 'queue',
    name: 'Rosana Batista',
    email: 'demo.fila3@empreendedor.local',
    phone: '11990000003',
    city: 'Carapicuiba',
    state: 'SP',
    category: CaseCategory.GOV_BR,
    description: 'Nao consegue acessar a conta gov.br para consultar dados do MEI e emitir guias.',
    preferredChannel: 'TELEFONE',
    summary: 'Bloqueio de acesso na conta gov.br.',
    status: CaseStatus.TRIAGED,
    priority: 4,
    notes: '[DEMO] Caso triado aguardando aluno assumir.',
    createdAtOffsetDays: 5,
  },
  {
    kind: 'queue',
    name: 'Luciana Almeida',
    email: 'demo.fila4@empreendedor.local',
    phone: '11990000004',
    city: 'Barueri',
    state: 'SP',
    category: CaseCategory.DEBITOS_PARCELAMENTO,
    description: 'Quer parcelar debitos antigos do MEI e entender se existem pendencias na PGFN.',
    preferredChannel: 'WHATSAPP',
    summary: 'Parcelamento de debitos do MEI.',
    status: CaseStatus.TRIAGED,
    priority: 5,
    notes: '[DEMO] Caso com prioridade alta na fila.',
    createdAtOffsetDays: 4,
  },
  {
    kind: 'active',
    name: 'Juliana Prado',
    email: 'demo.aberto1@empreendedor.local',
    phone: '11990000005',
    city: 'Santo Andre',
    state: 'SP',
    category: CaseCategory.CCMEI,
    description: 'Perdeu o certificado do MEI e precisa localizar ou emitir novamente o CCMEI.',
    preferredChannel: 'EMAIL',
    summary: 'Recuperar ou reemitir CCMEI.',
    status: CaseStatus.ASSIGNED,
    priority: 2,
    notes: '[DEMO] Assumido por aluno e aguardando primeiro atendimento.',
    createdAtOffsetDays: 3,
  },
  {
    kind: 'active',
    name: 'Fernanda Costa',
    email: 'demo.aberto2@empreendedor.local',
    phone: '11990000006',
    city: 'Diadema',
    state: 'SP',
    category: CaseCategory.DECLARACAO_ANUAL,
    description: 'Esqueceu de entregar a declaracao anual e quer regularizar com orientacao passo a passo.',
    preferredChannel: 'WHATSAPP',
    summary: 'Regularizacao da declaracao anual em atraso.',
    status: CaseStatus.IN_PROGRESS,
    priority: 4,
    notes: '[DEMO] Em acompanhamento pelo aluno.',
    withAttendance: true,
    occurredAtOffsetDays: 2,
    createdAtOffsetDays: 3,
  },
  {
    kind: 'active',
    name: 'Paulo Roberto Nunes',
    email: 'demo.aberto3@empreendedor.local',
    phone: '11990000007',
    city: 'Sao Bernardo do Campo',
    state: 'SP',
    category: CaseCategory.REGULARIZACAO,
    description: 'Precisa ajustar dados cadastrais e entender por que o CNPJ aparece com divergencias.',
    preferredChannel: 'TELEFONE',
    summary: 'Regularizacao cadastral do MEI.',
    status: CaseStatus.WAITING_USER,
    priority: 3,
    notes: '[DEMO] Aguardando retorno do empreendedor com documentos.',
    withAttendance: true,
    occurredAtOffsetDays: 1,
    createdAtOffsetDays: 2,
  },
  {
    kind: 'active',
    name: 'Aline Mendes',
    email: 'demo.aberto4@empreendedor.local',
    phone: '11990000008',
    city: 'Maua',
    state: 'SP',
    category: CaseCategory.BENEFICIOS_PREVIDENCIARIOS,
    description: 'Quer entender como os pagamentos em dia impactam o acesso aos beneficios previdenciarios.',
    preferredChannel: 'PRESENCIAL',
    summary: 'Orientacao sobre beneficios previdenciarios do MEI.',
    status: CaseStatus.WAITING_SUPERVISION,
    priority: 1,
    notes: '[DEMO] Aguardando validacao interna do professor.',
    withAttendance: true,
    occurredAtOffsetDays: 1,
    createdAtOffsetDays: 2,
  },
  {
    kind: 'closed',
    name: 'Ricardo Pires',
    email: 'demo.concluido1@empreendedor.local',
    phone: '11990000009',
    city: 'Taboao da Serra',
    state: 'SP',
    category: CaseCategory.DAS,
    description: 'Precisava emitir DAS em atraso e confirmar os juros antes de pagar.',
    preferredChannel: 'WHATSAPP',
    summary: 'Emissao de DAS em atraso concluida.',
    status: CaseStatus.CLOSED,
    priority: 2,
    notes: '[DEMO] Caso concluido pelo aluno com orientacao finalizada.',
    withAttendance: true,
    occurredAtOffsetDays: 7,
    createdAtOffsetDays: 10,
  },
  {
    kind: 'closed',
    name: 'Sandra Regina Lopes',
    email: 'demo.concluido2@empreendedor.local',
    phone: '11990000010',
    city: 'Guarulhos',
    state: 'SP',
    category: CaseCategory.GOLPES_FRAUDES,
    description: 'Recebeu cobranca suspeita por boleto e precisava validar se era golpe.',
    preferredChannel: 'EMAIL',
    summary: 'Orientacao sobre boleto suspeito encerrada.',
    status: CaseStatus.CLOSED,
    priority: 5,
    notes: '[DEMO] Caso encerrado apos esclarecimento de golpe.',
    withAttendance: true,
    occurredAtOffsetDays: 6,
    createdAtOffsetDays: 9,
  },
  {
    kind: 'closed',
    name: 'Thiago Moreira',
    email: 'demo.concluido3@empreendedor.local',
    phone: '11990000011',
    city: 'Sao Paulo',
    state: 'SP',
    category: CaseCategory.CONSULTA_CNPJ,
    description: 'Queria entender a situacao cadastral do CNPJ e baixar comprovantes atualizados.',
    preferredChannel: 'TELEFONE',
    summary: 'Consulta e comprovantes de CNPJ resolvidos.',
    status: CaseStatus.CLOSED,
    priority: 2,
    notes: '[DEMO] Caso fechado com sucesso para demonstracao.',
    withAttendance: true,
    occurredAtOffsetDays: 5,
    createdAtOffsetDays: 8,
  },
];

function shiftDays(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
}

async function nextCaseCode() {
  const year = new Date().getFullYear();
  const count = await prisma.case.count({
    where: {
      createdAt: {
        gte: new Date(`${year}-01-01T00:00:00.000Z`),
        lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
      },
    },
  });

  return `EE-${year}-${String(count + 1).padStart(5, '0')}`;
}

async function cleanupPreviousDemoData() {
  const demoEmails = DEMO_CASES.map((item) => item.email);

  const existingRequests = await prisma.entrepreneurRequest.findMany({
    where: { email: { in: demoEmails } },
    select: { id: true, case: { select: { id: true } } },
  });

  const caseIds = existingRequests
    .map((item) => item.case?.id)
    .filter((value): value is string => Boolean(value));
  const requestIds = existingRequests.map((item) => item.id);

  if (caseIds.length > 0) {
    await prisma.auditLog.deleteMany({
      where: {
        OR: [
          { entity: 'Case', entityId: { in: caseIds } },
          { entity: 'EntrepreneurRequest', entityId: { in: requestIds } },
        ],
      },
    });
  }

  await prisma.entrepreneurRequest.deleteMany({
    where: { id: { in: requestIds } },
  });
}

async function createDemoCase(config: DemoCaseConfig, studentId: string, professorId: string) {
  const createdAt = shiftDays(config.createdAtOffsetDays);
  const occurredAt = config.occurredAtOffsetDays
    ? shiftDays(config.occurredAtOffsetDays)
    : createdAt;

  const request = await prisma.entrepreneurRequest.create({
    data: {
      fullName: config.name,
      email: config.email,
      phone: config.phone,
      city: config.city,
      state: config.state,
      category: config.category,
      description: config.description,
      preferredChannel: config.preferredChannel,
      consentAccepted: true,
      createdAt,
    },
  });

  const code = await nextCaseCode();
  const createdCase = await prisma.case.create({
    data: {
      code,
      requestId: request.id,
      category: config.category,
      status: config.status,
      priority: config.priority,
      summary: config.summary,
      notes: config.notes ?? `[DEMO] Caso ficticio do tipo ${config.kind}.`,
      createdAt,
      updatedAt: config.status === CaseStatus.NEW || config.status === CaseStatus.TRIAGED ? createdAt : occurredAt,
      closedAt: config.status === CaseStatus.CLOSED ? occurredAt : null,
    },
  });

  if (config.kind !== 'queue') {
    await prisma.caseAssignment.create({
      data: {
        caseId: createdCase.id,
        studentId,
        assignedAt: createdAt,
        active: true,
      },
    });
  }

  if (config.withAttendance) {
    const attendance = await prisma.attendance.create({
      data: {
        caseId: createdCase.id,
        studentId,
        channel: config.preferredChannel,
        interactionType:
          config.kind === 'closed'
            ? AttendanceInteractionType.DETAILED_SUPPORT
            : AttendanceInteractionType.GUIDANCE_WITH_REFERRAL,
        demandDescription: config.description,
        actionTaken:
          config.kind === 'closed'
            ? 'Aluno orientou o empreendedor, validou o fluxo oficial e registrou o encerramento do atendimento.'
            : 'Aluno realizou atendimento inicial, explicou os passos e deixou encaminhamentos registrados.',
        outcome:
          config.kind === 'closed'
            ? 'Demanda resolvida e caso apto para encerramento.'
            : 'Demanda em acompanhamento com proximo passo definido.',
        needsFollowUp: config.kind !== 'closed',
        internalNotes: '[DEMO] Atendimento criado automaticamente para demonstracao.',
        durationMin: config.kind === 'closed' ? 45 : 30,
        summary: config.summary,
        nextStep:
          config.kind === 'closed'
            ? 'Sem proximo passo. Caso concluido.'
            : 'Aguardar retorno ou validacao para continuidade.',
        occurredAt,
        createdAt: occurredAt,
      },
    });

    await prisma.validation.create({
      data: {
        target: ValidationTarget.ATTENDANCE,
        attendanceId: attendance.id,
        reviewerId: professorId,
        status: config.kind === 'closed' ? ValidationStatus.APPROVED : ValidationStatus.PENDING,
        comment:
          config.kind === 'closed'
            ? '[DEMO] Atendimento aprovado para compor historico.'
            : '[DEMO] Validacao pendente para demonstracao.',
        decidedAt: config.kind === 'closed' ? occurredAt : null,
        createdAt: occurredAt,
      },
    });
  }

  return createdCase;
}

async function main() {
  const [student, professor] = await Promise.all([
    prisma.user.findUnique({ where: { email: 'aluno@uni.br' } }),
    prisma.user.findUnique({ where: { email: 'professor@uni.br' } }),
  ]);

  if (!student) {
    throw new Error('Usuario aluno@uni.br nao encontrado.');
  }

  if (!professor) {
    throw new Error('Usuario professor@uni.br nao encontrado.');
  }

  await cleanupPreviousDemoData();

  const createdCases = [];
  for (const item of DEMO_CASES) {
    const createdCase = await createDemoCase(item, student.id, professor.id);
    createdCases.push({ code: createdCase.code, status: createdCase.status, summary: createdCase.summary });
  }

  const summary = await prisma.case.groupBy({
    by: ['status'],
    where: {
      OR: [
        { request: { email: { in: DEMO_CASES.map((item) => item.email) } } },
        { assignments: { some: { studentId: student.id, active: true } } },
      ],
    },
    _count: true,
  });

  console.log('Casos demo criados:', createdCases);
  console.log('Resumo por status (recorte demo + aluno):', summary);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
