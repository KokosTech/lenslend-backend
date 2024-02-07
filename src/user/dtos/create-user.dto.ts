import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateUserDto {
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(16)
  @Matches(/^[a-z0-9._]+$/, {
    message: 'username.invalid_characters',
  })
  username: string;

  @Expose()
  @IsStrongPassword()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(41)
  name: string;

  @Expose()
  @IsPhoneNumber('BG')
  @IsNotEmpty()
  phone: string;

  @Expose()
  @IsDateString()
  @IsNotEmpty()
  date_of_birth: string;
}
