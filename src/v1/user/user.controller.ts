import {
  Body,
  Controller,
  Request,
  Get,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/auth.jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UpdateUserDto } from './dto/update.user.dto';
import { UploadCloudinaryService } from '../upload-cloudinary/upload-cloudinary.service';

@Controller('v1/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly uploadCloudinaryService: UploadCloudinaryService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Put('update')
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @Request() req: any,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      let avatarUrl; // Initialize avatarUrl
      if (file) {
        console.log('file', file);
        const cloudinaryResponse =
          await this.uploadCloudinaryService.uploadImage(file);
        avatarUrl = cloudinaryResponse.url; // Get the URL from the Cloudinary response
        console.log('Cloudinary response', cloudinaryResponse);
      }
      // Construct the field update object
      let fieldUpdate: Record<string, any> = {};
      delete updateUserDto.avatar; // Remove avatar from the DTO
      fieldUpdate = { ...updateUserDto };
      if (avatarUrl) {
        fieldUpdate.avatarUrl = avatarUrl; // Add avatarUrl only if it exists
      }
      // Update the user with the Cloudinary URL or other relevant information
      const updatedUser = await this.userService.updateUserFields(
        req.user.userId,
        fieldUpdate,
      );
      console.log(
        '🚀 ~ file: user.controller.ts:57 ~ UserController ~ updatedUser:',
        updatedUser,
      );
      delete updatedUser.password;
      delete updatedUser.userId;
      delete updatedUser.accessToken;
      delete updatedUser.paymentAccount;
      delete updatedUser.isActive;
      delete updatedUser.isPremium;
      delete updatedUser.authProvider;

      return {
        statusCode: 200,
        message: 'Update user successfully',
        data: updatedUser,
      };
    } catch (error) {
      throw new Error('Error when updating user');
    }
  }
}
