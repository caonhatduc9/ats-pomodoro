import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Asset } from './asset.entity';

@Index('defaultSetting_FK', ['ringSoundSelected'], {})
@Index('defaultSetting_FK_1', ['backgroundMusicSelected'], {})
@Index('defaultSetting_FK_2', ['currentBackgroundSelected'], {})
@Entity('defaultSetting', { schema: 'ats_pomodoro' })
export class DefaultSetting {
  @Column('tinyint', { name: 'autoStartBreak', nullable: true })
  autoStartBreak: number | null;

  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('tinyint', { name: 'autoStartPomodoro', nullable: true })
  autoStartPomodoro: number | null;

  @Column('int', { name: 'longBreakInterval', nullable: true })
  longBreakInterval: number | null;

  @Column('tinyint', { name: 'autoSwitchTask', nullable: true })
  autoSwitchTask: number | null;

  @Column('int', { name: 'ringSoundSelected', nullable: true })
  ringSoundSelected: number | null;

  @Column('int', { name: 'ringSoundVolumn', nullable: true })
  ringSoundVolumn: number | null;

  @Column('int', { name: 'ringSoundRepeat', nullable: true })
  ringSoundRepeat: number | null;

  @Column('int', { name: 'backgroundMusicSelected', nullable: true })
  backgroundMusicSelected: number | null;

  @Column('int', { name: 'backgroundMusicVolumn', nullable: true })
  backgroundMusicVolumn: number | null;

  @Column('int', { name: 'currentBackgroundSelected', nullable: true })
  currentBackgroundSelected: number | null;

  @Column('tinyint', { name: 'darkmodeWhenRunning', nullable: true })
  darkmodeWhenRunning: number | null;

  @Column('varchar', {
    name: 'pomodoroColor',
    nullable: true,
    length: 12,
    default: () => "'#d95550'",
  })
  pomodoroColor: string | null;

  @Column('varchar', {
    name: 'shortBreakColor',
    nullable: true,
    length: 12,
    default: () => "'#4c9195'",
  })
  shortBreakColor: string | null;

  @Column('varchar', {
    name: 'longBreakColor',
    nullable: true,
    length: 12,
    default: () => "'#457ca3'",
  })
  longBreakColor: string | null;

  @Column('float', { name: 'pomodoroTime', nullable: true, precision: 12 })
  pomodoroTime: number | null;

  @Column('float', { name: 'shortBreakTime', nullable: true, precision: 12 })
  shortBreakTime: number | null;

  @Column('float', { name: 'longBreakTime', nullable: true, precision: 12 })
  longBreakTime: number | null;

  @Column('tinyint', { name: 'isAceptAds', nullable: true, default: 0 })
  isAceptAds: number | null;

  @Column('tinyint', {
    name: 'isPlayBackgroundMusic',
    nullable: true,
    default: () => 1,
  })
  isPlayBackgroundMusic: number | null;

  @Column('varchar', {
    name: 'pomodoroStrokerColor',
    nullable: true,
    length: 10,
    default: () => '#ffffffff',
  })
  pomodoroStrokerColor: string | null;

  @Column('varchar', {
    name: 'shortBreakStrokerColor',
    nullable: true,
    length: 10,
    default: () => '#ffffffff',
  })
  shortBreakStrokerColor: string | null;

  @Column('varchar', {
    name: 'longBreakStrokerColor',
    nullable: true,
    length: 10,
    default: () => '#ffffffff',
  })
  longBreakStrokerColor: string | null;

  @Column('varchar', {
    name: 'backgroundColorLinear',
    nullable: true,
    length: 100,
    default: () =>
      '{"begin":[-0.97,-0.81],"end":[1,1.02],"colors":["#0cfafafa","#19000000"],"stops":[0,1]}',
  })
  backgroundColorLinear: string | null;

  @ManyToOne(() => Asset, (asset) => asset.defaultSettings, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'ringSoundSelected', referencedColumnName: 'assetId' }])
  ringSoundSelected2: Asset;

  @ManyToOne(() => Asset, (asset) => asset.defaultSettings2, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([
    { name: 'backgroundMusicSelected', referencedColumnName: 'assetId' },
  ])
  backgroundMusicSelected2: Asset;

  @ManyToOne(() => Asset, (asset) => asset.defaultSettings3, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([
    { name: 'currentBackgroundSelected', referencedColumnName: 'assetId' },
  ])
  currentBackgroundSelected2: Asset;
}
