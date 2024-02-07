import { Exclude } from 'class-transformer';
import { OmitType, PartialType } from '@nestjs/swagger';
import { ResponsePublicProfileDto } from './response-user.dto';

@Exclude()
export class ResponseMetaUserDto extends PartialType(
  OmitType(ResponsePublicProfileDto, ['role', 'created_at'] as const),
) {}
