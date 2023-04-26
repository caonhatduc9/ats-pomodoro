import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
  ) { }
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  async findOne(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }
}
