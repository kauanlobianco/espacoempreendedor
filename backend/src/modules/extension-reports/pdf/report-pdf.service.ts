import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { CATEGORY_LABELS, INSTITUTIONAL } from './institutional-content';

const STATUS_LABELS: Record<string, string> = {
  NEW: 'Novo',
  TRIAGED: 'Triado',
  ASSIGNED: 'Assumido',
  IN_PROGRESS: 'Em andamento',
  WAITING_USER: 'Aguardando retorno do empreendedor',
  WAITING_SUPERVISION: 'Aguardando acompanhamento interno',
  RESOLVED: 'Resolvido',
  CLOSED: 'Fechado',
  CANCELLED: 'Cancelado',
};

const INTERACTION_LABELS: Record<string, string> = {
  SIMPLE_GUIDANCE: 'Orientacao simples',
  GUIDANCE_WITH_REFERRAL: 'Orientacao com encaminhamento',
  DETAILED_SUPPORT: 'Apoio detalhado',
  ONGOING_CASE: 'Acompanhamento do caso',
};

export interface ReportPdfItem {
  snapshotDate: Date;
  snapshotChannel: string;
  snapshotCategory: string;
  snapshotSummary: string;
  snapshotAction: string;
  snapshotOutcome: string;
  snapshotStatus: string;
  snapshotHours: number;
  caseCode?: string;
}

export interface ReportPdfPayload {
  code: string;
  student: {
    fullName: string;
    email: string;
    enrollment?: string | null;
  };
  narrative: string;
  items: ReportPdfItem[];
  totalHours: number;
  periodStart?: Date | null;
  periodEnd?: Date | null;
  watermark?: 'DRAFT' | null;
  generatedAt: Date;
}

