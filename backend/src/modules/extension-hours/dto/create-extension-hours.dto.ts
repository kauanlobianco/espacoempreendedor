import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateExtensionHoursDto {
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  referenceDate!: Date;

  @ApiProperty({ minimum: 0.25, maximum: 24 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.25)
  @Max(24)
  hours!: number;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  activity!: string;
}
