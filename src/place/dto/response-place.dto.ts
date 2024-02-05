import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { Review } from '../../common/types/review';
import { VisitorDto } from '../../common/types/visitor';

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
  rating: number;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty()
  category: {
    uuid: string;
    name: string;
  };

  @Expose()
  @ApiProperty()
  lat: number;

  @Expose()
  @ApiProperty()
  lng: number;

  @Expose()
  @ApiProperty()
  images: {
    uuid: string;
    url: string;
    alt: string;
  }[];

  @Expose()
  @ApiProperty()
  tags: {
    uuid: string;
    name: string;
  }[];

  @Expose()
  @ApiProperty()
  services: {
    uuid: string;
    name: string;
    icon: string;
  }[];
  //   visitors
  @Expose()
  @ApiProperty({
    type: [VisitorDto],
  })
  visitors: VisitorDto[];

  @Expose()
  @ApiProperty()
  reviews: Review[];

  @Expose()
  @ApiProperty({
    type: 'string',
    enum: Status,
  })
  status: Status;

  // creator
  @Expose()
  @ApiProperty()
  creator: {
    uuid: string;
    name: string;
    username: string;
    profile_pic?: string;
  };

  @Expose()
  @ApiProperty()
  owner?: {
    uuid: string;
    name: string;
    username: string;
    profile_pic?: string;
  };

  @Expose()
  @ApiProperty()
  created_at: Date;

  @Expose()
  @ApiProperty()
  updated_at: Date;
}
