import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'espaco-empreendedor-backend',
      date: new Date().toISOString(),
    };
  }
}
