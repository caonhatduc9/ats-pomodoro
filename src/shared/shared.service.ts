import { Inject, Injectable } from '@nestjs/common';
import { asyncScheduler } from 'rxjs';
import { Asset } from 'src/entities/asset.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SharedService {
  constructor(
    @Inject('ASSET_REPOSITORY') private reportRepository: Repository<Asset>,
  ) { }

  async getAssetById(id: number): Promise<Asset> {
    return await this.reportRepository.findOne({ where: { assetId: id } });
  }
  async getAssetDefaults(): Promise<Asset[]> {
    return await this.reportRepository.find({ where: { isDefault: 1 } });
  }
  getDateTimeNow(): string {
    const nowUTC = new Date();
    const userTimezoneOffset = 7 * 60; // Độ chênh lệch múi giờ GMT+7 là 7 giờ
    // Chuyển đổi ngày giờ thành múi giờ của người dùng
    const userTime = new Date(nowUTC.getTime() + userTimezoneOffset * 60000).toISOString();
    return userTime;
  }
}
