import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { UploadCloudinaryService } from '../upload-cloudinary/upload-cloudinary.service';
import { Asset } from 'src/entities/asset.entity';
@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
    @Inject('ASSET_REPOSITORY') private assetRepository: Repository<Asset>,
    private readonly uploadCloudinaryService: UploadCloudinaryService,
  ) {}
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  async findOne(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }
  async create(createUserDto: CreateUserDto): Promise<User> {
    // const email = createUserDto.email.toLowerCase();
    // const user = await this.userRepository.findOne({ where: { email } });
    // if (user) {
    //   throw new Error('Email already exists');
    // }
    const savedUser = await this.userRepository.save(createUserDto);
    return savedUser;
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }
  async updatePasswordById(id: number, newPassword: string): Promise<any> {
    return this.userRepository.update(id, { password: newPassword });
  }
  async update(
    userId: number,
    updateUserDto: UpdateUserDto,
    fileAvatar: Express.Multer.File,
  ): Promise<any> {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    delete user.password;
    user.username = updateUserDto.username;
    user.phoneNumber = updateUserDto.phoneNumber;
    // Object.assign(user, { ...updateUserDto })
    if (fileAvatar) {
      const uploadedImage = await this.uploadCloudinaryService.uploadImage(
        fileAvatar,
      );
      if (uploadedImage) {
        user.avatarUrl = uploadedImage.url;
      }
    }
    console.log(await this.userRepository.save(user));
    return {
      statusCode: 200,
      message: 'Update user successfully',
    };
    // if(user.role.roleName ===)
    // const newAsset = await this.saveAvatarUrl(avatarUrl.path);
    // user.avatarUrl = newAsset.url;
    // return await this.userRepository.save(user);
  }
  async updateUserFields(
    userId: number,
    updateFields: Record<string, any>,
  ): Promise<any> {
    const foundUser = await this.userRepository.findOneBy({ userId });
    // Lặp qua các trường cần cập nhật và áp dụng chúng vào foundUser
    for (const field in updateFields) {
      if (updateFields.hasOwnProperty(field)) {
        foundUser[field] = updateFields[field];
      }
    }
    return await this.userRepository.save(foundUser);
  }
}
