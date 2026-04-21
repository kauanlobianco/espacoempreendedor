import { Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  list(role?: UserRole) {
    return this.prisma.user.findMany({
      where: role ? { role } : undefined,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        active: true,
        createdAt: true,
        studentProfile: true,
        professorProfile: true,
      },
      orderBy: { fullName: 'asc' },
    });
  }

  listPendingStudents() {
    return this.prisma.user.findMany({
      where: {
        role: UserRole.STUDENT,
        active: false,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        active: true,
        createdAt: true,
        studentProfile: true,
        professorProfile: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        active: true,
        createdAt: true,
        studentProfile: true,
        professorProfile: true,
      },
    });
    if (!user) throw new NotFoundException('Usuario nao encontrado');
    return user;
  }

  async studentPerformance(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        active: true,
        createdAt: true,
        studentProfile: true,
      },
    });

    if (!user || user.role !== UserRole.STUDENT) {
      throw new NotFoundException('Aluno nao encontrado');
    }

    const cases = await this.prisma.case.findMany({
      where: {
        assignments: {
          some: { studentId: id },
        },
      },
      include: {
        request: {
          select: {
            fullName: true,
            phone: true,
          },
        },
        assignments: {
          where: { studentId: id },
          orderBy: { assignedAt: 'desc' },
          select: {
            assignedAt: true,
            unassignedAt: true,
            active: true,
          },
        },
        attendances: {
          where: { studentId: id },
          orderBy: { occurredAt: 'asc' },
          select: {
            id: true,
            channel: true,
            durationMin: true,
            summary: true,
            nextStep: true,
            occurredAt: true,
            createdAt: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const caseIds = cases.map((item) => item.id);
    const logs = caseIds.length
      ? await this.prisma.auditLog.findMany({
          where: {
            entity: 'Case',
            entityId: { in: caseIds },
            action: { in: [AuditAction.CASE_ASSIGNED, AuditAction.CASE_STATUS_CHANGED] },
          },
          orderBy: { createdAt: 'asc' },
        })
      : [];

    const logsByCase = new Map<string, typeof logs>();
    for (const log of logs) {
      const current = logsByCase.get(log.entityId) ?? [];
      current.push(log);
      logsByCase.set(log.entityId, current);
    }

    const totalMinutes = cases.reduce(
      (sum, item) => sum + item.attendances.reduce((inner, attendance) => inner + attendance.durationMin, 0),
      0,
    );

    const openStatuses = new Set(['NEW', 'TRIAGED', 'ASSIGNED', 'IN_PROGRESS', 'WAITING_USER', 'WAITING_SUPERVISION']);
    const concludedStatuses = new Set(['RESOLVED', 'CLOSED']);

    const items = cases.map((item) => {
      const caseMinutes = item.attendances.reduce((sum, attendance) => sum + attendance.durationMin, 0);
      const assignment = item.assignments[0];
      const history = (logsByCase.get(item.id) ?? []).map((log) => ({
        id: log.id,
        action: log.action,
        createdAt: log.createdAt,
        metadata: log.metadata,
      }));

      return {
        id: item.id,
        code: item.code,
        category: item.category,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        closedAt: item.closedAt,
        request: item.request,
        assignedAt: assignment?.assignedAt ?? null,
        totalAttendances: item.attendances.length,
        totalMinutes: caseMinutes,
        attendances: item.attendances,
        history,
      };
    });

    return {
      student: user,
      stats: {
        totalCases: items.length,
        openCases: items.filter((item) => openStatuses.has(item.status)).length,
        concludedCases: items.filter((item) => concludedStatuses.has(item.status)).length,
        totalMinutes,
        totalHours: Number((totalMinutes / 60).toFixed(1)),
      },
      cases: items,
    };
  }

  async setActive(id: string, active: boolean) {
    await this.findById(id);
    return this.prisma.user.update({
      where: { id },
      data: { active },
      select: { id: true, active: true },
    });
  }
}
