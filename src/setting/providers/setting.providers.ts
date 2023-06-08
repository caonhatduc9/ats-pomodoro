import { DataSource } from 'typeorm';
import { Setting } from './../../entities/setting.entity';
import { Asset } from '../../entities/asset.entity';
export const SettingProvider = [
  {
    provide: 'SETTING_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Setting),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ASSET_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Asset),
    inject: ['DATA_SOURCE'],
  },
];
