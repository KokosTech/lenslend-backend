import { Exclude } from 'class-transformer';
import { OmitType, PartialType } from '@nestjs/swagger';
import { ResponsePublicProfileDto } from './response-user.dto';

@Exclude()
export class ResponseCardUserDto extends PartialType(
  OmitType(ResponsePublicProfileDto, [
    'role',
    'phone',
    'header_pic',
    'bio',
  ] as const),
) {}
