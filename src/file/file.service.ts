import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PutObjectCommand,
  PutObjectRequest,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { FileDto } from './dtos/file.dto';
import { ResponseFileDto } from './dtos/response-file.dto';

@Injectable()
export class FileService {
  private readonly s3Client: S3Client;

  constructor(private readonly config: ConfigService) {
    this.s3Client = new S3Client({
      region: this.config.getOrThrow<string>('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.config.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.config.getOrThrow<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  static generateKey(
    fileParams: FileDto,
    userUuid: string,
    awsS3Folder: string | undefined,
  ): string {
    if (!awsS3Folder) {
      throw new Error('AWS S3 folder is not defined');
    }

    const { name } = fileParams;
    return `${awsS3Folder}/${userUuid}/${uuid()}-${name}`;
  }

  async uploadFile(
    fileParams: FileDto,
    userUuid: string,
  ): Promise<ResponseFileDto> {
    const { type, acl } = fileParams;
    const key = FileService.generateKey(
      fileParams,
      userUuid,
      this.config.get<string>('AWS_S3_FOLDER'),
    );

    const params: PutObjectRequest = {
      Bucket: this.config.get<string>('AWS_S3_BUCKET_NAME'),
      Key: key,
      ACL: acl,
      ContentType: `image/${type}`,
      Metadata: {
        user_uuid: userUuid,
      },
    };

    const command = new PutObjectCommand(params);

    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn: 60 * 5,
    });

    const public_url = `${this.config.get<string>('AWS_CLOUDFRONT_URL')}/${key}`;

    return {
      url,
      key,
      public_url,
    };
  }
}
