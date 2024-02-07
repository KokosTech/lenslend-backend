import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FileTypeEnum } from '../enums/fileType.enum';
import { AclEnum } from '../enums/acl.enum';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FileDto {
  @Expose()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @ApiProperty({
    enum: FileTypeEnum,
    example: FileTypeEnum.jpeg,
  })
  @IsEnum(FileTypeEnum)
  @IsNotEmpty()
  type: FileTypeEnum;

  @Expose()
  @ApiProperty({
    enum: AclEnum,
    example: AclEnum['public-read'],
  })
  @IsEnum(AclEnum)
  @IsNotEmpty()
  acl: AclEnum;
}
