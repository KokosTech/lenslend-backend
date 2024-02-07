import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ResponseSavedDto {
  @Exclude()
  @ApiProperty()
  saved: boolean;
}
