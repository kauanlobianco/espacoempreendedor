import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ExtensionReportStatus, UserRole } from '@prisma/client';
import { Response } from 'express';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '@/common/decorators/current-user.decorator';
import { ExtensionReportsService } from './extension-reports.service';
import { CreateDraftDto } from './dto/create-draft.dto';
import { UpdateDraftDto } from './dto/update-draft.dto';
import { ReturnReportDto } from './dto/return-report.dto';

@ApiTags('extension-reports')
@ApiBearerAuth()
@Controller('extension-reports')
export class ExtensionReportsController {
  constructor(private readonly svc: ExtensionReportsService) {}

  // ---------- STUDENT ----------

  @Roles(UserRole.STUDENT)
  @Get('eligible-cases')
  eligible(@CurrentUser() user: AuthUser) {
    return this.svc.listEligibleCases(user);
  }

  @Roles(UserRole.STUDENT)
  @Get('mine')
  mine(@CurrentUser() user: AuthUser) {
    return this.svc.listMine(user);
  }

  @Roles(UserRole.STUDENT)
  @Post('drafts')
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateDraftDto) {
    return this.svc.createDraft(user, dto);
  }

  @Roles(UserRole.STUDENT)
  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateDraftDto,
  ) {
    return this.svc.updateDraft(user, id, dto);
  }

  @Roles(UserRole.STUDENT)
  @Post(':id/submit')
  submit(@CurrentUser() user: AuthUser, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.svc.submit(user, id);
  }

  @Roles(UserRole.STUDENT, UserRole.PROFESSOR, UserRole.ADMIN)
  @Get(':id')
  one(@CurrentUser() user: AuthUser, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.svc.getOne(user, id);
  }

  @Roles(UserRole.STUDENT, UserRole.PROFESSOR, UserRole.ADMIN)
  @Get(':id/preview.pdf')
  async preview(
    @CurrentUser() user: AuthUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Res() res: Response,
  ) {
    const buf = await this.svc.previewPdf(user, id);
    this.sendPdf(res, buf, `preview-${id}.pdf`, 'inline');
  }

  @Roles(UserRole.STUDENT, UserRole.PROFESSOR, UserRole.ADMIN)
  @Get(':id/generated.pdf')
  async generated(
    @CurrentUser() user: AuthUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Res() res: Response,
  ) {
    const buf = await this.svc.downloadGenerated(user, id);
    this.sendPdf(res, buf, `relatorio-${id}.pdf`, 'attachment');
  }

  @Roles(UserRole.STUDENT, UserRole.PROFESSOR, UserRole.ADMIN)
  @Get(':id/signed.pdf')
  async signed(
    @CurrentUser() user: AuthUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Res() res: Response,
  ) {
    const buf = await this.svc.downloadSigned(user, id);
    this.sendPdf(res, buf, `relatorio-assinado-${id}.pdf`, 'attachment');
  }

  // ---------- PROFESSOR ----------

  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  @Get()
  queue(
    @CurrentUser() user: AuthUser,
    @Query('status') status?: ExtensionReportStatus,
  ) {
    return this.svc.listQueue(user, status);
  }

  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  @Post(':id/claim')
  claim(@CurrentUser() user: AuthUser, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.svc.claim(user, id);
  }

  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  @Post(':id/upload-signed')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  uploadSigned(
    @CurrentUser() user: AuthUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.svc.uploadSigned(user, id, file);
  }

  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  @Post(':id/complete')
  complete(@CurrentUser() user: AuthUser, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.svc.complete(user, id);
  }

  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  @Post(':id/return')
  returnIt(
    @CurrentUser() user: AuthUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: ReturnReportDto,
  ) {
    return this.svc.returnToStudent(user, id, dto);
  }

  private sendPdf(res: Response, buf: Buffer, name: string, disp: 'inline' | 'attachment') {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `${disp}; filename="${name}"`);
    res.setHeader('Content-Length', String(buf.length));
    res.end(buf);
  }
}
