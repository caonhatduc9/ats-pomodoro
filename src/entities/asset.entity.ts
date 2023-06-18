import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Setting } from './setting.entity';

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

  @Column('tinyint', { name: 'isDefault', nullable: true, default: 0 })
  isDefault: number | null;

  @OneToMany(() => Setting, (setting) => setting.backgroundMusic2)
  settings: Setting[];

  // @OneToMany(() => Setting, (setting) => setting.longBreakBackground2)
  // settings2: Setting[];

  @OneToMany(() => Setting, (setting) => setting.currentBackgroundSelected2)
  settings3: Setting[];

  @OneToMany(() => Setting, (setting) => setting.ringSound2)
  settings4: Setting[];

  // @OneToMany(() => Setting, (setting) => setting.shortBreakBackground2)
  // settings5: Setting[];
}
