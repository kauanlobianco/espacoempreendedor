import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ValidationStatus, ValidationTarget } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { MailService } from '../mail/mail.service';
import { validationDecidedTemplate } from '../mail/templates';
import { AuthUser } from '@/common/decorators/current-user.decorator';
import { DecideValidationDto } from './dto/decide-validation.dto';

@Injectable()
export class ValidationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly mail: MailService,
  ) {}

  listPending(target?: ValidationTarget) {
    return this.prisma.validation.findMany({
      where: {
        status: ValidationStatus.PENDING,
        ...(target && { target }),
      },
      include: {
        attendance: {
          include: {
            case: { select: { id: true, code: true, category: true } },
            student: { select: { id: true, fullName: true } },
          },
        },
        extensionHours: {
          include: { student: { select: { id: true, fullName: true } } },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async decide(actor: AuthUser, validationId: string, dto: DecideValidationDto) {
    const current = await this.prisma.validation.findUnique({
      where: { id: validationId },
      include: { extensionHours: true },
    });
    if (!current) throw new NotFoundException('Validação não encontrada');
    if (current.status !== ValidationStatus.PENDING) {
      throw new BadRequestException('Validação já foi decidida');
    }

    const decided = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.validation.update({
        where: { id: validationId },
        data: {
          status: dto.status,
          comment: dto.comment ?? null,
          reviewerId: actor.id,
          decidedAt: new Date(),
        },
      });

      if (current.target === ValidationTarget.EXTENSION_HOURS && current.extensionHoursId) {
        await tx.extensionHours.update({
          where: { id: current.extensionHoursId },
          data: { status: dto.status },
        });
      }

      return updated;
    });

    await this.audit.log({
      action: 'VALIDATION_DECIDED',
      actorId: actor.id,
      entity: 'Validation',
      entityId: validationId,
      metadata: { status: dto.status, target: current.target },
    });

    // Notifica o aluno cujo atendimento/horas foram validados
    const studentId =
      current.target === ValidationTarget.ATTENDANCE
        ? (
            await this.prisma.attendance.findUnique({
              where: { id: current.attendanceId! },
              select: { studentId: true },
            })
          )?.studentId
        : current.extensionHours?.studentId;

    if (studentId) {
      const student = await this.prisma.user.findUnique({
        where: { id: studentId },
        select: { email: true, fullName: true },
      });
      if (student?.email) {
        await this.mail.send({
          to: student.email,
          subject: `Validação ${dto.status === ValidationStatus.APPROVED ? 'aprovada' : 'reprovada'}`,
          html: validationDecidedTemplate({
            studentName: student.fullName,
            status: dto.status,
            target: current.target,
            comment: dto.comment,
          }),
        });
      }
    }

    return decided;
  }
}
