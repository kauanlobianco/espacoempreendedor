import { Injectable } from '@nestjs/common';
import { AuditAction, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface AuditEntry {
  action: AuditAction;
  actorId?: string | null;
  entity: string;
  entityId: string;
  metadata?: Prisma.InputJsonValue;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(entry: AuditEntry) {
    await this.prisma.auditLog.create({
      data: {
        action: entry.action,
        actorId: entry.actorId ?? null,
        entity: entry.entity,
        entityId: entry.entityId,
        metadata: entry.metadata ?? Prisma.JsonNull,
      },
    });
  }

  list(params: { entity?: string; entityId?: string; actorId?: string; limit?: number }) {
    return this.prisma.auditLog.findMany({
      where: {
        ...(params.entity && { entity: params.entity }),
        ...(params.entityId && { entityId: params.entityId }),
        ...(params.actorId && { actorId: params.actorId }),
      },
      orderBy: { createdAt: 'desc' },
      take: params.limit ?? 100,
    });
  }
}
