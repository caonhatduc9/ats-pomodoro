import { Inject, Injectable } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { async } from 'rxjs';

@Injectable()
export class SettingService {
  constructor(@Inject('SETTING_REPOSITORY') private settingRepository: Repository<Setting>) { }

  async findByUserId(id: number) {
    const data = await this.settingRepository.createQueryBuilder('setting')
      .leftJoinAndSelect('setting.user', 'user')
      .where('user.userId = :id', { id })
      .getOne();
    return {
      status: 'success',
      data: data ? data : {},
    }
  }
}
