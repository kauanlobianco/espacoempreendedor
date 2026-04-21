import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ReturnReportDto {
  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(2000)
  reviewerNote!: string;
}
