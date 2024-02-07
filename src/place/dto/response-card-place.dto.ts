import { Exclude, Expose } from 'class-transformer';
import { ImageDto } from '../../common/dtos/image.dto';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ResponseCardPlaceDto {
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
  lat: number;

  @Expose()
  @ApiProperty()
  lng: number;

  @Expose()
  @ApiProperty({
    type: ImageDto,
  })
  thumbnail: ImageDto;
}
