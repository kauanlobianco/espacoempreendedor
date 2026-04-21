import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';

export async function createApp(): Promise<INestApplication> {
  const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = module.createNestApplication();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.init();
  return app;
}

export async function truncateTables(prisma: PrismaService) {
  await prisma.$transaction([
    prisma.auditLog.deleteMany(),
    prisma.validation.deleteMany(),
    prisma.extensionHours.deleteMany(),
    prisma.attendance.deleteMany(),
    prisma.caseAssignment.deleteMany(),
    prisma.case.deleteMany(),
    prisma.entrepreneurRequest.deleteMany(),
    prisma.studentProfile.deleteMany(),
    prisma.professorProfile.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}
