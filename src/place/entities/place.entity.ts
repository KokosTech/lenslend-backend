import { Exclude, Expose } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { Status } from '@prisma/client';
import { emojiRegex } from '../../emojiRegex';

@Exclude()
export class Place {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Expose()
  @IsLatitude()
  @IsNotEmpty()
  lat: number;

  @Expose()
  @IsLongitude()
  @IsNotEmpty()
  lng: number;

  @Expose()
  @IsNotEmpty()
  @Matches(emojiRegex, '', {
    message: 'emoji',
  })
  icon: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  status?: Status;
}
