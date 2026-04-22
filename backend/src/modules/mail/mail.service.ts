import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export interface MailPayload {
  to: string;
  subject: string;
  html: string;
}

type MailProvider = 'smtp' | 'resend' | 'disabled';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly provider: MailProvider;
  private readonly transporter?: Transporter;
  private readonly from: string;
  private readonly resendApiKey?: string;

  constructor(private readonly config: ConfigService) {
    const configuredProvider = (config.get<string>('MAIL_PROVIDER') ?? 'smtp').toLowerCase();
    this.provider =
      configuredProvider === 'resend' || configuredProvider === 'disabled'
        ? configuredProvider
        : 'smtp';
    this.from = config.get<string>('MAIL_FROM', 'Espaco Empreendedor <noreply@espaco.com>');
    this.resendApiKey = config.get<string>('RESEND_API_KEY');

    if (this.provider === 'smtp') {
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
  }

  async send(payload: MailPayload) {
    try {
      if (this.provider === 'disabled') {
        this.logger.warn(`Envio de e-mail desabilitado. Destino ignorado: ${payload.to}`);
        return;
      }

      if (this.provider === 'resend') {
        await this.sendWithResend(payload);
        return;
      }

      await this.sendWithSmtp(payload);
    } catch (err) {
      // E-mail é best-effort — loga mas não quebra o fluxo
      this.logger.error(`Falha ao enviar e-mail para ${payload.to}: ${(err as Error).message}`);
    }
  }

  private async sendWithSmtp(payload: MailPayload) {
    if (!this.transporter) {
      throw new Error('SMTP transporter is not configured.');
    }

    await this.transporter.sendMail({
      from: this.from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });
  }

  private async sendWithResend(payload: MailPayload) {
    if (!this.resendApiKey) {
      throw new Error('RESEND_API_KEY is required when MAIL_PROVIDER=resend.');
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: this.from,
        to: [payload.to],
        subject: payload.subject,
        html: payload.html,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Resend returned ${response.status}: ${body}`);
    }
  }
}
