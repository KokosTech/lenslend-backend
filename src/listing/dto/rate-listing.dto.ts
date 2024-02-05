import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RateListingDto {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  @ApiProperty()
  rating: number;
}
