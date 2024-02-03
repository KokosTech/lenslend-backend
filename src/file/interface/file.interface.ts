import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface FileInterface {
  url: string;
  key: string;
  public_url: string;
}

export class FileResponseDto {
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
