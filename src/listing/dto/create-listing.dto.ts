import { ListingType, State, Status } from '@prisma/client';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateListingDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ enum: ListingType })
  type: ListingType;

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
