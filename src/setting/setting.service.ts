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

  async create(userId: number, createSettingDto: CreateSettingDto) {
    const setting = await this.settingRepository.findOne({ where: { userId } });

    if (setting) {
      // Cập nhật các thuộc tính của setting
      setting.pomodoroTime = createSettingDto.pomodoroTime || 25;
      setting.ringSoundVolumn = createSettingDto.ringSoundVolumn || 50;
      setting.ringSoundRepeat = createSettingDto.ringSoundRepeat || 1;
      setting.backgroundMusicVolumn = createSettingDto.backgroundMusicVolumn || 50;
      setting.shortBreakTime = createSettingDto.shortBreakTime || 5;
      setting.longBreakTime = createSettingDto.longBreakTime || 15;
      setting.autoStartBreak = createSettingDto.autoStartBreak || 0;
      setting.autoStartPomodoro = createSettingDto.autoStartPomodoro || 0;
      setting.longBreakInterval = createSettingDto.longBreakInterval || 4;
      setting.autoSwitchTask = createSettingDto.autoSwitchTask || 0;
      setting.darkmodeWhenRunning = createSettingDto.darkmodeWhenRunning || 0;
      // setting.pomodoroColor = createSettingDto.pomodoroColor || '#ff0000';
      // setting.shortBreakColor = createSettingDto.shortBreakColor || '#00ff00';
      // setting.longBreakColor = createSettingDto.longBreakColor || '#0000ff';

      // Kiểm tra và cập nhật ringSound nếu ringSoundId được cung cấp và tồn tại trong bảng Asset
      if (createSettingDto.ringSoundId) {
        const ringSoundExists = await this.assetRepository.findOne({ where: { assetId: createSettingDto.ringSoundId } });
        setting.ringSound = ringSoundExists ? createSettingDto.ringSoundId : null;
      }

      // Kiểm tra và cập nhật backgroundMusic nếu backgroundMusicId được cung cấp và tồn tại trong bảng Asset
      if (createSettingDto.backgroundMusicId) {
        const backgroundMusicExists = await this.assetRepository.findOne({ where: { assetId: createSettingDto.backgroundMusicId } });
        setting.backgroundMusic = backgroundMusicExists ? createSettingDto.backgroundMusicId : null;
      }

      // Kiểm tra và cập nhật pomodoroBackground nếu pomodoroBackgroundId được cung cấp và tồn tại trong bảng Asset
      if (createSettingDto.pomodoroBackgroundId) {
        const pomodoroBackgroundExists = await this.assetRepository.findOne({ where: { assetId: createSettingDto.pomodoroBackgroundId } });
        setting.pomodoroBackground = pomodoroBackgroundExists ? createSettingDto.pomodoroBackgroundId : null;
      }

      // Kiểm tra và cập nhật shortBreakBackground nếu shortBreakBackgroundId được cung cấp và tồn tại trong bảng Asset
      if (createSettingDto.shortBreakBackgroundId) {
        const shortBreakBackgroundExists = await this.assetRepository.findOne({ where: { assetId: createSettingDto.shortBreakBackgroundId } });
        setting.shortBreakBackground = shortBreakBackgroundExists ? createSettingDto.shortBreakBackgroundId : null;
      }

      // Kiểm tra và cập nhật longBreakBackground nếu longBreakBackgroundId được cung cấp và tồn tại trong bảng Asset
      if (createSettingDto.longBreakBackgroundId) {
        const longBreakBackgroundExists = await this.assetRepository.findOne({ where: { assetId: createSettingDto.longBreakBackgroundId } });
        setting.longBreakBackground = longBreakBackgroundExists ? createSettingDto.longBreakBackgroundId : null;
      }

      // Lưu setting đã cập nhật
      const updatedSetting = await this.settingRepository.save(setting);

      console.log("updatedSetting");
      return {
        statusCode: 200,
        meesage: "update success",
      };
    } else {
      const newSetting = this.settingRepository.create({
        userId,
        pomodoroTime: createSettingDto.pomodoroTime || 25,
        ringSoundVolumn: createSettingDto.ringSoundVolumn || 50,
        ringSoundRepeat: createSettingDto.ringSoundRepeat || 1,
        backgroundMusicVolumn: createSettingDto.backgroundMusicVolumn || 50,
        shortBreakTime: createSettingDto.shortBreakTime || 5,
        longBreakTime: createSettingDto.longBreakTime || 15,
        autoStartBreak: createSettingDto.autoStartBreak || 0,
        autoStartPomodoro: createSettingDto.autoStartPomodoro || 0,
        longBreakInterval: createSettingDto.longBreakInterval || 4,
        autoSwitchTask: createSettingDto.autoSwitchTask || 0,
        darkmodeWhenRunning: createSettingDto.darkmodeWhenRunning || 0,
        // pomodoroColor: createSettingDto.pomodoroColor || null,
        // shortBreakColor: createSettingDto.shortBreakColor,
        // longBreakColor: createSettingDto.longBreakColor,
      });
      // Kiểm tra và cập nhật ringSound nếu ringSoundId được cung cấp và tồn tại trong bảng Asset
      if (createSettingDto.ringSoundId) {
        const ringSoundExists = await this.assetRepository.findOne({ where: { assetId: createSettingDto.ringSoundId } });
        newSetting.ringSound = ringSoundExists ? createSettingDto.ringSoundId : null;
      }

      // Kiểm tra và cập nhật backgroundMusic nếu backgroundMusicId được cung cấp và tồn tại trong bảng Asset
      if (createSettingDto.backgroundMusicId) {
        const backgroundMusicExists = await this.assetRepository.findOne({ where: { assetId: createSettingDto.backgroundMusicId } });
        newSetting.backgroundMusic = backgroundMusicExists ? createSettingDto.backgroundMusicId : null;
      }

      // Kiểm tra và cập nhật pomodoroBackground nếu pomodoroBackgroundId được cung cấp và tồn tại trong bảng Asset
      if (createSettingDto.pomodoroBackgroundId) {
        const pomodoroBackgroundExists = await this.assetRepository.findOne({ where: { assetId: createSettingDto.pomodoroBackgroundId } });
        newSetting.pomodoroBackground = pomodoroBackgroundExists ? createSettingDto.pomodoroBackgroundId : null;
      }

      // Kiểm tra và cập nhật shortBreakBackground nếu shortBreakBackgroundId được cung cấp và tồn tại trong bảng Asset
      if (createSettingDto.shortBreakBackgroundId) {
        const shortBreakBackgroundExists = await this.assetRepository.findOne({ where: { assetId: createSettingDto.shortBreakBackgroundId } });
        newSetting.shortBreakBackground = shortBreakBackgroundExists ? createSettingDto.shortBreakBackgroundId : null;
      }

      // Kiểm tra và cập nhật longBreakBackground nếu longBreakBackgroundId được cung cấp và tồn tại trong bảng Asset
      if (createSettingDto.longBreakBackgroundId) {
        const longBreakBackgroundExists = await this.assetRepository.findOne({ where: { assetId: createSettingDto.longBreakBackgroundId } });
        newSetting.longBreakBackground = longBreakBackgroundExists ? createSettingDto.longBreakBackgroundId : null;
      }

      const createdSetting = await this.settingRepository.save(newSetting);

      console.log("createdSetting");
      return {
        statusCode: 200,
        meesage: "create success",
      };
    }
  }


}
