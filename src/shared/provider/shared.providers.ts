import { DataSource } from 'typeorm';
import { Asset } from 'src/entities/asset.entity';
import { Subscription } from 'src/entities/subscription.entity';
import { Playlist } from 'src/entities/playlist.entity';
export const SharedProviders = [
  {
    provide: 'ASSET_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Asset),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'PLAYLIST_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Playlist),
    inject: ['DATA_SOURCE'],
  },
];
