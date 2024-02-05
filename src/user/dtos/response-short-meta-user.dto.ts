import { PartialType } from '@nestjs/mapped-types';
import { ResponseMetaUserDto } from './response-meta-user.dto';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ResponseShortMetaUserDto extends PartialType(ResponseMetaUserDto) {
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
}
