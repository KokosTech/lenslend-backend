import { Status } from '@prisma/client';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { emojiRegex } from '../../emojiRegex';

export class CreatePlaceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(6, 60)
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(emojiRegex, '', {
    message: 'Invalid emoji',
  })
  icon: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(100, 3000)
  description: string;

  @ApiProperty()
  @IsUUID()
  categoryUuid: string;

  @ApiProperty()
  @IsLatitude()
  @IsNotEmpty()
  lat: number;

  @ApiProperty()
  @IsLongitude()
  @IsNotEmpty()
  lng: number;

  @ApiProperty({
    enum: Status,
    default: 'PUBLIC',
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  services: string[];

  @ApiProperty()
  @ArrayNotEmpty()
  @ArrayMaxSize(6)
  @IsString({ each: true })
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
