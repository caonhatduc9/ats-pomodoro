import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Focusedpomodoro } from './focusedPomodoro.entity';
import { Project } from './project.entity';
import { Setting } from './setting.entity';
import { Subcription } from './subcription.entity';
import { Task } from './task.entity';
import { Exclude } from 'class-transformer';

enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  APPLE = 'apple',
  GITHUB = 'github',
}
@Index('user_subcription_subcriptionId_idx', ['currentSubcriptionId'], {})
@Entity('user', { schema: 'ats_pomodoro' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'userId' })
  userId: number;

  @Column('text', { name: 'userName' })
  username: string;
  @Exclude()
  @Column('text', { name: 'password' })
  password: string;

  @Column('text', { name: 'avatarURL', nullable: true })
  avatarUrl: string | null;

  @Column('int', { name: 'currentSubcriptionID', nullable: true })
  currentSubcriptionId: number | null;

  @Column('varchar', { name: 'gender', nullable: true, length: 10 })
  gender: string | null;

  @Column('date', { name: 'birthDate', nullable: true })
  birthDate: string | null;

  @Column('text', { name: 'email' })
  email: string;

  @Column('varchar', { name: 'phoneNumber', length: 12, nullable: true })
  phoneNumber: string;

  @Column('text', { name: 'accessToken', nullable: true })
  accessToken: string | null;

  @Column('text', { name: 'paymentAccount', nullable: true })
  paymentAccount: string | null;

  @Column('tinyint', { name: 'active', nullable: true })
  isActive: number | null;

  @Column({
    type: 'enum',
    enum: AuthProvider,
    default: AuthProvider.LOCAL,
  })
  authProvider: AuthProvider;
  @OneToMany(() => Focusedpomodoro, (focusedpomodoro) => focusedpomodoro.user)
  focusedpomodoros: Focusedpomodoro[];

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];

  @OneToOne(() => Setting, (setting) => setting.user)
  setting: Setting;

  @OneToMany(() => Subcription, (subcription) => subcription.user2)
  subcriptions: Subcription[];

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @ManyToOne(() => Subcription, (subcription) => subcription.users, {
    onDelete: 'RESTRICT', 
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([
    { name: 'currentSubcriptionID', referencedColumnName: 'subcriptionId' },
  ])
  currentSubcription: Subcription;
}
