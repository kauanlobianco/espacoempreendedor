import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '@/common/decorators/current-user.decorator';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@ApiTags('attendances')
@ApiBearerAuth()
@Controller('cases/:caseId/attendances')
export class AttendancesController {
  constructor(private readonly attendances: AttendancesService) {}

  @Roles(UserRole.STUDENT, UserRole.PROFESSOR, UserRole.ADMIN)
  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Param('caseId', new ParseUUIDPipe()) caseId: string,
    @Body() dto: CreateAttendanceDto,
  ) {
    return this.attendances.create(user, caseId, dto);
  }

  @Roles(UserRole.STUDENT, UserRole.PROFESSOR, UserRole.ADMIN)
  @Get()
  list(@Param('caseId', new ParseUUIDPipe()) caseId: string) {
    return this.attendances.listByCase(caseId);
  }
}
