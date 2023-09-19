import { DataSource } from 'typeorm';
import { Asset } from 'src/entities/asset.entity';
import { Subscription } from 'src/entities/subscription.entity';
export const SharedProviders = [
    {
        provide: 'ASSET_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Asset),
        inject: ['DATA_SOURCE'],
    },
    
];
