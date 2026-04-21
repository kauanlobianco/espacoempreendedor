import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { ExtensionReportsController } from './extension-reports.controller';
import { ExtensionReportsService } from './extension-reports.service';
import { ReportPdfService } from './pdf/report-pdf.service';
import { ReportStorageService } from './storage/report-storage.service';

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [ExtensionReportsController],
  providers: [ExtensionReportsService, ReportPdfService, ReportStorageService],
  exports: [ExtensionReportsService],
})
export class ExtensionReportsModule {}
