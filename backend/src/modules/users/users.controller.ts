import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsBoolean } from 'class-validator';
import { Roles } from '@/common/decorators/roles.decorator';
import { UsersService } from './users.service';

class SetActiveDto {
  @IsBoolean()
  active!: boolean;
}

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  @Get()
  list(@Query('role') role?: UserRole) {
    return this.users.list(role);
  }

  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  @Get('pending')
  listPending() {
    return this.users.listPendingStudents();
  }

  @Roles(UserRole.PROFESSOR, UserRole.ADMIN, UserRole.STUDENT)
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.users.findById(id);
  }

  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  @Get(':id/performance')
  performance(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.users.studentPerformance(id);
  }

  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  @Patch(':id/active')
  setActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: SetActiveDto,
  ) {
    return this.users.setActive(id, dto.active);
  }
}
