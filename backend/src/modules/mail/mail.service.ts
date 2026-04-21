import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export interface MailPayload {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    this.from = config.get<string>('MAIL_FROM', 'Espaço Empreendedor <noreply@espaco.com>');

    this.transporter = nodemailer.createTransport({
      host: config.get<string>('MAIL_HOST', 'localhost'),
      port: config.get<number>('MAIL_PORT', 1025),
      secure: config.get<string>('MAIL_SECURE', 'false') === 'true',
      auth: config.get('MAIL_USER')
        ? {
            user: config.get<string>('MAIL_USER'),
            pass: config.get<string>('MAIL_PASS'),
          }
        : undefined,
    });
  }

  async send(payload: MailPayload) {
    try {
      await this.transporter.sendMail({
        from: this.from,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      });
    } catch (err) {
      // E-mail é best-effort — loga mas não quebra o fluxo
      this.logger.error(`Falha ao enviar e-mail para ${payload.to}: ${(err as Error).message}`);
    }
  }
}
