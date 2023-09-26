import { Module } from '@nestjs/common';
import { UploadCloudinaryService } from './upload-cloudinary.service';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get<string>('UPLOAD_FOLDER'), // Lấy giá trị của 'uploads' từ ConfigService
      }),
      inject: [ConfigService], // Inject ConfigService vào useFactory
    }),
  ],
  providers: [UploadCloudinaryService],
  exports: [UploadCloudinaryService],
})
export class UploadCloudinaryModule {}
