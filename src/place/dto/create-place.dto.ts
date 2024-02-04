import { Status } from '@prisma/client';
import {
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { emojiRegex } from '../../emojiRegex';

export class CreatePlaceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
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
  description: string;

  @ApiProperty()
  @IsString()
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
  @IsEnum(['PUBLIC', 'PRIVATE'])
  @IsNotEmpty()
  status: Status;
  services: string[];
  images: string[];
  tags: string[];
}
