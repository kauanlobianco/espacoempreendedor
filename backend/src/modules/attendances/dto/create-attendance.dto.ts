import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AttendanceInteractionType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export const ATTENDANCE_CHANNELS = [
  'PRESENCIAL',
  'TELEFONE',
  'WHATSAPP',
  'EMAIL',
  'OUTRO',
] as const;
export type AttendanceChannel = (typeof ATTENDANCE_CHANNELS)[number];

// Duration in minutes per interaction type — students do not set this manually.
export const INTERACTION_DURATION: Record<AttendanceInteractionType, number> = {
  SIMPLE_GUIDANCE: 15,
  GUIDANCE_WITH_REFERRAL: 30,
  DETAILED_SUPPORT: 45,
  ONGOING_CASE: 60,
};

export class CreateAttendanceDto {
  @ApiProperty({ enum: ATTENDANCE_CHANNELS })
  @IsIn(ATTENDANCE_CHANNELS as unknown as string[])
  channel!: AttendanceChannel;

  @ApiProperty({ enum: AttendanceInteractionType })
  @IsEnum(AttendanceInteractionType)
  interactionType!: AttendanceInteractionType;

  @ApiProperty({ description: 'O que o empreendedor precisava' })
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  demandDescription!: string;

  @ApiProperty({ description: 'O que o aluno fez neste atendimento' })
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  actionTaken!: string;

  @ApiProperty({ description: 'Como ficou a situação ao fim deste atendimento' })
  @IsString()
  @MinLength(5)
  @MaxLength(1000)
  outcome!: string;

  @ApiProperty({ description: 'Este caso precisa de continuidade?' })
  @IsBoolean()
  needsFollowUp!: boolean;

  @ApiPropertyOptional({ description: 'Notas internas do aluno (não aparecem no relatório)' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  internalNotes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  occurredAt?: Date;
}
