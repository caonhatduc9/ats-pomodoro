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
@Index('setting_pomodoroBackground_asserId_idx', ['pomodoroBackground'], {})
@Index('setting_shortBreakBackground_asserId_idx', ['shortBreakBackground'], {})
@Index('setting_longBreakBackground_asserId_idx', ['longBreakBackground'], {})
@Entity('setting', { schema: 'ats_pomodoro' })
export class Setting {
  @Column('int', { primary: true, name: 'userId' })
  userId: number;

  @Column('time', { name: 'pomodoroTime', nullable: true })
  pomodoroTime: string | null;

  @Column('time', { name: 'shortBreakTime', nullable: true })
  shortBreakTime: string | null;

  @Column('time', { name: 'longBreakTime', nullable: true })
  longBreakTime: string | null;

  @Column('tinyint', { name: 'autoStartBreak', nullable: true })
  autoStartBreak: number | null;

  @Column('tinyint', { name: 'autoStartPomodoro', nullable: true })
  autoStartPomodoro: number | null;

  @Column('int', { name: 'longBreakInterval', nullable: true })
  longBreakInterval: number | null;

  @Column('tinyint', { name: 'autoSwitchTask', nullable: true })
  autoSwitchTask: number | null;

  @Column('int', { name: 'ringSound', nullable: true })
  ringSound: number | null;

  @Column('int', { name: 'ringSoundVolumn', nullable: true })
  ringSoundVolumn: number | null;

  @Column('int', { name: 'ringSoundRepeat', nullable: true })
  ringSoundRepeat: number | null;
  @Column('int', { name: 'backgroundMusic', nullable: true })
  @Exclude()
  backgroundMusic: number | null;

  @Column('int', { name: 'backgroundMusicVolumn', nullable: true })
  backgroundMusicVolumn: number | null;

  @Column('int', { name: 'pomodoroBackground', nullable: true })
  pomodoroBackground: number | null;
  @Column('int', { name: 'shortBreakBackground', nullable: true })
  @Exclude()
  shortBreakBackground: number | null;
  @Column('int', { name: 'longBreakBackground', nullable: true })
  @Exclude()
  longBreakBackground: number | null;

  @Column('tinyint', { name: 'darkmodeWhenRunning', nullable: true })
  darkmodeWhenRunning: number | null;

  @Column('varchar', { name: 'pomodoroColor', nullable: true, length: 12, default: '#d95550' })
  pomodoroColor: string | null;

  @Column('varchar', { name: 'shortBreakColor', nullable: true, length: 12, default: '#4c9195' })
  shortBreakColor: string | null;

  @Column('varchar', { name: 'longBreakColor', nullable: true, length: 12, default: '#457ca3' })
  longBreakColor: string | null;

  @ManyToOne(() => Asset, (asset) => asset.settings, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'backgroundMusic', referencedColumnName: 'assetId' }])
  backgroundMusic2: Asset;

  @ManyToOne(() => Asset, (asset) => asset.settings2, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([
    { name: 'longBreakBackground', referencedColumnName: 'assetId' },
  ])
  longBreakBackground2: Asset;

  @ManyToOne(() => Asset, (asset) => asset.settings3, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'pomodoroBackground', referencedColumnName: 'assetId' }])
  pomodoroBackground2: Asset;

  @ManyToOne(() => Asset, (asset) => asset.settings4, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'ringSound', referencedColumnName: 'assetId' }])
  ringSound2: Asset;

  @ManyToOne(() => Asset, (asset) => asset.settings5, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([
    { name: 'shortBreakBackground', referencedColumnName: 'assetId' },
  ])
  shortBreakBackground2: Asset;

  @OneToOne(() => User, (user) => user.setting, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'userId' }])
  user: User;
}
