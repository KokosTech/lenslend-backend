import { IsJWT, IsNotEmpty } from 'class-validator';

export class LogoutDto {
  @IsJWT()
  @IsNotEmpty()
  accessToken: string;
  @IsJWT()
  @IsNotEmpty()
  refreshToken: string;
}
