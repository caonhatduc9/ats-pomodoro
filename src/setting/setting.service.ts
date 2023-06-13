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

    const listAsset = await this.assetRepository.createQueryBuilder('asset')
      .select(['asset.assetId', 'asset.assetName', 'asset.author', 'asset.type', 'asset.assetUrl', 'asset.isFree'])
      .getMany();

    const ringSounds = [];
    const backgroundMusics = [];
    const pomodoroBackgrounds = [];
    const shortBreakBackgrounds = [];
    const longBreakBackgrounds = [];

    listAsset.forEach(item => {
      if (item.type === 'AUDIO') {
        ringSounds.push(item);
        backgroundMusics.push(item);
      }
      if (item.type === 'IMAGE') {
        pomodoroBackgrounds.push(item);
        shortBreakBackgrounds.push(item);
        longBreakBackgrounds.push(item);
      }
    }
    )
    const assets = {
      ringSounds,
      backgroundMusics,
      pomodoroBackgrounds,
      shortBreakBackgrounds,
      longBreakBackgrounds,
    }
    const cleanedData = {
      userId: data["userId"],
      pomodoroTime: data["pomodoroTime"],
      shortBreakTime: data["shortBreakTime"],
      longBreakTime: data["longBreakTime"],
      autoStartBreak: data["autoStartBreak"],
      autoStartPomodoro: data["autoStartPomodoro"],
      longBreakInterval: data["longBreakInterval"],
      autoSwitchTask: data["autoSwitchTask"],
      ringSound: {
        assetId: data["ringSound2"]["assetId"],
        assetName: data["ringSound2"]["assetName"],
        type: data["ringSound2"]["type"],
        assetUrl: data["ringSound2"]["assetUrl"]
      },
      ringSoundVolumn: data["ringSoundVolumn"],
      ringSoundRepeat: data["ringSoundRepeat"],
      backgroundMusic: {
        assetId: data["backgroundMusic2"]["assetId"],
        assetName: data["backgroundMusic2"]["assetName"],
        type: data["backgroundMusic2"]["type"],
        assetUrl: data["backgroundMusic2"]["assetUrl"],
      },
      backgroundMusicVolumn: data["backgroundMusicVolumn"],
      pomodoroBackground: {
        assetId: data["pomodoroBackground2"]["assetId"],
        assetName: data["pomodoroBackground2"]["assetName"],
        type: data["pomodoroBackground2"]["type"],
        assetUrl: data["pomodoroBackground2"]["assetUrl"]
      },
      shortBreakBackground: {
        assetId: data["shortBreakBackground2"]["assetId"],
        assetName: data["shortBreakBackground2"]["assetName"],
        type: data["shortBreakBackground2"]["type"],
        assetUrl: data["shortBreakBackground2"]["assetUrl"]
      },
      longBreakBackground: {
        assetId: data["longBreakBackground2"]["assetId"],
        assetName: data["longBreakBackground2"]["assetName"],
        type: data["longBreakBackground2"]["type"],
        assetUrl: data["longBreakBackground2"]["assetUrl"]
      },
      darkmodeWhenRunning: data["darkmodeWhenRunning"],
      pomodoroColor: data["pomodoroColor"],
      shortBreakColor: data["shortBreakColor"],
      longBreakColor: data["longBreakColor"],
      assets,
    }

    return {
      status: 'success',
      data: cleanedData ? cleanedData : {},
    }
  }

  // async create(userId: number, createSettingDto: CreateSettingDto) {

  //   const createSetting:Setting = {
  //     userId,
  //     pomodoroTime: createSettingDto.pomodoroTime ? createSettingDto.pomodoroTime : 25,
  //     shortBreakTime: createSettingDto.shortBreakTime ? createSettingDto.shortBreakTime : 5,
  //     longBreakTime: createSettingDto.longBreakTime ? createSettingDto.longBreakTime : 15,
  //     autoStartBreak: createSettingDto.autoStartBreak ? createSettingDto.autoStartBreak : 0,
  //     autoStartPomodoro: createSettingDto.autoStartPomodoro ? createSettingDto.autoStartPomodoro : 0,
  //     longBreakInterval: createSettingDto.longBreakInterval ? createSettingDto.longBreakInterval : 4,
  //     autoSwitchTask: createSettingDto.autoSwitchTask ? createSettingDto.autoSwitchTask : 0,
  //     ringSound: createSettingDto.ringSoundId ? createSettingDto.ringSoundId : null,
  //     ringSoundVolumn: createSettingDto.ringSoundVolumn ? createSettingDto.ringSoundVolumn : 100,
  //     ringSoundRepeat: createSettingDto.ringSoundRepeat ? createSettingDto.ringSoundRepeat : 1,
  //     backgroundMusic: createSettingDto.backgroundMusicId ? createSettingDto.backgroundMusicId : null,
  //     backgroundMusicVolumn: createSettingDto.backgroundMusicVolumn ? createSettingDto.backgroundMusicVolumn : 100,
  //     pomodoroBackground: createSettingDto.pomodoroBackgroundId ? createSettingDto.pomodoroBackgroundId : null,
  //     shortBreakBackground: createSettingDto.shortBreakBackgroundId ? createSettingDto.shortBreakBackgroundId : null,
  //     longBreakBackground: createSettingDto.longBreakBackgroundId ? createSettingDto.longBreakBackgroundId : null,
  //     darkmodeWhenRunning: createSettingDto.darkmodeWhenRunning ? createSettingDto.darkmodeWhenRunning : 0,
  //     pomodoroColor: createSettingDto.pomodoroColor ? createSettingDto.pomodoroColor : '#ff0000',
  //     shortBreakColor: createSettingDto.shortBreakColor ? createSettingDto.shortBreakColor : '#00ff00',
  //     longBreakColor: createSettingDto.longBreakColor ? createSettingDto.longBreakColor : '#0000ff',
  //   }
  //   console.log(createSetting);
  //   const foundedSetting = await this.settingRepository.findOne({ where: { userId } });
  //   if (foundedSetting) {
  //     createSetting.userId = foundedSetting.userId;
  //     const updatedSetting = await this.settingRepository.save(createSetting);
  //     console.log("updatedSetting");
  //     return {
  //       statusCode: 200,
  //       data: updatedSetting ? updatedSetting : {},
  //     }
  //   }
  //   else {
  //     const createdSetting = await this.settingRepository.save(createSetting);
  //     console.log("createdSetting");
  //     return {
  //       sstatusCode: 200,
  //       data: createdSetting ? createdSetting : {},
  //     }
  //   }
  // }
}
