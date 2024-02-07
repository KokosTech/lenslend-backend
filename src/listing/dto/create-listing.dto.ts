import { ListingType, State, Status } from '@prisma/client';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsBoolean,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateListingDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 60)
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(100, 3000)
  @ApiProperty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ enum: ListingType })
  type: ListingType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100000)
  @ApiProperty()
  price?: number;

  @IsString()
  @IsEnum(State)
  @ApiProperty({ enum: State })
  state: State;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100000)
  rental?: number;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  negotiable: boolean;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Status)
  @ApiProperty({ enum: Status })
  status: Status;

  @IsUUID()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  categoryId: string;

  @IsLatitude()
  @IsNotEmpty()
  @ApiProperty()
  lat: number;

  @IsLongitude()
  @IsNotEmpty()
  @ApiProperty()
  lng: number;

  @IsString({
    each: true,
  })
  @ArrayNotEmpty()
  @ArrayMaxSize(6)
  @ApiProperty()
  images: string[];

  @IsString({
    each: true,
  })
  @Min(3, {
    each: true,
  })
  @Max(20, {
    each: true,
  })
  @ArrayNotEmpty()
  @ArrayMaxSize(16)
  @ApiProperty()
  tags: string[];
}
