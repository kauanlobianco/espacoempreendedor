import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CaseCategory } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export const PREFERRED_CHANNELS = ['PRESENCIAL', 'WHATSAPP', 'TELEFONE', 'EMAIL', 'OUTRO'] as const;
export type PreferredChannel = (typeof PREFERRED_CHANNELS)[number];

export class CreateRequestDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  fullName!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Telefone com DDD, apenas dígitos ou formato livre' })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  phone!: string;

  @ApiPropertyOptional({ description: 'Nome do empreendimento (nome fantasia)' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  businessName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(2, 2)
  state?: string;

  @ApiProperty({ enum: CaseCategory })
  @IsEnum(CaseCategory)
  category!: CaseCategory;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  description!: string;

  @ApiPropertyOptional({ enum: PREFERRED_CHANNELS, description: 'Canal preferido de atendimento' })
  @IsOptional()
  @IsString()
  @IsIn(PREFERRED_CHANNELS)
  preferredChannel?: PreferredChannel;

  @ApiProperty({ description: 'Usuário aceitou os termos de uso e LGPD' })
  @IsBoolean()
  consentAccepted!: boolean;
}
