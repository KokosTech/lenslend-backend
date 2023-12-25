import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SingupDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  username: string;

  @IsStrongPassword()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty()
  password: string;

  @IsStrongPassword()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty()
  confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  dateOfBirth: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  @ApiProperty()
  phone: string;
}
