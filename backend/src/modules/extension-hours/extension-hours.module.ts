import { Module } from '@nestjs/common';
import { ExtensionHoursService } from './extension-hours.service';
import { ExtensionHoursController } from './extension-hours.controller';

@Module({
  providers: [ExtensionHoursService],
  controllers: [ExtensionHoursController],
  exports: [ExtensionHoursService],
})
export class ExtensionHoursModule {}
