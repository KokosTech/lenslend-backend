import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';

// @Exclude()
export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @Expose()
  @ApiProperty({
    enum: Status,
    required: false,
  })
  status?: Status;
}
