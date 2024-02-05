import { PartialType } from '@nestjs/mapped-types';
import { CreateListingDto } from './create-listing.dto';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { State, Status } from '@prisma/client';

export class UpdateListingDto extends PartialType(CreateListingDto) {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  price?: number;

  @IsString()
  @ApiProperty({ enum: State })
  state: State;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  rental?: number;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  negotiable: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ enum: Status })
  status: Status;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  categoryId: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  lng: number;

  @IsString({
    each: true,
  })
  @ApiProperty()
  images: string[];

  @IsString({
    each: true,
  })
  @ApiProperty()
  tags: string[];
}
