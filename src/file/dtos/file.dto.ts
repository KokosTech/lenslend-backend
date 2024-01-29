import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FileTypeEnum } from '../enums/fileType.enum';
import { AclEnum } from '../enums/acl.enum';

export class FileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    enum: FileTypeEnum,
    example: FileTypeEnum.jpeg,
  })
  @IsEnum(FileTypeEnum)
  @IsNotEmpty()
  type: FileTypeEnum;

  @ApiProperty({
    enum: AclEnum,
    example: AclEnum['public-read'],
  })
  @IsEnum(AclEnum)
  @IsNotEmpty()
  acl: AclEnum;
}
