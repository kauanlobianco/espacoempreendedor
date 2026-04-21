import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class RegisterStudentDto {
  @ApiProperty({ description: 'Nome completo' })
  @IsString()
  @MinLength(3)
  fullName!: string;

  @ApiProperty({ description: 'CPF - 11 digitos ou 000.000.000-00' })
  @IsString()
  @Matches(/^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'CPF deve ter 11 digitos ou estar no formato 000.000.000-00',
  })
  cpf!: string;

  @ApiProperty({ description: 'E-mail institucional UFF' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Matricula UFF' })
  @IsString()
  @MinLength(5)
  enrollment!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  course?: string;
}
