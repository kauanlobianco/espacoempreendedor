import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, UserRole, ValidationStatus, ValidationTarget } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { AuthUser } from '@/common/decorators/current-user.decorator';
import { CreateExtensionHoursDto } from './dto/create-extension-hours.dto';

@Injectable()
export class ExtensionHoursService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async log(actor: AuthUser, dto: CreateExtensionHoursDto) {
    if (actor.role !== UserRole.STUDENT) {
      throw new ForbiddenException('Somente alunos registram horas extensionistas');
    }

    const entry = await this.prisma.$transaction(async (tx) => {
      const created = await tx.extensionHours.create({
        data: {
          studentId: actor.id,
          referenceDate: dto.referenceDate,
          hours: dto.hours,
          activity: dto.activity,
          status: ValidationStatus.PENDING,
        },
      });

      await tx.validation.create({
        data: {
          target: ValidationTarget.EXTENSION_HOURS,
          extensionHoursId: created.id,
          reviewerId: await this.pickReviewer(tx),
          status: ValidationStatus.PENDING,
        },
      });

      return created;
    });

    await this.audit.log({
      action: 'EXTENSION_HOURS_LOGGED',
      actorId: actor.id,
      entity: 'ExtensionHours',
      entityId: entry.id,
      metadata: { hours: entry.hours },
    });

    return entry;
  }

  async listMine(actor: AuthUser) {
    return this.prisma.extensionHours.findMany({
      where: { studentId: actor.id },
      include: { validations: true },
      orderBy: { referenceDate: 'desc' },
    });
  }

  async summary(studentId: string) {
    const student = await this.prisma.user.findUnique({ where: { id: studentId } });
    if (!student || student.role !== UserRole.STUDENT) {
      throw new NotFoundException('Aluno não encontrado');
    }

    const grouped = await this.prisma.extensionHours.groupBy({
      by: ['status'],
      where: { studentId },
      _sum: { hours: true },
    });

    const base = { APPROVED: 0, PENDING: 0, REJECTED: 0 };
    for (const g of grouped) base[g.status] = g._sum.hours ?? 0;
    return { studentId, ...base, total: base.APPROVED + base.PENDING + base.REJECTED };
  }

  private async pickReviewer(tx: Prisma.TransactionClient) {
    const prof = await tx.user.findFirst({
      where: { role: UserRole.PROFESSOR, active: true },
      orderBy: { createdAt: 'asc' },
    });
    if (!prof) throw new NotFoundException('Nenhum professor disponível para validação');
    return prof.id;
  }
}
