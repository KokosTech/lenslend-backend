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
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SignupOneDto {
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(16)
  @Matches(/^[a-z0-9._]+$/, {
    message: 'username.invalid_characters',
  })
  @ApiProperty()
  username: string;

  @Expose()
  @IsStrongPassword()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty()
  password: string;

  @Expose()
  @IsStrongPassword()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty()
  confirmPassword: string;
}

@Exclude()
export class SignupDto extends SignupOneDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @ApiProperty()
  firstName: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @ApiProperty()
  lastName: string;

  @Expose()
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  dateOfBirth: string;

  @Expose()
  @IsPhoneNumber('BG')
  @IsNotEmpty()
  @ApiProperty()
  phone: string;
}
