import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ListingType, State, Status } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class Listing {
  @Expose()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  type: ListingType;

  @Expose()
  @IsNumber()
  price: number | null;

  @Expose()
  @IsString()
  state: State | null;

  @Expose()
  @IsNumber()
  rental: number | null;

  @Expose()
  @IsBoolean()
  @IsNotEmpty()
  negotiable: boolean;

  @Expose()
  @IsString()
  @IsNotEmpty()
  status?: Status;
}
