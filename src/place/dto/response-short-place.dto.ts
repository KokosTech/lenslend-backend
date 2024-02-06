import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ResponseShortPlaceDto {
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
  lat: number;

  @Expose()
  @ApiProperty()
  lng: number;
}
