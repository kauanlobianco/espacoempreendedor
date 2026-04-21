import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RequestsModule } from './modules/requests/requests.module';
import { CasesModule } from './modules/cases/cases.module';
import { AttendancesModule } from './modules/attendances/attendances.module';
import { ValidationsModule } from './modules/validations/validations.module';
import { ExtensionHoursModule } from './modules/extension-hours/extension-hours.module';
import { ExtensionReportsModule } from './modules/extension-reports/extension-reports.module';
import { AuditModule } from './modules/audit/audit.module';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get<number>('THROTTLE_TTL', 60) * 1000,
            limit: config.get<number>('THROTTLE_LIMIT', 5),
          },
        ],
      }),
    }),
    PrismaModule,
    AuditModule,
    MailModule,
    AuthModule,
    UsersModule,
    RequestsModule,
    CasesModule,
    AttendancesModule,
    ValidationsModule,
    ExtensionHoursModule,
    ExtensionReportsModule,
  ],
})
export class AppModule {}
