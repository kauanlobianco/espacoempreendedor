import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'espaco-empreendedor-backend',
      version: 'courses-enabled',
      capabilities: ['courses'],
      date: new Date().toISOString(),
    };
  }
}
