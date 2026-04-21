import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsUUID } from 'class-validator';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '@/common/decorators/current-user.decorator';
import { CasesService } from './cases.service';
import { ListCasesDto } from './dto/list-cases.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

class AssignDto {
  @IsUUID()
  studentId!: string;
}

@ApiTags('cases')
@ApiBearerAuth()
@Controller('cases')
export class CasesController {
  constructor(private readonly cases: CasesService) {}

  @Roles(UserRole.STUDENT, UserRole.PROFESSOR, UserRole.ADMIN)
  @Get()
  list(@CurrentUser() user: AuthUser, @Query() filters: ListCasesDto) {
    return this.cases.list(user, filters);
  }

  @Roles(UserRole.STUDENT, UserRole.PROFESSOR, UserRole.ADMIN)
  @Get(':id')
  findOne(
    @CurrentUser() user: AuthUser,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.cases.findById(user, id);
  }

  @Roles(UserRole.STUDENT, UserRole.PROFESSOR, UserRole.ADMIN)
  @Post(':id/assign')
  assign(
    @CurrentUser() user: AuthUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AssignDto,
  ) {
    return this.cases.assignToStudent(user, id, dto.studentId);
  }

  @Roles(UserRole.STUDENT, UserRole.PROFESSOR, UserRole.ADMIN)
  @Patch(':id/status')
  updateStatus(
    @CurrentUser() user: AuthUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.cases.updateStatus(user, id, dto);
  }
}
