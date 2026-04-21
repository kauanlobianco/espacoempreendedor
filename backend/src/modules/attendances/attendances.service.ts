import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CaseStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { AuthUser } from '@/common/decorators/current-user.decorator';
import { CreateAttendanceDto, INTERACTION_DURATION } from './dto/create-attendance.dto';

@Injectable()
export class AttendancesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async create(actor: AuthUser, caseId: string, dto: CreateAttendanceDto) {
    const found = await this.prisma.case.findUnique({
      where: { id: caseId },
      include: { assignments: { where: { active: true } } },
    });
    if (!found) throw new NotFoundException('Caso nao encontrado');

    if (actor.role === UserRole.STUDENT) {
      const isAssignee = found.assignments.some((a) => a.studentId === actor.id);
      if (!isAssignee) {
        throw new ForbiddenException('Somente o aluno responsavel pode registrar atendimento');
      }
    }

    const durationMin = INTERACTION_DURATION[dto.interactionType];
    const summary = `${dto.demandDescription} | ${dto.actionTaken}`;
    const nextStep = dto.needsFollowUp ? `Pendente: ${dto.outcome}` : null;

    const attendance = await this.prisma.$transaction(async (tx) => {
      const created = await tx.attendance.create({
        data: {
          caseId,
          studentId: actor.id,
          channel: dto.channel,
          interactionType: dto.interactionType,
          demandDescription: dto.demandDescription,
          actionTaken: dto.actionTaken,
          outcome: dto.outcome,
          needsFollowUp: dto.needsFollowUp,
          internalNotes: dto.internalNotes ?? null,
          durationMin,
          summary,
          nextStep,
          occurredAt: dto.occurredAt ?? new Date(),
        },
      });

      // Avança automaticamente para IN_PROGRESS quando ainda estava em ASSIGNED
      if (found.status === CaseStatus.ASSIGNED) {
        await tx.case.update({
          where: { id: caseId },
          data: { status: CaseStatus.IN_PROGRESS },
        });
      }

      return created;
    });

    await this.audit.log({
      action: 'ATTENDANCE_CREATED',
      actorId: actor.id,
      entity: 'Attendance',
      entityId: attendance.id,
      metadata: { caseId, interactionType: dto.interactionType, durationMin },
    });

    return attendance;
  }

  async listByCase(caseId: string) {
    return this.prisma.attendance.findMany({
      where: { caseId },
      include: {
        student: { select: { id: true, fullName: true } },
        validations: { include: { reviewer: { select: { id: true, fullName: true } } } },
      },
      orderBy: { occurredAt: 'desc' },
    });
  }
}
