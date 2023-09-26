import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UserProviders } from './providers/user.providers';
import { UploadCloudinaryModule } from '../upload-cloudinary/upload-cloudinary.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [DatabaseModule, UploadCloudinaryModule, SharedModule],
  controllers: [UserController],
  providers: [UserService, ...UserProviders],
  exports: [UserService, ...UserProviders],
})
export class UserModule {}
