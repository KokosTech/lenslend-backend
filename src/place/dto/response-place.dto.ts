import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { VisitorDto } from '../../common/types/visitor';
import { ResponseCategoryDto } from '../../category/dto/response-category.dto';
import { ImageDto } from '../../common/dtos/image.dto';
import { ResponseTagDto } from '../../tag/dto/response-tag.dto';
import { ResponseServiceDto } from '../service/dto/response-service.dto';
import { ResponseReviewDto } from '../review/dto/response-review.dto';
import { ResponseCardUserDto } from '../../user/dtos/response-card-user.dto';

@Exclude()
export class ResponsePlaceDto {
  @Expose()
  @ApiProperty()
  uuid: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  icon: string;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty()
  rating: number;

  @Expose()
  @ApiProperty({
    type: ResponseCategoryDto,
  })
  category: ResponseCategoryDto;

  @Expose()
  @ApiProperty()
  lat: number;

  @Expose()
  @ApiProperty()
  lng: number;

  @Expose()
  @ApiProperty({
    type: ImageDto,
    isArray: true,
  })
  images: ImageDto[];

  @Expose()
  @ApiProperty({
    type: ResponseTagDto,
    isArray: true,
  })
  tags: ResponseTagDto[];

  @Expose()
  @ApiProperty({
    type: ResponseServiceDto,
    isArray: true,
  })
  services: ResponseServiceDto[];

  @Expose()
  @ApiProperty({
    type: VisitorDto,
    isArray: true,
  })
  visitors: VisitorDto[];

  @Expose()
  @ApiProperty({
    type: ResponseReviewDto,
    isArray: true,
  })
  reviews: ResponseReviewDto[];

  @Expose()
  @ApiProperty({
    type: 'string',
    enum: Status,
  })
  status: Status;

  @Expose()
  @ApiProperty({
    type: ResponseCardUserDto,
  })
  creator: ResponseCardUserDto;

  @Expose()
  @ApiProperty({
    type: ResponseCardUserDto,
    required: false,
  })
  owner?: ResponseCardUserDto;

  @Expose()
  @ApiProperty()
  created_at: Date;

  @Expose()
  @ApiProperty()
  updated_at: Date;
}
