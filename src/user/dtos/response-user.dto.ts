import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResponsePublicProfileDto {
  @Expose()
  @ApiProperty()
  uuid: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  username: string;

  @Expose()
  @ApiProperty()
  phone: string;

  @Expose()
  @ApiProperty()
  role: string;

  @Expose()
  @ApiProperty()
  profile_pic?: string;

  @Expose()
  @ApiProperty()
  header_pic?: string;

  @Expose()
  @ApiProperty()
  bio?: string;

  @Expose()
  @ApiProperty()
  created_at: string;
}

@Exclude()
export class ResponseProfileDto extends ResponsePublicProfileDto {
  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  date_of_birth: string;
}
