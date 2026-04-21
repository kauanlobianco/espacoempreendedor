import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class FirstAccessDto {
  @ApiProperty({ description: 'E-mail institucional do aluno' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Nova senha do aluno', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;
}
