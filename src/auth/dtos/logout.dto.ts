import { IsJWT, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutDto {
  @IsJWT()
  @IsNotEmpty()
  @ApiProperty()
  accessToken: string;

  @IsJWT()
  @IsNotEmpty()
  @ApiProperty()
  refreshToken: string;
}
