import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ResponseCardUserDto } from '../../user/dtos/response-card-user.dto';

@Exclude()
export class VisitorDto {
  @Expose()
  @ApiProperty()
  uuid: string;

  @Expose()
  @ApiProperty({
    type: Date,
  })
  created_at: Date;

  @Expose()
  @ApiProperty({
    type: ResponseCardUserDto,
  })
  user: ResponseCardUserDto;
}
