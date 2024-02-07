import { ListingType, State, Status } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ResponseCategoryDto } from '../../category/dto/response-category.dto';
import { ResponseMetaUserDto } from '../../user/dtos/response-meta-user.dto';
import { ImageDto } from '../../common/dtos/image.dto';
import { ResponseTagDto } from '../../tag/dto/response-tag.dto';

@Exclude()
export class ResponseListingDto {
  @Expose()
  @ApiProperty()
  uuid: string;

  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty()
  description: string;

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
    type: ImageDto,
    isArray: true,
  })
  images: ImageDto[];

  @Expose()
  @ApiProperty({
    type: ResponseMetaUserDto,
  })
  user: ResponseMetaUserDto;

  @Expose()
  @ApiProperty({
    type: ResponseTagDto,
    isArray: true,
  })
  tags: ResponseTagDto[];

  @Expose()
  @ApiProperty()
  created_at: Date;

  @Expose()
  @ApiProperty()
  updated_at: Date;
}
