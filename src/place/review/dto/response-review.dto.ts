import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseCardUserDto } from '../../../user/dtos/response-card-user.dto';

@Exclude()
export class ResponseReviewDto {
  @Expose()
  @ApiProperty()
  uuid: string;

  @Expose()
  @ApiProperty()
  content: string;

  @Expose()
  @ApiProperty()
  rating: number;

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
