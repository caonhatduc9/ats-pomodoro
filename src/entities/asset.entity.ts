import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Setting } from './setting.entity';
import { Subscription } from './subscription.entity';
import { DefaultSetting } from './defaultSetting.entity';
import { Playlist } from './playlist.entity';

@Entity('asset', { schema: 'ats_pomodoro' })
export class Asset {
  @PrimaryGeneratedColumn({ type: 'int', name: 'assetId' })
  assetId: number;

  @Column('text', { name: 'assetName' })
  assetName: string;

  @Column('text', { name: 'author' })
  author: string;

  @Column('varchar', { name: 'type', length: 20 })
  type: string;

  @Column('text', { name: 'assetURL' })
  assetUrl: string;

  @Column('tinyint', { name: 'isFree' })
  isFree: number;

  @Column('date', { name: 'createdDate' })
  createdDate: string;

  @Column('date', { name: 'publishedDate', nullable: true })
  publishedDate: string | null;

  @Column('date', { name: 'modifiedDate', nullable: true })
  modifiedDate: string | null;

  @Column('tinyint', { name: 'isDefault', nullable: false, default: 0 })
  isDefault: number | null;

  @Column('float', { name: 'price', default: 0 })
  price: number;

  @Column('text', { name: 'thumbnail' })
  thumbnail: string;

  @Column('int', { name: 'durationSec', nullable: true, default: 0 })
  durationSec: number | null;

  @OneToMany(() => Setting, (setting) => setting.backgroundMusic2)
  settings: Setting[];

  // @OneToMany(() => Setting, (setting) => setting.longBreakBackground2)
  // settings2: Setting[];

  @OneToMany(() => Setting, (setting) => setting.currentBackgroundSelected2)
  settings3: Setting[];

  @OneToMany(() => Setting, (setting) => setting.ringSound2)
  settings4: Setting[];

  @OneToMany(
    () => DefaultSetting,
    (defaultSetting) => defaultSetting.ringSoundSelected2,
  )
  defaultSettings: DefaultSetting[];

  @OneToMany(
    () => DefaultSetting,
    (defaultSetting) => defaultSetting.backgroundMusicSelected2,
  )
  defaultSettings2: DefaultSetting[];

  @OneToMany(
    () => DefaultSetting,
    (defaultSetting) => defaultSetting.currentBackgroundSelected2,
  )
  defaultSettings3: DefaultSetting[];
  // @OneToMany(() => Setting, (setting) => setting.shortBreakBackground2)
  // settings5: Setting[];

  @OneToMany(() => Subscription, (subscription) => subscription.asset)
  subscriptions: Subscription[];

  @Column('int', { name: 'playlist', nullable: true })
  playlist: number | null;

  @ManyToOne(() => Playlist, (playlist) => playlist.assets, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'playlist', referencedColumnName: 'playlistId' }])
  playlist2: Playlist;
}
