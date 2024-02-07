import { Exclude, Expose } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class CreateTagDto {
  @Expose()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty()
  name: string;
}
