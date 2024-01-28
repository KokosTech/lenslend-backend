import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  parent_uuid?: string;

  @IsString()
  type: 'LISTING' | 'PLACE';
}