@Injectable()
export class ReportPdfService {
  async generate(payload: ReportPdfPayload): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 56, bottom: 56, left: 56, right: 56 },
        info: {
          Title: `${INSTITUTIONAL.documentTitle} - ${payload.code}`,
          Author: INSTITUTIONAL.university,
          Subject: INSTITUTIONAL.project,
        },
      });

      const chunks: Buffer[] = [];
      doc.on('data', (c) => chunks.push(c as Buffer));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      this.render(doc, payload);
      doc.end();
    });
  }

  private render(doc: PDFKit.PDFDocument, payload: ReportPdfPayload) {
    if (payload.watermark) this.watermark(doc, payload.watermark);

    this.header(doc, payload);
    this.sectionIdentification(doc, payload);
    this.sectionProjectContext(doc);
    this.sectionNarrative(doc, payload);
    this.sectionActivities(doc, payload);
    this.sectionGeneralNarrative(doc, payload);
    this.sectionImpact(doc);
    this.sectionConsolidation(doc, payload);
    this.sectionSignatures(doc, payload);
    this.footer(doc, payload);
  }

  private watermark(doc: PDFKit.PDFDocument, text: string) {
    doc.save();
    doc.rotate(-30, { origin: [300, 420] });
    doc
      .fillColor('#e5e7eb')
      .fontSize(110)
      .opacity(0.35)
      .text(text, 60, 360, { align: 'center', width: 480 });
    doc.restore();
    doc.opacity(1).fillColor('black');
  }

  private header(doc: PDFKit.PDFDocument, payload: ReportPdfPayload) {
    doc.fillColor('#0b2a4a').rect(56, 56, doc.page.width - 112, 56).fill();

    doc
      .fillColor('white')
      .font('Helvetica-Bold')
      .fontSize(14)
      .text(INSTITUTIONAL.documentTitle, 72, 72);

    doc
      .font('Helvetica')
      .fontSize(10)
      .text(`${INSTITUTIONAL.university} • Projeto: ${INSTITUTIONAL.project}`, 72, 92);

    doc
      .fillColor('#6b7280')
      .fontSize(9)
      .text(`Documento ${payload.code} • Emitido em ${this.fmtDate(payload.generatedAt)}`, 56, 120);

    doc.moveDown(1.5);
    doc.fillColor('black');
  }

  private sectionTitle(doc: PDFKit.PDFDocument, title: string) {
    if (doc.y > doc.page.height - 140) doc.addPage();

    doc
      .moveDown(0.8)
      .fillColor('#0b2a4a')
      .font('Helvetica-Bold')
      .fontSize(11)
      .text(title.toUpperCase(), { characterSpacing: 0.5 });

    doc
      .moveTo(doc.x, doc.y + 2)
      .lineTo(doc.page.width - 56, doc.y + 2)
      .strokeColor('#0b2a4a')
      .lineWidth(1)
      .stroke();

    doc.moveDown(0.6).fillColor('#111827').font('Helvetica').fontSize(10);
  }

  private sectionIdentification(doc: PDFKit.PDFDocument, payload: ReportPdfPayload) {
    this.sectionTitle(doc, '1. Identificacao do discente');

    const rows: Array<[string, string]> = [
      ['Nome completo', payload.student.fullName],
      ['E-mail institucional', payload.student.email],
      ['Matricula', payload.student.enrollment || '—'],
      ['Curso', INSTITUTIONAL.course],
      ['Polo / Unidade', INSTITUTIONAL.polo],
    ];

    rows.forEach(([label, value]) => {
      doc.font('Helvetica-Bold').text(`${label}: `, { continued: true });
      doc.font('Helvetica').text(value);
    });
  }

  private sectionProjectContext(doc: PDFKit.PDFDocument) {
    this.sectionTitle(doc, '2. Projeto e natureza da atividade');
    doc.text(INSTITUTIONAL.projectContext, { align: 'justify' });
    doc.moveDown(0.4);
    doc.font('Helvetica-Bold').text('Natureza da atividade: ', { continued: true });
    doc.font('Helvetica').text(INSTITUTIONAL.natureOfActivity, { align: 'justify' });
    doc.moveDown(0.2);
    doc.font('Helvetica-Bold').text('Finalidade: ', { continued: true });
    doc.font('Helvetica').text(INSTITUTIONAL.purpose, { align: 'justify' });
  }

  private sectionNarrative(doc: PDFKit.PDFDocument, payload: ReportPdfPayload) {
    this.sectionTitle(doc, '3. Relato reflexivo do(a) discente');
    doc.text(payload.narrative, { align: 'justify' });
  }

  private sectionActivities(doc: PDFKit.PDFDocument, payload: ReportPdfPayload) {
    this.sectionTitle(doc, '4. Registro das atividades realizadas');
    payload.items.forEach((item, index) => this.renderCaseCard(doc, item, index + 1));
  }

  private renderCaseCard(doc: PDFKit.PDFDocument, item: ReportPdfItem, index: number) {
    const estimatedHeight = 130;
    if (doc.y + estimatedHeight > doc.page.height - 80) doc.addPage();

    const startY = doc.y;
    const left = 56;
    const right = doc.page.width - 56;

    doc
      .roundedRect(left, startY, right - left, estimatedHeight, 4)
      .strokeColor('#d1d5db')
      .lineWidth(0.6)
      .stroke();

    const padX = left + 10;
    let y = startY + 8;

    const category = CATEGORY_LABELS[item.snapshotCategory] ?? item.snapshotCategory;
    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .fillColor('#0b2a4a')
      .text(`#${index} — ${category}`, padX, y);

    doc
      .font('Helvetica')
      .fontSize(9)
      .fillColor('#6b7280')
      .text(
        `${this.fmtDate(item.snapshotDate)} • ${item.snapshotChannel} • ${item.snapshotHours.toFixed(2)}h${
          item.caseCode ? ` • Caso ${item.caseCode}` : ''
        }`,
        padX,
        y + 12,
      );

    y += 28;
    doc.fillColor('#111827').fontSize(9.5);

    const writeField = (label: string, value: string) => {
      doc.font('Helvetica-Bold').text(`${label}: `, padX, y, { continued: true });
      doc.font('Helvetica').text(value, { width: right - left - 20 });
      y = doc.y + 2;
    };

    writeField('Demanda', item.snapshotSummary);
    writeField('Acao realizada', this.formatSnapshotAction(item.snapshotAction));
    writeField('Orientacao prestada', item.snapshotOutcome);
    writeField('Situacao final', this.formatStatus(item.snapshotStatus));

    doc.y = startY + estimatedHeight + 6;
    doc.x = 56;
    doc.fillColor('#111827');
  }

  private sectionGeneralNarrative(doc: PDFKit.PDFDocument, payload: ReportPdfPayload) {
    this.sectionTitle(doc, '5. Descricao geral das atividades');
    const categories = [
      ...new Set(payload.items.map((item) => CATEGORY_LABELS[item.snapshotCategory] ?? item.snapshotCategory)),
    ];
    const categoriesSentence = categories.length
      ? ` Entre as demandas atendidas destacam-se: ${categories.join(', ')}.`
      : '';

    doc.text(INSTITUTIONAL.generalNarrativeBase + categoriesSentence, { align: 'justify' });
  }

  private sectionImpact(doc: PDFKit.PDFDocument) {
    this.sectionTitle(doc, '6. Finalidade e impacto extensionista');
    doc.text(INSTITUTIONAL.impact, { align: 'justify' });
  }

  private sectionConsolidation(doc: PDFKit.PDFDocument, payload: ReportPdfPayload) {
    this.sectionTitle(doc, '7. Consolidacao das horas extensionistas');
    const period =
      payload.periodStart && payload.periodEnd
        ? `${this.fmtDate(payload.periodStart)} a ${this.fmtDate(payload.periodEnd)}`
        : '—';

    doc.font('Helvetica-Bold').text('Total de atendimentos: ', { continued: true });
    doc.font('Helvetica').text(String(payload.items.length));
    doc.font('Helvetica-Bold').text('Total de horas: ', { continued: true });
    doc.font('Helvetica').text(`${payload.totalHours.toFixed(2)} h`);
    doc.font('Helvetica-Bold').text('Periodo: ', { continued: true });
    doc.font('Helvetica').text(period);
  }

  private sectionSignatures(doc: PDFKit.PDFDocument, payload: ReportPdfPayload) {
    this.sectionTitle(doc, '8. Validacao e assinaturas');
    if (doc.y > doc.page.height - 180) doc.addPage();

    doc.moveDown(2);
    const y = doc.y;
    const columnWidth = (doc.page.width - 112 - 24) / 2;

    doc.moveTo(56, y).lineTo(56 + columnWidth, y).strokeColor('#111827').stroke();
    doc.moveTo(56 + columnWidth + 24, y).lineTo(doc.page.width - 56, y).stroke();

    doc.font('Helvetica').fontSize(9).fillColor('#374151');
    doc.text(payload.student.fullName, 56, y + 4, { width: columnWidth });
    doc.text('Assinatura do(a) discente', 56, y + 18, { width: columnWidth });

    doc.text('Nome do(a) responsavel', 56 + columnWidth + 24, y + 4, {
      width: columnWidth,
    });
    doc.text('Assinatura do(a) responsavel', 56 + columnWidth + 24, y + 18, {
      width: columnWidth,
    });
  }

  private footer(doc: PDFKit.PDFDocument, payload: ReportPdfPayload) {
    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(range.start + i);
      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor('#9ca3af')
        .text(
          `${INSTITUTIONAL.university} • ${INSTITUTIONAL.project} • ${payload.code} • Pagina ${i + 1}/${range.count}`,
          56,
          doc.page.height - 40,
          { width: doc.page.width - 112, align: 'center' },
        );
    }
  }

  private fmtDate(date: Date) {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(date));
  }

  private formatStatus(status: string) {
    return STATUS_LABELS[status] ?? status;
  }

  private formatSnapshotAction(action: string) {
    let formatted = action;

    for (const [raw, label] of Object.entries(INTERACTION_LABELS)) {
      formatted = formatted.replaceAll(`[${raw}]`, `${label}:`);
      formatted = formatted.replaceAll(raw, label);
    }

    return formatted.replaceAll('→', ': ').replace(/\s+\|\s+/g, ' | ').trim();
  }
}
