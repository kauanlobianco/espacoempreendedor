import { IsArray, IsInt, IsString, ArrayMinSize, ArrayMaxSize, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitQuizDto {
  @ApiProperty({ description: 'Course slug' })
  @IsString()
  courseSlug: string;

  @ApiProperty({ description: 'Array of chosen option indexes (0-based), one per question', type: [Number] })
  @IsArray()
  @ArrayMinSize(10)
  @ArrayMaxSize(10)
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(3, { each: true })
  answers: number[];
}
