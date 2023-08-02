import { Inject, Injectable } from '@nestjs/common';
import { Asset } from 'src/entities/asset.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SharedService {
    constructor(@Inject('ASSET_REPOSITORY') private reportRepository: Repository<Asset>,
    ) { }

    async getAssetById(id: number): Promise<Asset> {
        return await this.reportRepository.findOne({ where: { assetId: id } });
    }

}
