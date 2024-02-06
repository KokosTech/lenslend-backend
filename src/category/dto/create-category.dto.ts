import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class CreateCategoryDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Length(3, 56)
  @ApiProperty()
  name: string;

  @Expose()
  @IsUUID()
  @IsOptional()
  @ApiProperty()
  parent_uuid?: string;
}
