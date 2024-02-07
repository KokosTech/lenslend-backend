import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { ResponseListingDto } from './response-listing.dto';
import { Exclude, Expose } from 'class-transformer';
import { ResponseShortMetaUserDto } from '../../user/dtos/response-short-meta-user.dto';
import { ImageDto } from '../../common/dtos/image.dto';

@Exclude()
export class ResponseShortListingDto extends PartialType(
  OmitType(ResponseListingDto, [
    'description',
    'user',
    'images',
    'tags',
  ] as const),
) {
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
}
