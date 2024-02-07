import { OmitType, PartialType } from '@nestjs/swagger';
import { ResponseMetaUserDto } from './response-meta-user.dto';
import { Exclude } from 'class-transformer';

@Exclude()
export class ResponseShortMetaUserDto extends PartialType(
  OmitType(ResponseMetaUserDto, [
    'bio',
    'profile_pic',
    'header_pic',
    'rating',
  ] as const),
) {}
