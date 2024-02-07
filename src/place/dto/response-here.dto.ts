import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ResponseHereDto {
  @Exclude()
  @ApiProperty()
  here: boolean;
}
