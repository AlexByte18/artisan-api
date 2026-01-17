import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

interface SingleFileRequest {
  file: Express.Multer.File;
  isPublic: boolean;
}

@Injectable()
export class DmsService {
  private s3Client: S3Client;
  private bucketName = this.configService.get('S3_BUCKET_NAME');

  constructor(
    private readonly configService: ConfigService,
  ) {
    const S3_REGION = this.configService.get('S3_REGION');

    this.s3Client = new S3Client({
    region: this.configService.get('S3_REGION'),
    credentials: {
      accessKeyId: this.configService.get('S3_ACCESS_KEY'),
      secretAccessKey: this.configService.get('S3_SECRET_ACCESS_KEY'),
    },
  });
  }

  async getFileUrl(key: string, isPublic = true) {
    return { url: `https://${this.bucketName}.s3.amazonaws.com/${key}` };
  }

  async uploadSingleFile({ file, isPublic = true }: SingleFileRequest) {
    try {
      const key = `${uuidv4()}`;
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          originalName: file.originalname,
        },
      });

      const uploadResult = await this.s3Client.send(command);

      return {
        url: isPublic ? (await this.getFileUrl(key)).url
        : (await this.getFileUrl(key, false)).url,
        key,
        isPublic,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getPresingnedUrl(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const url = await getSignedUrl(this.s3Client, command, { 
        expiresIn: 60 * 60 * 24,
      });

      return { url };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteFile(key: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);

      return { message: 'File deleted successfully'};
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}

