import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Senha@123', 10);

  const professor = await prisma.user.upsert({
    where: { email: 'professor@uni.br' },
    update: {},
    create: {
      email: 'professor@uni.br',
      passwordHash,
      fullName: 'Professora Ana Souza',
      role: UserRole.PROFESSOR,
      professorProfile: {
        create: { department: 'Administração', title: 'Dra.' },
      },
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'aluno@uni.br' },
    update: {},
    create: {
      email: 'aluno@uni.br',
      passwordHash,
      fullName: 'Aluno João Lima',
      role: UserRole.STUDENT,
      studentProfile: {
        create: { enrollment: '2025001', course: 'Administração', semester: 5 },
      },
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@uni.br' },
    update: {},
    create: {
      email: 'admin@uni.br',
      passwordHash,
      fullName: 'Administrador',
      role: UserRole.ADMIN,
    },
  });

  console.log('Seed concluído:', {
    professor: professor.email,
    student: student.email,
    admin: admin.email,
    senhaPadrao: 'Senha@123',
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
