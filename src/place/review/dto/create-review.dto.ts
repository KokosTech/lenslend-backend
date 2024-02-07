import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Optional } from '@nestjs/common';

export class CreateReviewDto {
  @ApiProperty()
  @IsString()
  @Optional()
  @MinLength(3)
  @MaxLength(480)
  content?: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating: number;
}
