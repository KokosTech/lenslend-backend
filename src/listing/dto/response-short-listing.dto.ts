import { PartialType } from '@nestjs/mapped-types';
import { ResponseListingDto } from './response-listing.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ListingType, State, Status } from '@prisma/client';
import { ResponseCategoryDto } from '../../category/dto/response-category.dto';
import { Exclude, Expose } from 'class-transformer';
import { ResponseShortMetaUserDto } from '../../user/dtos/response-short-meta-user.dto';
import { ImageDto } from '../../common/dtos/image.dto';

@Exclude()
export class ResponseShortListingDto extends PartialType(ResponseListingDto) {
  @Expose()
  @ApiProperty()
  uuid: string;

  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty()
  lat: number;

  @Expose()
  @ApiProperty()
  lng: number;

  @Expose()
  @ApiProperty({
    type: ListingType,
    enum: ListingType,
    example: ListingType.PRODUCT,
  })
  type: ListingType;

  @Expose()
  @ApiProperty()
  price?: number;

  @Expose()
  @ApiProperty({
    type: State,
    enum: State,
    example: State.NEW,
  })
  state?: State;

  @Expose()
  @ApiProperty()
  rental?: number;

  @Expose()
  @ApiProperty()
  negotiable: boolean;

  @Expose()
  @ApiProperty({
    type: Status,
    enum: Status,
    example: Status.PUBLIC,
  })
  status: Status;

  @Expose()
  @ApiProperty({
    type: ResponseCategoryDto,
  })
  category: ResponseCategoryDto;

  @Expose()
  @ApiProperty({
    type: ResponseShortMetaUserDto,
  })
  user: ResponseShortMetaUserDto;

  @Expose()
  @ApiProperty({
    type: ImageDto,
  })
  thumbnail: ImageDto;

  @Expose()
  @ApiProperty({
    type: Date,
  })
  created_at: Date;

  @Expose()
  @ApiProperty({
    type: Date,
  })
  updated_at: Date;
}
