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
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SingupDto {
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
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

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @Expose()
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  dateOfBirth: string;

  @Expose()
  @IsPhoneNumber()
  @IsNotEmpty()
  @ApiProperty()
  phone: string;
}
