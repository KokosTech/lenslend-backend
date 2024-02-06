import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class CreateServiceDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Length(3, 56)
  @ApiProperty()
  name: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  icon: string;
}
