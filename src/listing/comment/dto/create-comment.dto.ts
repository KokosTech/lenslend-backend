import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateCommentDto {
  @Expose()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(240)
  content: string;
}
