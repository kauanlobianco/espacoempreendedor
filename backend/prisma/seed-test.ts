import { PrismaClient, CaseStatus, CaseCategory, AttendanceInteractionType } from '@prisma/client';

const prisma = new PrismaClient();

let codeSeq = 1;
function nextCode() {
  return `TST-${String(codeSeq++).padStart(4, '0')}`;
}

async function createCase(data: {
  code: string;
  summary: string;
  category: CaseCategory;
  status: CaseStatus;
  fullName: string;
  email?: string;
  phone: string;
  description: string;
  studentId: string;
  active: boolean;
}) {
  const request = await prisma.entrepreneurRequest.create({
    data: {
      fullName: data.fullName,
      email: data.email ?? null,
      phone: data.phone,
      category: data.category,
      description: data.description,
    },
  });

  return prisma.case.create({
    data: {
      code: data.code,
      requestId: request.id,
      category: data.category,
      status: data.status,
      summary: data.summary,
      assignments: { create: { studentId: data.studentId, active: data.active } },
    },
  });
}

async function main() {
  // Limpa dados anteriores
  await prisma.$executeRaw`DELETE FROM "AuditLog"`;
  await prisma.$executeRaw`DELETE FROM "ExtensionReportItem"`;
  await prisma.$executeRaw`DELETE FROM "ExtensionReport"`;
  await prisma.$executeRaw`DELETE FROM "Attendance"`;
  await prisma.$executeRaw`DELETE FROM "CaseAssignment"`;
  await prisma.$executeRaw`DELETE FROM "ExtensionHours"`;
  await prisma.$executeRaw`DELETE FROM "Case"`;
  await prisma.$executeRaw`DELETE FROM "EntrepreneurRequest"`;

  const student = await prisma.user.findUniqueOrThrow({ where: { email: 'aluno@uni.br' } });

  // CASOS EM ABERTO
  const open1 = await createCase({
    code: nextCode(),
    summary: 'Dúvida sobre abertura de MEI',
    category: CaseCategory.ABERTURA_MEI,
    status: CaseStatus.IN_PROGRESS,
    fullName: 'Maria Oliveira',
    email: 'maria@exemplo.com',
    phone: '(21) 91234-5678',
    description: 'Quero abrir um MEI mas não sei quais documentos preciso juntar.',
    studentId: student.id,
    active: true,
  });

  await prisma.attendance.create({
    data: {
      caseId: open1.id,
      studentId: student.id,
      channel: "WHATSAPP",
      interactionType: AttendanceInteractionType.SIMPLE_GUIDANCE,
      demandDescription: 'Quais documentos são necessários para abertura de MEI',
      actionTaken: 'Expliquei o passo a passo no Portal do Empreendedor e enviei link',
      outcome: 'Empreendedora ficou satisfeita, vai tentar abrir essa semana',
      needsFollowUp: true,
      durationMin: 15,
      summary: 'Orientação sobre documentação MEI',
      occurredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  const open2 = await createCase({
    code: nextCode(),
    summary: 'Problema com emissão de nota fiscal eletrônica',
    category: CaseCategory.NOTA_FISCAL,
    status: CaseStatus.WAITING_USER,
    fullName: 'Carlos Silva',
    email: 'carlos@exemplo.com',
    phone: '(21) 99876-5432',
    description: 'Estou com dificuldade para emitir NF-e pelo sistema da prefeitura.',
    studentId: student.id,
    active: true,
  });

  await prisma.attendance.create({
    data: {
      caseId: open2.id,
      studentId: student.id,
      channel: "PRESENCIAL",
      interactionType: AttendanceInteractionType.DETAILED_SUPPORT,
      demandDescription: 'Erro ao emitir NF-e no sistema da prefeitura',
      actionTaken: 'Acessamos juntos o portal e identificamos cadastro desatualizado',
      outcome: 'Encaminhado para atualizar dados cadastrais na prefeitura',
      needsFollowUp: true,
      durationMin: 45,
      summary: 'Suporte NF-e, aguardando retorno do cliente',
      occurredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  });

  await createCase({
    code: nextCode(),
    summary: 'Consulta sobre parcelamento de débitos',
    category: CaseCategory.DEBITOS_PARCELAMENTO,
    status: CaseStatus.ASSIGNED,
    fullName: 'Ana Ferreira',
    email: 'ana@exemplo.com',
    phone: '(21) 97654-3210',
    description: 'Tenho débitos em atraso e quero saber como parcelar.',
    studentId: student.id,
    active: true,
  });

  // CASOS CONCLUÍDOS
  const closed1 = await createCase({
    code: nextCode(),
    summary: 'Regularização de CCMEI',
    category: CaseCategory.CCMEI,
    status: CaseStatus.RESOLVED,
    fullName: 'Roberto Mendes',
    email: 'roberto@exemplo.com',
    phone: '(21) 98765-1234',
    description: 'Preciso regularizar meu Certificado da Condição de Microempreendedor.',
    studentId: student.id,
    active: false,
  });

  await prisma.attendance.create({
    data: {
      caseId: closed1.id,
      studentId: student.id,
      channel: "EMAIL",
      interactionType: AttendanceInteractionType.GUIDANCE_WITH_REFERRAL,
      demandDescription: 'Como emitir e regularizar CCMEI',
      actionTaken: 'Orientei sobre emissão no portal e encaminhei documentação necessária',
      outcome: 'Empreendedor conseguiu emitir o CCMEI online no mesmo dia',
      needsFollowUp: false,
      durationMin: 30,
      summary: 'Orientação CCMEI + encaminhamento portal',
      occurredAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
  });

  const closed2 = await createCase({
    code: nextCode(),
    summary: 'Orientação sobre contratação de empregado',
    category: CaseCategory.CONTRATACAO_EMPREGADO,
    status: CaseStatus.RESOLVED,
    fullName: 'Fernanda Costa',
    email: 'fernanda@exemplo.com',
    phone: '(21) 96543-2100',
    description: 'Quero contratar um funcionário CLT mas não sei como funciona para MEI.',
    studentId: student.id,
    active: false,
  });

  await prisma.attendance.createMany({
    data: [
      {
        caseId: closed2.id,
        studentId: student.id,
        channel: "WHATSAPP",
        interactionType: AttendanceInteractionType.SIMPLE_GUIDANCE,
        demandDescription: 'MEI pode contratar funcionário CLT?',
        actionTaken: 'Expliquei que MEI pode ter 1 empregado e quais são os encargos trabalhistas',
        outcome: 'Empreendedora entendeu a legislação e decidiu avançar',
        needsFollowUp: true,
        durationMin: 15,
        summary: 'Primeira orientação CLT MEI',
        occurredAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      },
      {
        caseId: closed2.id,
        studentId: student.id,
        channel: "PRESENCIAL",
        interactionType: AttendanceInteractionType.DETAILED_SUPPORT,
        demandDescription: 'Dúvidas sobre registro no eSocial e FGTS',
        actionTaken: 'Fizemos o passo a passo do eSocial juntos presencialmente',
        outcome: 'Funcionário registrado com sucesso, caso encerrado',
        needsFollowUp: false,
        durationMin: 45,
        summary: 'Suporte eSocial + registro CLT concluído',
        occurredAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  console.log('Seed concluído!');
  console.log('Em aberto: Abertura MEI (IN_PROGRESS), NF-e (WAITING_USER), Parcelamento (ASSIGNED)');
  console.log('Concluídos: CCMEI (RESOLVED), Contratação empregado (RESOLVED)');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
