import { Inject, Injectable } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Repository } from 'typeorm';
import { Setting } from '../entities/setting.entity';
import { Asset } from '../entities/asset.entity';
@Injectable()
export class SettingService {
  constructor(@Inject('SETTING_REPOSITORY') private settingRepository: Repository<Setting>,
    @Inject('ASSET_REPOSITORY') private assetRepository: Repository<Asset>
  ) { }

  async findByUserId(id: number) {
    const data = await this.settingRepository.createQueryBuilder('setting')
      .leftJoinAndSelect('setting.user', 'user')
      .leftJoinAndSelect('setting.ringSound2', 'ringSound')
      .leftJoinAndSelect('setting.longBreakBackground2', 'longBreakBackground2')
      .leftJoinAndSelect('setting.backgroundMusic2', 'backgroundMusic2')
      .leftJoinAndSelect('setting.pomodoroBackground2', 'pomodoroBackground2')
      .leftJoinAndSelect('setting.shortBreakBackground2', 'shortBreakBackground2')
      .where('user.userId = :id', { id })
      .getOne();

    const cleanedData = {
      userId: data["userId"],
      pomodoroTime: data["pomodoroTime"],
      shortBreakTime: data["shortBreakTime"],
      longBreakTime: data["longBreakTime"],
      autoStartBreak: data["autoStartBreak"],
      autoStartPomodoro: data["autoStartPomodoro"],
      longBreakInterval: data["longBreakInterval"],
      autoSwitchTask: data["autoSwitchTask"],
      ringSound: data["ringSound2"]["assetUrl"],
      ringSoundVolumn: data["ringSoundVolumn"],
      ringSoundRepeat: data["ringSoundRepeat"],
      backgroundMusic: data["backgroundMusic2"]["assetUrl"],
      backgroundMusicVolumn: data["backgroundMusicVolumn"],
      pomodoroBackground: data["pomodoroBackground2"]["assetUrl"],
      shortBreakBackground: data["shortBreakBackground2"]["assetUrl"],
      longBreakBackground: data["longBreakBackground2"]["assetUrl"],
      darkmodeWhenRunning: data["darkmodeWhenRunning"],
      pomodoroColor: data["pomodoroColor"],
      shortBreakColor: data["shortBreakColor"],
      longBreakColor: data["longBreakColor"],
    }

    return {
      status: 'success',
      data: cleanedData ? cleanedData : {},
    }
  }

  async create(userId: number, createSettingDto: CreateSettingDto) {

    const createSetting = { userId, ...createSettingDto };
    const createAssetRingSound = {
      userId,
      ringSound: createSettingDto.ringSound,
      backgroundMusic: createSettingDto.backgroundMusic,
      pomodoroBackground: createSettingDto.pomodoroBackground,
      shortBreakBackground: createSettingDto.shortBreakBackground,
      longBreakBackground: createSettingDto.longBreakBackground,
    }

  }

}
