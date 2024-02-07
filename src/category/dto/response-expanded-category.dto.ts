import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ResponseExpandedCategoryDto {
  @Expose()
  @ApiProperty()
  uuid: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty({
    type: [ResponseExpandedCategoryDto],
  })
  sub_categories: ResponseExpandedCategoryDto[];
}
