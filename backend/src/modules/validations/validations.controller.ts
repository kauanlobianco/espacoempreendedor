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
import { UserRole, ValidationTarget } from '@prisma/client';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '@/common/decorators/current-user.decorator';
import { ValidationsService } from './validations.service';
import { DecideValidationDto } from './dto/decide-validation.dto';

@ApiTags('validations')
@ApiBearerAuth()
@Controller('validations')
@Roles(UserRole.PROFESSOR, UserRole.ADMIN)
export class ValidationsController {
  constructor(private readonly validations: ValidationsService) {}

  @Get('pending')
  listPending(@Query('target') target?: ValidationTarget) {
    return this.validations.listPending(target);
  }

  @Patch(':id/decision')
  decide(
    @CurrentUser() user: AuthUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: DecideValidationDto,
  ) {
    return this.validations.decide(user, id, dto);
  }
}
