// upload.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadApiResponse, v2 } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UploadCloudinaryService {
  constructor(private readonly configService: ConfigService) {
    v2.config({
      cloud_name: this.configService.get('CLOUDINARY_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      v2.uploader
        .upload_stream(
          {
            resource_type: 'image',
            folder: this.configService.get('CLOUDINARY_PATH'), // Thư mục đích trên Cloudinary
          },
          (error, res) => {
            if (error) {
              console.log(
                'Error in cloudinary.uploader.upload_stream\n',
                error,
              );
              reject(error);
            } else {
              console.log('Cloudinary audio info: ', res);
              console.log('Cloudinary url', res.url);
              resolve(res);
            }
          },
        )
        .end(file.buffer);
    });
  }
}
