import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Asset } from './asset.entity';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';

@Index('setting_ringSound_asserId_idx', ['ringSound'], {})
@Index('setting_backgroundMusic_asserId_idx', ['backgroundMusic'], {})
@Index(
  'setting_currentBackgroundSelected_asserId_idx',
  ['currentBackgroundSelected'],
  {},
)
// @Index('setting_shortBreakBackground_asserId_idx', ['shortBreakBackground'], {})
// @Index('setting_longBreakBackground_asserId_idx', ['longBreakBackground'], {})
@Entity('setting', { schema: 'ats_pomodoro' })
export class Setting {
  @Column('int', { primary: true, name: 'userId' })
  userId: number;

  @Column('float', { name: 'pomodoroTime', nullable: true })
  pomodoroTime: number | null;

  @Column('float', { name: 'shortBreakTime', nullable: true })
  shortBreakTime: number | null;

  @Column('float', { name: 'longBreakTime', nullable: true })
  longBreakTime: number | null;

  @Column('tinyint', { name: 'autoStartBreak', nullable: true })
  autoStartBreak: number | null;

  @Column('tinyint', { name: 'autoStartPomodoro', nullable: true })
  autoStartPomodoro: number | null;

  @Column('int', { name: 'longBreakInterval', nullable: true })
  longBreakInterval: number | null;

  @Column('tinyint', { name: 'autoSwitchTask', nullable: true })
  autoSwitchTask: number | null;

  @Column('int', { name: 'ringSoundSelected', nullable: true })
  ringSound: number | null;

  @Column('int', { name: 'ringSoundVolumn', nullable: true })
  ringSoundVolumn: number | null;

  @Column('int', { name: 'ringSoundRepeat', nullable: true })
  ringSoundRepeat: number | null;
  @Column('int', { name: 'backgroundMusicSelected', nullable: true })
  @Exclude()
  backgroundMusic: number | null;

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
    default: '#d95550',
  })
  pomodoroColor: string | null;

  @Column('varchar', {
    name: 'shortBreakColor',
    nullable: true,
    length: 12,
    default: '#4c9195',
  })
  shortBreakColor: string | null;

  @Column('tinyint', { name: 'isAceptAds', nullable: true, default: 0 })
  isAceptAds: number | null;

  @Column('varchar', {
    name: 'longBreakColor',
    nullable: true,
    length: 12,
    default: '#457ca3',
  })
  longBreakColor: string | null;

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

  @ManyToOne(() => Asset, (asset) => asset.settings, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([
    { name: 'backgroundMusicSelected', referencedColumnName: 'assetId' },
  ])
  backgroundMusic2: Asset;

  @ManyToOne(() => Asset, (asset) => asset.settings3, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([
    { name: 'currentBackgroundSelected', referencedColumnName: 'assetId' },
  ])
  currentBackgroundSelected2: Asset;

  @ManyToOne(() => Asset, (asset) => asset.settings4, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'ringSoundSelected', referencedColumnName: 'assetId' }])
  ringSound2: Asset;

  // @ManyToOne(() => Asset, (asset) => asset.settings5, {
  //   onDelete: 'RESTRICT',
  //   onUpdate: 'RESTRICT',
  // })
  // @JoinColumn([
  //   { name: 'shortBreakBackgroundSelected', referencedColumnName: 'assetId' },
  // ])
  // shortBreakBackground2: Asset;

  @OneToOne(() => User, (user) => user.setting, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'userId' }])
  user: User;
}
