import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { User } from './user.entity';
import { Category } from './category.entity';

export enum TaskStatus {
  TODO = 'TODO',
  DOING = 'DOING',
  DONE = 'DONE',
  DELETE = 'DELETE',
}
@Index('task_user_userId_idx', ['userId'], {})
@Index('task_project_projectId_idx', ['projectId'], {})
@Index('task_FK', ['categoryId'], {})
@Entity('task', { schema: 'ats_pomodoro' })
export class Task {
  @PrimaryGeneratedColumn({ type: 'int', name: 'taskId' })
  taskId: number;

  @Column('int', { name: 'projectId', nullable: true })
  projectId: number;

  @Column('int', { name: 'userId' })
  userId: number;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
    name: 'status',
    nullable: true,
  })
  status: TaskStatus;

  @Column('text', { name: 'taskName' })
  taskName: string;

  @Column('int', { name: 'estimatePomodoro' })
  estimatePomodoro: number;

  @Column('int', {
    name: 'actualPomodoro',
    nullable: true,
    default: () => 0,
  })
  actualPomodoro: number | null;

  @Column('float', { name: 'timeSpent', nullable: true, default: 0 })
  timeSpent: number | null;

  @Column('text', { name: 'note', nullable: true })
  note: string | null;

  @Column('datetime', { name: 'createdDate', nullable: true })
  createdDate: string | null;

  @Column('datetime', { name: 'modifiedDate', nullable: true })
  modifiedDate: string | null;

  @Column('int', { name: 'categoryId', nullable: true })
  categoryId: number | null;

  @Column('float', {
    name: 'pomodoroTime',
    nullable: true,
    precision: 12,
    default: 25,
  })
  pomodoroTime: number | null;

  @Column('float', {
    name: 'shortBreakTime',
    nullable: true,
    precision: 12,
    default: 5,
  })
  shortBreakTime: number | null;

  @Column('float', {
    name: 'longBreakTime',
    nullable: true,
    precision: 12,
    default: 10,
  })
  longBreakTime: number | null;

  @Column('varchar', { name: 'priority', nullable: true, length: 7, default: 'medium' })
  priority: string | null;

  @Column('datetime', { name: 'timeRemind', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  timeRemind: Date | null;

  @Column('tinyint', { name: 'isRepeat', nullable: true, default: 0 })
  isRepeat: number | null;

  @Column('tinyint', { name: 'isAutoStartPomodoro', nullable: true, default: 0 })
  isAutoStartPomodoro: number | null;

  @Column('tinyint', { name: 'isAutoStartBreak', nullable: true, default: 0 })
  isAutoStartBreak: number | null;

  @ManyToOne(() => Project, (project) => project.tasks, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'projectId', referencedColumnName: 'projectId' }])
  project: Project;

  @ManyToOne(() => User, (user) => user.tasks, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'userId' }])
  user: User;

  @ManyToOne(() => Category, (category) => category.tasks, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'categoryId', referencedColumnName: 'categoryId' }])
  category: Category;
}
