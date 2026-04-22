import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CaseStatus,
  ExtensionReportStatus,
  Prisma,
  UserRole,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { AuthUser } from '@/common/decorators/current-user.decorator';
import { CreateDraftDto } from './dto/create-draft.dto';
import { UpdateDraftDto } from './dto/update-draft.dto';
import { ReturnReportDto } from './dto/return-report.dto';
import { ReportPdfService, ReportPdfPayload } from './pdf/report-pdf.service';
import { ReportStorageService } from './storage/report-storage.service';

const MIN_NARRATIVE_CHARS = 200;
const ELIGIBLE_CASE_STATUSES: CaseStatus[] = [CaseStatus.RESOLVED, CaseStatus.CLOSED];
const ATTENDANCE_TYPE_LABELS = {
  SIMPLE_GUIDANCE: 'Orientacao simples',
  GUIDANCE_WITH_REFERRAL: 'Orientacao com encaminhamento',
  DETAILED_SUPPORT: 'Apoio detalhado',
  ONGOING_CASE: 'Acompanhamento do caso',
} as const;
const CASE_STATUS_LABELS = {
  NEW: 'Novo',
  TRIAGED: 'Triado',
  ASSIGNED: 'Assumido',
  IN_PROGRESS: 'Em andamento',
  WAITING_USER: 'Aguardando retorno do empreendedor',
  WAITING_SUPERVISION: 'Aguardando acompanhamento interno',
  RESOLVED: 'Resolvido',
  CLOSED: 'Fechado',
  CANCELLED: 'Cancelado',
} as const;

