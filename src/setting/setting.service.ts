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
      // .leftJoinAndSelect('setting.longBreakBackground2', 'longBreakBackground2')
      .leftJoinAndSelect('setting.backgroundMusic2', 'backgroundMusic2')
      .leftJoinAndSelect('setting.currentBackgroundSelected2', 'currentBackgroundSelected2')
      // .leftJoinAndSelect('setting.shortBreakBackground2', 'shortBreakBackground2')
      .where('user.userId = :id', { id })
      .getOne();

    const listAsset = await this.assetRepository.createQueryBuilder('asset')
      .select(['asset.assetId', 'asset.assetName', 'asset.author', 'asset.type', 'asset.assetUrl', 'asset.isFree'])
      .getMany();

    const ringSounds = [];
    const backgroundMusics = [];
    const backgroundImages = [];

    listAsset.forEach(item => {
      if (item.type === 'AUDIO') {
        ringSounds.push(item);
      }
      if (item.type === 'MUSIC') {
        backgroundMusics.push(item);
      }
      if (item.type === 'IMAGE') {
        backgroundImages.push(item);
      }
    }
    )
    const assets = {
      ringSounds,
      backgroundMusics,
      backgroundImages,
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
      currentBackground: {
        assetId: data["currentBackgroundSelected2"]["assetId"],
        assetName: data["currentBackgroundSelected2"]["assetName"],
        type: data["currentBackgroundSelected2"]["type"],
        assetUrl: data["currentBackgroundSelected2"]["assetUrl"]
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
      if (createSettingDto.currentBackgroundId) {
        const pomodoroBackgroundExists = await this.assetRepository.findOne({ where: { assetId: createSettingDto.currentBackgroundId } });
        setting.currentBackgroundSelected = pomodoroBackgroundExists ? createSettingDto.currentBackgroundId : null;
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
      if (createSettingDto.currentBackgroundId) {
        const pomodoroBackgroundExists = await this.assetRepository.findOne({ where: { assetId: createSettingDto.currentBackgroundId } });
        newSetting.currentBackgroundSelected = pomodoroBackgroundExists ? createSettingDto.currentBackgroundId : null;
      }

      const createdSetting = await this.settingRepository.save(newSetting);

      console.log("createdSetting");
      return {
        statusCode: 200,
        meesage: "create success",
      };
    }
  }
  async createDefaultSetting(userId: number) {
    const assets = await this.assetRepository
      .createQueryBuilder('asset')
      .where('asset.isDefault = :value', { value: 1 })
      .getMany();

    const defaultMusic = assets.find(item => item.type === 'MUSIC' && item.isDefault === 1);
    const defaultAudio = assets.find(item => item.type === 'AUDIO' && item.isDefault === 1);
    const defaultImage = assets.find(item => item.type === 'IMAGE' && item.isDefault === 1);
    console.log("default music ", defaultMusic);
    const defaultPomodoroTime = 25;
    const defaultRingSoundVolumn = 50;
    const defaultRingSoundRepeat = 1;
    const defaultBackgroundMusicVolumn = 50;
    const defaultShortBreakTime = 5;
    const defaultLongBreakTime = 15;
    const defaultAutoStartBreak = 0;
    const defaultAutoStartPomodoro = 0;
    const defaultLongBreakInterval = 4;
    const defaultAutoSwitchTask = 0;
    const defaultDarkmodeWhenRunning = 0;
    // console.log(defaultMusic);
    // return assets;
    const newSetting = this.settingRepository.create({
      userId,
      pomodoroTime: defaultPomodoroTime,
      ringSoundVolumn: defaultRingSoundVolumn,
      ringSoundRepeat: defaultRingSoundRepeat,
      backgroundMusicVolumn: defaultBackgroundMusicVolumn,
      shortBreakTime: defaultShortBreakTime,
      longBreakTime: defaultLongBreakTime,
      autoStartBreak: defaultAutoStartBreak,
      autoStartPomodoro: defaultAutoStartPomodoro,
      longBreakInterval: defaultLongBreakInterval,
      autoSwitchTask: defaultAutoSwitchTask,
      darkmodeWhenRunning: defaultDarkmodeWhenRunning,
      ringSound: defaultAudio.assetId,
      backgroundMusic: defaultMusic.assetId,
      currentBackgroundSelected: defaultImage.assetId,
      // pomodoroColor: createSettingDto.pomodoroColor || null,
      // shortBreakColor: createSettingDto.shortBreakColor,
      // longBreakColor: createSettingDto.longBreakColor,
    });


    const createdSetting = await this.settingRepository.save(newSetting);
    console.log("createdSetting");
    return {
      statusCode: 200,
      meesage: "create success",
    };
  }
}

