import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class RateUserDto {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  @ApiProperty()
  rating: number;
}