@Injectable()
export class ExtensionReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly pdf: ReportPdfService,
    private readonly storage: ReportStorageService,
  ) {}

  // ---------- STUDENT ----------

  async listEligibleCases(actor: AuthUser) {
    this.ensureStudent(actor);
    const assignments = await this.prisma.caseAssignment.findMany({
      where: { studentId: actor.id },
      select: { caseId: true },
    });
    const caseIds = [...new Set(assignments.map((a) => a.caseId))];
    if (!caseIds.length) return [];

    // exclui casos já vinculados a relatórios não-RETURNED do mesmo aluno
    const lockedItems = await this.prisma.extensionReportItem.findMany({
      where: {
        caseId: { in: caseIds },
        report: {
          studentId: actor.id,
          status: { notIn: [ExtensionReportStatus.RETURNED, ExtensionReportStatus.DRAFT] },
        },
      },
      select: { caseId: true },
    });
    const locked = new Set(lockedItems.map((i) => i.caseId));

    const cases = await this.prisma.case.findMany({
      where: {
        id: { in: caseIds.filter((id) => !locked.has(id)) },
        status: { in: ELIGIBLE_CASE_STATUSES },
      },
      include: {
        attendances: {
          where: { studentId: actor.id },
          orderBy: { occurredAt: 'asc' },
        },
      },
      orderBy: { closedAt: 'desc' },
    });

    return cases.map((c) => ({
      id: c.id,
      code: c.code,
      category: c.category,
      summary: c.summary,
      status: c.status,
      closedAt: c.closedAt,
      attendances: c.attendances.length,
      totalHours: this.sumHours(c.attendances),
    }));
  }

  async listMine(actor: AuthUser) {
    this.ensureStudent(actor);
    return this.prisma.extensionReport.findMany({
      where: { studentId: actor.id },
      orderBy: { createdAt: 'desc' },
      select: this.publicSelect(),
    });
  }

  async getOne(actor: AuthUser, id: string) {
    const report = await this.loadWithItems(id);
    this.ensureCanRead(actor, report);
    return report;
  }

  async createDraft(actor: AuthUser, dto: CreateDraftDto) {
    this.ensureStudent(actor);
    const snapshots = await this.buildSnapshots(actor.id, dto.caseIds);
    const totalHours = snapshots.reduce((a, s) => a + s.snapshotHours, 0);
    const dates = snapshots.map((s) => new Date(s.snapshotDate).getTime());
    const code = await this.nextCode();

    const report = await this.prisma.$transaction(async (tx) => {
      const created = await tx.extensionReport.create({
        data: {
          code,
          studentId: actor.id,
          status: ExtensionReportStatus.DRAFT,
          narrative: '',
          totalHours,
          periodStart: dates.length ? new Date(Math.min(...dates)) : null,
          periodEnd: dates.length ? new Date(Math.max(...dates)) : null,
          items: { create: snapshots },
        },
        include: { items: true },
      });
      return created;
    });

    await this.audit.log({
      action: 'EXTENSION_REPORT_CREATED',
      actorId: actor.id,
      entity: 'ExtensionReport',
      entityId: report.id,
      metadata: { items: snapshots.length, totalHours },
    });
    return report;
  }

  async updateDraft(actor: AuthUser, id: string, dto: UpdateDraftDto) {
    this.ensureStudent(actor);
    const report = await this.loadWithItems(id);
    this.ensureOwner(actor, report);
    if (
      report.status !== ExtensionReportStatus.DRAFT &&
      report.status !== ExtensionReportStatus.RETURNED
    ) {
      throw new BadRequestException('Somente rascunhos ou devolvidos podem ser editados');
    }

    return this.prisma.$transaction(async (tx) => {
      const data: Prisma.ExtensionReportUpdateInput = {};
      if (dto.narrative !== undefined) data.narrative = dto.narrative;

      if (dto.caseIds) {
        const snapshots = await this.buildSnapshots(actor.id, dto.caseIds, tx);
        const totalHours = snapshots.reduce((a, s) => a + s.snapshotHours, 0);
        const dates = snapshots.map((s) => new Date(s.snapshotDate).getTime());
        await tx.extensionReportItem.deleteMany({ where: { reportId: id } });
        data.items = { create: snapshots };
        data.totalHours = totalHours;
        data.periodStart = dates.length ? new Date(Math.min(...dates)) : null;
        data.periodEnd = dates.length ? new Date(Math.max(...dates)) : null;
      }

      if (report.status === ExtensionReportStatus.RETURNED) {
        data.status = ExtensionReportStatus.DRAFT;
        data.generatedPdfKey = null;
      }

      return tx.extensionReport.update({
        where: { id },
        data,
        include: { items: true },
      });
    });
  }

  async submit(actor: AuthUser, id: string) {
    this.ensureStudent(actor);
    const report = await this.loadWithItems(id);
    this.ensureOwner(actor, report);

    if (
      report.status !== ExtensionReportStatus.DRAFT &&
      report.status !== ExtensionReportStatus.RETURNED
    ) {
      throw new BadRequestException('Este relatório não pode ser enviado no estado atual');
    }
    if (!report.items.length) {
      throw new BadRequestException('Selecione ao menos um caso');
    }
    if ((report.narrative?.trim().length ?? 0) < MIN_NARRATIVE_CHARS) {
      throw new BadRequestException(
        `O relato reflexivo precisa ter ao menos ${MIN_NARRATIVE_CHARS} caracteres`,
      );
    }

    const pdfBuffer = await this.renderPdf(report, { watermark: null });
    const key = `${report.id}/generated-${Date.now()}.pdf`;
    await this.storage.save(key, pdfBuffer);

    const updated = await this.prisma.extensionReport.update({
      where: { id },
      data: {
        status: ExtensionReportStatus.SUBMITTED,
        submittedAt: new Date(),
        generatedPdfKey: key,
      },
      include: { items: true },
    });

    await this.audit.log({
      action: 'EXTENSION_REPORT_SUBMITTED',
      actorId: actor.id,
      entity: 'ExtensionReport',
      entityId: id,
    });
    return updated;
  }

  async previewPdf(actor: AuthUser, id: string): Promise<Buffer> {
    const report = await this.loadWithItems(id);
    this.ensureCanRead(actor, report);
    return this.renderPdf(report, { watermark: 'DRAFT' });
  }

  async downloadGenerated(actor: AuthUser, id: string): Promise<Buffer> {
    const report = await this.loadWithItems(id);
    this.ensureCanRead(actor, report);
    if (!report.generatedPdfKey) throw new NotFoundException('PDF não gerado');
    return this.storage.read(report.generatedPdfKey);
  }

  async downloadSigned(actor: AuthUser, id: string): Promise<Buffer> {
    const report = await this.loadWithItems(id);
    this.ensureCanRead(actor, report);
    if (!report.signedPdfKey) throw new NotFoundException('PDF assinado indisponível');
    return this.storage.read(report.signedPdfKey);
  }

  // ---------- PROFESSOR ----------

  async listQueue(actor: AuthUser, status?: ExtensionReportStatus) {
    this.ensureReviewer(actor);
    return this.prisma.extensionReport.findMany({
      where: {
        status:
          status ??
          { in: [ExtensionReportStatus.SUBMITTED, ExtensionReportStatus.UNDER_REVIEW] },
      },
      include: {
        student: { select: { id: true, fullName: true, email: true } },
        _count: { select: { items: true } },
      },
      orderBy: { submittedAt: 'asc' },
    });
  }

  async claim(actor: AuthUser, id: string) {
    this.ensureReviewer(actor);
    const report = await this.loadWithItems(id);
    if (report.status !== ExtensionReportStatus.SUBMITTED) {
      throw new BadRequestException('Apenas relatórios enviados podem ser assumidos');
    }
    const updated = await this.prisma.extensionReport.update({
      where: { id },
      data: {
        status: ExtensionReportStatus.UNDER_REVIEW,
        reviewerId: actor.id,
        reviewedAt: new Date(),
      },
    });
    await this.audit.log({
      action: 'EXTENSION_REPORT_CLAIMED',
      actorId: actor.id,
      entity: 'ExtensionReport',
      entityId: id,
    });
    return updated;
  }

  async uploadSigned(actor: AuthUser, id: string, file: Express.Multer.File) {
    this.ensureReviewer(actor);
    if (!file) throw new BadRequestException('Arquivo ausente');
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Apenas arquivos PDF são aceitos');
    }
    const head = file.buffer.subarray(0, 4).toString('ascii');
    if (head !== '%PDF') throw new BadRequestException('PDF inválido');

    const report = await this.loadWithItems(id);
    if (
      report.status !== ExtensionReportStatus.UNDER_REVIEW &&
      report.status !== ExtensionReportStatus.SUBMITTED
    ) {
      throw new BadRequestException('Status inválido para upload');
    }

    const key = `${report.id}/signed-${Date.now()}.pdf`;
    const { hash } = await this.storage.save(key, file.buffer);

    const updated = await this.prisma.extensionReport.update({
      where: { id },
      data: {
        status: ExtensionReportStatus.SIGNED,
        signedPdfKey: key,
        signedPdfHash: hash,
        reviewerId: actor.id,
        signedAt: new Date(),
      },
    });
    await this.audit.log({
      action: 'EXTENSION_REPORT_SIGNED',
      actorId: actor.id,
      entity: 'ExtensionReport',
      entityId: id,
      metadata: { hash },
    });
    return updated;
  }

  async complete(actor: AuthUser, id: string) {
    this.ensureReviewer(actor);
    const report = await this.loadWithItems(id);
    if (report.status !== ExtensionReportStatus.SIGNED) {
      throw new BadRequestException('Somente relatórios assinados podem ser concluídos');
    }
    const updated = await this.prisma.extensionReport.update({
      where: { id },
      data: { status: ExtensionReportStatus.COMPLETED, completedAt: new Date() },
    });
    await this.audit.log({
      action: 'EXTENSION_REPORT_COMPLETED',
      actorId: actor.id,
      entity: 'ExtensionReport',
      entityId: id,
    });
    return updated;
  }

  async returnToStudent(actor: AuthUser, id: string, dto: ReturnReportDto) {
    this.ensureReviewer(actor);
    const report = await this.loadWithItems(id);
    if (
      report.status !== ExtensionReportStatus.UNDER_REVIEW &&
      report.status !== ExtensionReportStatus.SUBMITTED
    ) {
      throw new BadRequestException('Status inválido');
    }
    const updated = await this.prisma.extensionReport.update({
      where: { id },
      data: {
        status: ExtensionReportStatus.RETURNED,
        reviewerId: actor.id,
        reviewerNote: dto.reviewerNote,
      },
    });
    await this.audit.log({
      action: 'EXTENSION_REPORT_RETURNED',
      actorId: actor.id,
      entity: 'ExtensionReport',
      entityId: id,
    });
    return updated;
  }

  // ---------- HELPERS ----------

  private publicSelect() {
    return {
      id: true,
      code: true,
      status: true,
      totalHours: true,
      periodStart: true,
      periodEnd: true,
      narrative: true,
      reviewerNote: true,
      submittedAt: true,
      signedAt: true,
      completedAt: true,
      createdAt: true,
      updatedAt: true,
    } satisfies Prisma.ExtensionReportSelect;
  }

  private sumHours(attendances: { durationMin: number }[]) {
    return attendances.reduce((a, x) => a + x.durationMin / 60, 0);
  }

  private async loadWithItems(id: string) {
    const report = await this.prisma.extensionReport.findUnique({
      where: { id },
      include: {
        items: { orderBy: { snapshotDate: 'asc' } },
        student: {
          include: { studentProfile: true },
        },
      },
    });
    if (!report) throw new NotFoundException('Relatório não encontrado');
    return report;
  }

  private ensureStudent(a: AuthUser) {
    if (a.role !== UserRole.STUDENT) throw new ForbiddenException('Apenas alunos');
  }
  private ensureReviewer(a: AuthUser) {
    if (a.role !== UserRole.PROFESSOR && a.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Apenas professor/admin');
    }
  }
  private ensureOwner(a: AuthUser, r: { studentId: string }) {
    if (r.studentId !== a.id) throw new ForbiddenException();
  }
  private ensureCanRead(a: AuthUser, r: { studentId: string; reviewerId: string | null }) {
    if (a.role === UserRole.ADMIN) return;
    if (a.role === UserRole.STUDENT && r.studentId === a.id) return;
    if (a.role === UserRole.PROFESSOR) return;
    throw new ForbiddenException();
  }

  private async buildSnapshots(
    studentId: string,
    caseIds: string[],
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    const cases = await tx.case.findMany({
      where: { id: { in: caseIds }, status: { in: ELIGIBLE_CASE_STATUSES } },
      include: {
        attendances: {
          where: { studentId },
          orderBy: { occurredAt: 'asc' },
        },
        assignments: { where: { studentId } },
      },
    });

    if (cases.length !== caseIds.length) {
      throw new BadRequestException('Um ou mais casos são inválidos ou inelegíveis');
    }
    cases.forEach((c) => {
      if (!c.assignments.length) {
        throw new ForbiddenException(`Caso ${c.code} não atribuído ao aluno`);
      }
      if (!c.attendances.length) {
        throw new BadRequestException(`Caso ${c.code} sem atendimentos registrados pelo aluno`);
      }
    });

    return cases.map((c) => {
      const first = c.attendances[0];
      const last = c.attendances[c.attendances.length - 1];
      const hours = this.sumHours(c.attendances);

      // Prefer structured fields; fall back to legacy summary for old records.
      const actionParts = c.attendances.map((a) =>
        a.actionTaken ? `[${a.interactionType}] ${a.demandDescription} → ${a.actionTaken}` : a.summary,
      );
      const outcomePart = last.outcome || last.nextStep || c.notes || '—';

      return {
        caseId: c.id,
        attendanceId: last.id,
        snapshotDate: first.occurredAt,
        snapshotChannel: last.channel,
        snapshotCategory: c.category,
        snapshotSummary: c.summary,
        snapshotAction: actionParts.join(' | ').slice(0, 1500),
        snapshotOutcome: outcomePart,
        snapshotStatus: c.status,
        snapshotHours: Number(hours.toFixed(2)),
      };
    });
  }

  private async renderPdf(
    report: Awaited<ReturnType<ExtensionReportsService['loadWithItems']>>,
    opts: { watermark: 'DRAFT' | null },
  ) {
    const payload: ReportPdfPayload = {
      code: report.code,
      student: {
        fullName: report.student.fullName,
        email: report.student.email,
        enrollment: report.student.studentProfile?.enrollment ?? null,
      },
      narrative: report.narrative || '(narrativa pendente)',
      items: report.items.map((i) => ({
        snapshotDate: i.snapshotDate,
        snapshotChannel: i.snapshotChannel,
        snapshotCategory: i.snapshotCategory,
        snapshotSummary: i.snapshotSummary,
        snapshotAction: i.snapshotAction,
        snapshotOutcome: i.snapshotOutcome,
        snapshotStatus: i.snapshotStatus,
        snapshotHours: i.snapshotHours,
      })),
      totalHours: report.totalHours,
      periodStart: report.periodStart,
      periodEnd: report.periodEnd,
      watermark: opts.watermark,
      generatedAt: new Date(),
    };
    return this.pdf.generate(payload);
  }

  private async nextCode() {
    const year = new Date().getFullYear();
    const count = await this.prisma.extensionReport.count({
      where: { code: { startsWith: `EXT-${year}-` } },
    });
    return `EXT-${year}-${String(count + 1).padStart(4, '0')}`;
  }
}
