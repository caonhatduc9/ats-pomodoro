import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
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
}
