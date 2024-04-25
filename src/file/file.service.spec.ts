import { FileService } from './file.service';
import { FileDto } from './dtos/file.dto';
import { v4 as uuid } from 'uuid';
import { FileTypeEnum } from './enums/fileType.enum';
import { AclEnum } from './enums/acl.enum';

jest.mock('uuid');

describe('FileService', () => {
  it('should generate a valid key', () => {
    const fileParams: FileDto = {
      name: 'example.jpg',
      type: FileTypeEnum.jpeg,
      acl: AclEnum['public-read'],
    };
    const userUuid = 'user123';
    const awsS3Folder = 'test-aws-folder';
    const uuidMock = 'mock-uuid';
    (uuid as jest.Mock).mockReturnValue(uuidMock);

    const key = FileService.generateKey(fileParams, userUuid, awsS3Folder);

    // Validate the generated key
    expect(key.startsWith(`${awsS3Folder}/${userUuid}/`)).toBeTruthy();
    expect(key.endsWith(`-${fileParams.name}`)).toBeTruthy();
    expect(key.split('/')[2]).toEqual(`${uuidMock}-${fileParams.name}`);
  });

  it('should throw an error when AWS S3 folder is not defined', () => {
    const fileParams: FileDto = {
      name: 'example.jpg',
      type: FileTypeEnum.jpeg,
      acl: AclEnum['public-read'],
    };
    const userUuid = 'user123';
    const awsS3Folder: string | undefined = undefined;

    // Ensure that calling generateKey without providing awsS3Folder throws an error
    expect(() => {
      FileService.generateKey(fileParams, userUuid, awsS3Folder);
    }).toThrow('AWS S3 folder is not defined');
  });
});
