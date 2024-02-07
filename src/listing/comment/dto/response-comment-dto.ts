import { Exclude, Expose } from 'class-transformer';
import { ResponseCardUserDto } from '../../../user/dtos/response-card-user.dto';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ResponseCommentDto {
  @Expose()
  @ApiProperty()
  uuid: string;

  @Expose()
  @ApiProperty()
  content: string;

  @Expose()
  @ApiProperty({
    type: ResponseCardUserDto,
  })
  user: ResponseCardUserDto;

  @Expose()
  @ApiProperty({
    type: Date,
  })
  created_at: Date;

  @Expose()
  @ApiProperty({
    type: Date,
  })
  updated_at: Date;
}
