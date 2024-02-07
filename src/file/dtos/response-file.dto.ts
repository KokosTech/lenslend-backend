import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResponseFileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly key: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly url: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly public_url: string;
}
