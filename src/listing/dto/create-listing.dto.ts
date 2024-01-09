import { ListingType, State, Status } from '@prisma/client';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
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
  @ApiProperty()
  type: ListingType;

  @IsNumber()
  @ApiProperty()
  price?: number;

  @IsString()
  @ApiProperty()
  state?: State;

  @IsNumber()
  @ApiProperty()
  rental?: number;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  negotiable: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  status: Status;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;
  // tagIds: [string];
}
