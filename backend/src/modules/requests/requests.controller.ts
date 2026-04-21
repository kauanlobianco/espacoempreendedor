import { BadRequestException, Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Public } from '@/common/decorators/public.decorator';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';

@ApiTags('requests (público)')
@Controller('requests')
export class RequestsController {
  constructor(private readonly requests: RequestsService) {}

  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @Post()
  submit(@Body() dto: CreateRequestDto) {
    return this.requests.submit(dto);
  }

  @Public()
  @ApiQuery({ name: 'contact', description: 'E-mail ou telefone cadastrado no pedido' })
  @Get('track')
  track(@Query('contact') contact: string) {
    if (!contact?.trim()) {
      throw new BadRequestException('Informe um e-mail ou telefone para consultar.');
    }
    return this.requests.findByContact(contact);
  }
}
