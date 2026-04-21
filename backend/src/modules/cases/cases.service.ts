import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CaseStatus, Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { MailService } from '../mail/mail.service';
import { caseAssignedTemplate, caseStatusChangedTemplate } from '../mail/templates';
import { AuthUser } from '@/common/decorators/current-user.decorator';
import { ListCasesDto } from './dto/list-cases.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

const ALLOWED_TRANSITIONS: Record<CaseStatus, CaseStatus[]> = {
  NEW: ['TRIAGED', 'ASSIGNED', 'CANCELLED'],
  TRIAGED: ['ASSIGNED', 'CANCELLED'],
  ASSIGNED: ['IN_PROGRESS', 'WAITING_USER', 'RESOLVED', 'CLOSED', 'CANCELLED'],
  IN_PROGRESS: ['WAITING_USER', 'WAITING_SUPERVISION', 'RESOLVED', 'CLOSED', 'CANCELLED'],
  WAITING_USER: ['IN_PROGRESS', 'CLOSED', 'CANCELLED'],
  WAITING_SUPERVISION: ['IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED'],
  RESOLVED: ['CLOSED'],
  CLOSED: [],
  CANCELLED: [],
};

@Injectable()
export class CasesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly mail: MailService,
  ) {}

  async list(actor: AuthUser, filters: ListCasesDto) {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 20;

    const where: Prisma.CaseWhereInput = {
      ...(filters.status && { status: filters.status }),
      ...(filters.category && { category: filters.category }),
      ...(filters.from || filters.to
        ? {
            createdAt: {
              ...(filters.from && { gte: filters.from }),
              ...(filters.to && { lte: filters.to }),
            },
          }
        : {}),
      ...(filters.assigneeId && {
        assignments: { some: { studentId: filters.assigneeId, active: true } },
      }),
    };

    if (actor.role === UserRole.STUDENT) {
      where.OR = [
        { status: { in: [CaseStatus.NEW, CaseStatus.TRIAGED] } },
        { assignments: { some: { studentId: actor.id, active: true } } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.case.findMany({
        where,
        include: {
          request: { select: { fullName: true, phone: true, city: true, state: true } },
          assignments: {
            where: { active: true },
            include: {
              student: { select: { id: true, fullName: true, email: true } },
            },
          },
        },
        orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.case.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  async findById(actor: AuthUser, id: string) {
    const found = await this.prisma.case.findUnique({
      where: { id },
      include: {
        request: true,
        assignments: {
          include: { student: { select: { id: true, fullName: true, email: true } } },
          orderBy: { assignedAt: 'desc' },
        },
        attendances: {
          include: {
            student: { select: { id: true, fullName: true } },
            validations: true,
          },
          orderBy: { occurredAt: 'desc' },
        },
      },
    });
    if (!found) throw new NotFoundException('Caso nao encontrado');

    if (actor.role === UserRole.STUDENT) {
      const isAssignee = found.assignments.some(
        (a) => a.active && a.studentId === actor.id,
      );
      const isInQueue = found.status === CaseStatus.NEW || found.status === CaseStatus.TRIAGED;
      if (!isAssignee && !isInQueue) {
        throw new ForbiddenException('Sem acesso a este caso');
      }
    }

    return found;
  }

  async assignToStudent(actor: AuthUser, caseId: string, studentId: string) {
    if (actor.role === UserRole.STUDENT && actor.id !== studentId) {
      throw new ForbiddenException('Aluno so pode assumir caso para si mesmo');
    }

    const student = await this.prisma.user.findUnique({ where: { id: studentId } });
    if (!student || student.role !== UserRole.STUDENT || !student.active) {
      throw new BadRequestException('Aluno invalido');
    }

    const found = await this.prisma.case.findUnique({
      where: { id: caseId },
      include: { assignments: { where: { active: true } } },
    });
    if (!found) throw new NotFoundException('Caso nao encontrado');

    if (found.assignments.length > 0) {
      throw new ConflictException('Caso ja possui aluno atribuido');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.caseAssignment.create({
        data: { caseId, studentId, active: true },
      });
      return tx.case.update({
        where: { id: caseId },
        data: {
          status: CaseStatus.ASSIGNED,
        },
      });
    });

    await this.audit.log({
      action: 'CASE_ASSIGNED',
      actorId: actor.id,
      entity: 'Case',
      entityId: caseId,
      metadata: { studentId },
    });

    if (student.email) {
      await this.mail.send({
        to: student.email,
        subject: `Caso ${found.code} atribuido a voce`,
        html: caseAssignedTemplate({
          studentName: student.fullName,
          caseCode: found.code,
          category: found.category,
        }),
      });
    }

    return updated;
  }

  async updateStatus(actor: AuthUser, caseId: string, dto: UpdateStatusDto) {
    const found = await this.findById(actor, caseId);
    const allowed = ALLOWED_TRANSITIONS[found.status];
    if (!allowed.includes(dto.status)) {
      throw new BadRequestException(`Transicao invalida: ${found.status} -> ${dto.status}`);
    }

    if (actor.role === UserRole.STUDENT) {
      const isAssignee = found.assignments.some(
        (a) => a.active && a.studentId === actor.id,
      );
      if (!isAssignee) {
        throw new ForbiddenException('Somente o responsavel pode alterar o status');
      }
    }

    const updated = await this.prisma.case.update({
      where: { id: caseId },
      data: {
        status: dto.status,
        ...(dto.status === CaseStatus.CLOSED && { closedAt: new Date() }),
        ...(dto.note && { notes: dto.note }),
      },
    });

    await this.audit.log({
      action: 'CASE_STATUS_CHANGED',
      actorId: actor.id,
      entity: 'Case',
      entityId: caseId,
      metadata: { from: found.status, to: dto.status, note: dto.note },
    });

    const activeAssignment = found.assignments.find((a) => a.active);
    if (activeAssignment && actor.role !== UserRole.STUDENT) {
      const assignedStudent = await this.prisma.user.findUnique({
        where: { id: activeAssignment.studentId },
        select: { email: true, fullName: true },
      });
      if (assignedStudent?.email) {
        await this.mail.send({
          to: assignedStudent.email,
          subject: `Status do caso ${found.code} atualizado`,
          html: caseStatusChangedTemplate({
            caseCode: found.code,
            fromStatus: found.status,
            toStatus: dto.status,
            actorName: assignedStudent.fullName,
          }),
        });
      }
    }

    return updated;
  }
}
