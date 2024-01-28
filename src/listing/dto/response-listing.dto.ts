import { ListingType, State } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseListingDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  lat: number;

  @ApiProperty()
  lng: number;

  @ApiProperty()
  type: ListingType;

  @ApiProperty()
  price?: number;

  @ApiProperty()
  state?: State;

  @ApiProperty()
  rental?: number;

  @ApiProperty()
  negotiable: boolean;

  @ApiProperty()
  status: string;

  @ApiProperty()
  category: {
    uuid: string;
    name: string;
  };

  @ApiProperty()
  user: {
    uuid: string;
    name: string;
    username: string;
    profile_pic?: string;
  };

  @ApiProperty()
  tags: [
    {
      uuid: string;
      name: string;
    },
  ];

  @ApiProperty()
  comments?: [
    {
      uuid: string;
      content: string;
      user: {
        uuid: string;
        name: string;
        username: string;
        profile_pic: string;
      };
      created_at: Date;
      updated_at: Date;
    },
  ];

  @ApiProperty()
  ratings?: [
    {
      rating: number;
    },
  ];

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
