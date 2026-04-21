import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { INSTITUTIONAL, CATEGORY_LABELS } from './institutional-content';

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

  private render(doc: PDFKit.PDFDocument, p: ReportPdfPayload) {
    if (p.watermark) this.watermark(doc, p.watermark);

    this.header(doc, p);
    this.sectionIdentification(doc, p);
    this.sectionProjectContext(doc);
    this.sectionNarrative(doc, p);
    this.sectionActivities(doc, p);
    this.sectionGeneralNarrative(doc, p);
    this.sectionImpact(doc);
    this.sectionConsolidation(doc, p);
    this.sectionSignatures(doc, p);
    this.footer(doc, p);
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

  private header(doc: PDFKit.PDFDocument, p: ReportPdfPayload) {
    doc
      .fillColor('#0b2a4a')
      .rect(56, 56, doc.page.width - 112, 56)
      .fill();

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
      .text(`Documento ${p.code} • Emitido em ${this.fmtDate(p.generatedAt)}`, 56, 120);

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

  private sectionIdentification(doc: PDFKit.PDFDocument, p: ReportPdfPayload) {
    this.sectionTitle(doc, '1. Identificação do discente');
    const rows: Array<[string, string]> = [
      ['Nome completo', p.student.fullName],
      ['E-mail institucional', p.student.email],
      ['Matrícula', p.student.enrollment || '—'],
      ['Curso', INSTITUTIONAL.course],
      ['Polo / Unidade', INSTITUTIONAL.polo],
    ];
    rows.forEach(([k, v]) => {
      doc.font('Helvetica-Bold').text(`${k}: `, { continued: true });
      doc.font('Helvetica').text(v);
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

  private sectionNarrative(doc: PDFKit.PDFDocument, p: ReportPdfPayload) {
    this.sectionTitle(doc, '3. Relato reflexivo do(a) discente');
    doc.text(p.narrative, { align: 'justify' });
  }

  private sectionActivities(doc: PDFKit.PDFDocument, p: ReportPdfPayload) {
    this.sectionTitle(doc, '4. Registro das atividades realizadas');
    p.items.forEach((item, idx) => this.renderCaseCard(doc, item, idx + 1));
  }

  private renderCaseCard(doc: PDFKit.PDFDocument, item: ReportPdfItem, n: number) {
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
      .text(`#${n} — ${category}`, padX, y);

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
    writeField('Ação realizada', item.snapshotAction);
    writeField('Orientação prestada', item.snapshotOutcome);
    writeField('Situação final', item.snapshotStatus);

    doc.y = startY + estimatedHeight + 6;
    doc.x = 56;
    doc.fillColor('#111827');
  }

  private sectionGeneralNarrative(doc: PDFKit.PDFDocument, p: ReportPdfPayload) {
    this.sectionTitle(doc, '5. Descrição geral das atividades');
    const cats = [
      ...new Set(p.items.map((i) => CATEGORY_LABELS[i.snapshotCategory] ?? i.snapshotCategory)),
    ];
    const catsSentence = cats.length
      ? ` Entre as demandas atendidas destacam-se: ${cats.join(', ')}.`
      : '';
    doc.text(INSTITUTIONAL.generalNarrativeBase + catsSentence, { align: 'justify' });
  }

  private sectionImpact(doc: PDFKit.PDFDocument) {
    this.sectionTitle(doc, '6. Finalidade e impacto extensionista');
    doc.text(INSTITUTIONAL.impact, { align: 'justify' });
  }

  private sectionConsolidation(doc: PDFKit.PDFDocument, p: ReportPdfPayload) {
    this.sectionTitle(doc, '7. Consolidação das horas extensionistas');
    const period =
      p.periodStart && p.periodEnd
        ? `${this.fmtDate(p.periodStart)} a ${this.fmtDate(p.periodEnd)}`
        : '—';
    doc.font('Helvetica-Bold').text('Total de atendimentos: ', { continued: true });
    doc.font('Helvetica').text(String(p.items.length));
    doc.font('Helvetica-Bold').text('Total de horas: ', { continued: true });
    doc.font('Helvetica').text(`${p.totalHours.toFixed(2)} h`);
    doc.font('Helvetica-Bold').text('Período: ', { continued: true });
    doc.font('Helvetica').text(period);
  }

  private sectionSignatures(doc: PDFKit.PDFDocument, p: ReportPdfPayload) {
    this.sectionTitle(doc, '8. Validação e assinaturas');
    if (doc.y > doc.page.height - 180) doc.addPage();

    doc.moveDown(2);
    const y = doc.y;
    const colW = (doc.page.width - 112 - 24) / 2;

    doc.moveTo(56, y).lineTo(56 + colW, y).strokeColor('#111827').stroke();
    doc.moveTo(56 + colW + 24, y).lineTo(doc.page.width - 56, y).stroke();

    doc.font('Helvetica').fontSize(9).fillColor('#374151');
    doc.text(p.student.fullName, 56, y + 4, { width: colW });
    doc.text('Assinatura do(a) discente', 56, y + 18, { width: colW });

    doc.text('Nome do(a) responsável', 56 + colW + 24, y + 4, { width: colW });
    doc.text('Assinatura do(a) responsável', 56 + colW + 24, y + 18, { width: colW });
  }

  private footer(doc: PDFKit.PDFDocument, p: ReportPdfPayload) {
    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(range.start + i);
      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor('#9ca3af')
        .text(
          `${INSTITUTIONAL.university} • ${INSTITUTIONAL.project} • ${p.code} • Página ${i + 1}/${range.count}`,
          56,
          doc.page.height - 40,
          { width: doc.page.width - 112, align: 'center' },
        );
    }
  }

  private fmtDate(d: Date) {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(d));
  }
}
