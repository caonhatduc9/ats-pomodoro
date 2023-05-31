import { DataSource } from 'typeorm';
import { Setting } from './../../entities/setting.entity';
export const SettingProvider = [
  {
    provide: 'SETTING_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Setting),
    inject: ['DATA_SOURCE'],
  },
];
