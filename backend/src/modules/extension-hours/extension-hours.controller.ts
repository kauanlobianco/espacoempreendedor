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
import { ExtensionHoursService } from './extension-hours.service';
import { CreateExtensionHoursDto } from './dto/create-extension-hours.dto';

@ApiTags('extension-hours')
@ApiBearerAuth()
@Controller('extension-hours')
export class ExtensionHoursController {
  constructor(private readonly service: ExtensionHoursService) {}

  @Roles(UserRole.STUDENT)
  @Post()
  log(@CurrentUser() user: AuthUser, @Body() dto: CreateExtensionHoursDto) {
    return this.service.log(user, dto);
  }

  @Roles(UserRole.STUDENT)
  @Get('me')
  mine(@CurrentUser() user: AuthUser) {
    return this.service.listMine(user);
  }

  @Roles(UserRole.STUDENT, UserRole.PROFESSOR, UserRole.ADMIN)
  @Get('students/:studentId/summary')
  summary(@Param('studentId', new ParseUUIDPipe()) studentId: string) {
    return this.service.summary(studentId);
  }
}
