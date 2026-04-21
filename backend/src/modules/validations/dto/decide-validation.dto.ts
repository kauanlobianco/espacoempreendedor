import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ValidationStatus } from '@prisma/client';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class DecideValidationDto {
  @ApiProperty({ enum: [ValidationStatus.APPROVED, ValidationStatus.REJECTED] })
  @IsIn([ValidationStatus.APPROVED, ValidationStatus.REJECTED])
  status!: ValidationStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment?: string;
}
