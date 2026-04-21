import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CaseStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { MailService } from '../mail/mail.service';
import { requestReceivedTemplate } from '../mail/templates';
import { CreateRequestDto } from './dto/create-request.dto';

@Injectable()
export class RequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly mail: MailService,
  ) {}

  async submit(dto: CreateRequestDto) {
    if (!dto.consentAccepted) {
      throw new BadRequestException('É necessário aceitar o consentimento para prosseguir');
    }

    const request = await this.prisma.$transaction(async (tx) => {
      const req = await tx.entrepreneurRequest.create({
        data: {
          fullName: dto.fullName,
          email: dto.email ?? null,
          phone: dto.phone,
          cpf: dto.cpf ?? null,
          city: dto.city ?? null,
          state: dto.state?.toUpperCase() ?? null,
          category: dto.category,
          description: dto.description,
          preferredChannel: dto.preferredChannel ?? null,
          consentAccepted: dto.consentAccepted,
        },
      });

      const code = await this.nextCaseCode(tx);
      const summary = dto.description.slice(0, 140);

      await tx.case.create({
        data: {
          code,
          requestId: req.id,
          category: dto.category,
          status: CaseStatus.NEW,
          summary,
        },
      });

      return req;
    });

    await this.audit.log({
      action: 'REQUEST_SUBMITTED',
      entity: 'EntrepreneurRequest',
      entityId: request.id,
      metadata: { category: request.category },
    });

    if (request.email) {
      await this.mail.send({
        to: request.email,
        subject: 'Solicitação recebida — Espaço Empreendedor',
        html: requestReceivedTemplate({
          fullName: request.fullName,
          category: request.category,
          trackingToken: request.trackingToken,
        }),
      });
    }

    return {
      requestId: request.id,
      message: 'Solicitação recebida. Use seu e-mail ou telefone para acompanhar.',
    };
  }

  async findByContact(contact: string) {
    const trimmed = contact.trim();
    const isEmail = trimmed.includes('@');

    // normalize phone: keep only digits for comparison
    const digitsOnly = trimmed.replace(/\D/g, '');

    const req = await this.prisma.entrepreneurRequest.findFirst({
      where: isEmail
        ? { email: { equals: trimmed, mode: 'insensitive' } }
        : { phone: { contains: digitsOnly } },
      orderBy: { createdAt: 'desc' },
      include: {
        case: {
          select: {
            id: true,
            code: true,
            status: true,
            category: true,
            updatedAt: true,
            assignments: {
              where: { active: true },
              take: 1,
              select: {
                student: {
                  select: {
                    id: true,
                    fullName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!req) throw new NotFoundException('Solicitação não encontrada com esse contato.');

    return {
      fullName: req.fullName,
      category: req.category,
      preferredChannel: req.preferredChannel,
      createdAt: req.createdAt,
      case: req.case
        ? {
            id: req.case.id,
            code: req.case.code,
            status: req.case.status,
            category: req.case.category,
            updatedAt: req.case.updatedAt,
            assigneeName: req.case.assignments[0]?.student.fullName ?? null,
          }
        : null,
    };
  }

  private async nextCaseCode(tx: Pick<PrismaService, 'case'>) {
    const year = new Date().getFullYear();
    const count = await tx.case.count({
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01T00:00:00Z`),
          lt: new Date(`${year + 1}-01-01T00:00:00Z`),
        },
      },
    });
    return `EE-${year}-${String(count + 1).padStart(5, '0')}`;
  }
}
