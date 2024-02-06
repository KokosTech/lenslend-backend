import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto';
import { Exclude, Expose } from 'class-transformer';
import { $Enums } from '@prisma/client';
import Status = $Enums.Status;

@Exclude()
export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @Expose()
  @ApiProperty({
    enum: Status,
    example: Status.PUBLIC,
  })
  status?: Status;
}
