import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { DeleteObjectOutput, ManagedUpload } from 'aws-sdk/clients/s3';

@Injectable()
export class FileStorageService {
  private AWS_S3_BUCKET = process.env.S3_BUCKET;
  private s3 = new S3({
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    },
  });

  public async uploadFile(file: Express.Multer.File, filename: string) {
    return await this.s3_upload(file, filename);
  }

  public async deleteFile(Key: string) {
    return await this.s3_delete(Key);
  }

  private async s3_upload(
    file: Express.Multer.File,
    filename: string,
  ): Promise<ManagedUpload.SendData> {
    const params: S3.PutObjectRequest = {
      Bucket: this.AWS_S3_BUCKET,
      Key: filename,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
      ContentDisposition: 'inline',
    };

    console.log(params);

    try {
      const response = await this.s3.upload(params).promise();
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  private async s3_delete(objectKey: string): Promise<DeleteObjectOutput> {
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: objectKey,
    };

    try {
      const response = await this.s3.deleteObject(params).promise();
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
