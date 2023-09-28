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

  @Column('float', { name: 'estimatePomodoro' })
  estimatePomodoro: number;

  @Column('float', {
    name: 'actualPomodoro',
    nullable: true,
    default: () => 0,
  })
  actualPomodoro: number | null;

  @Column('float', { name: 'timeSpent', nullable: true, default: 0 })
  timeSpent: number | null;

  @Column('text', { name: 'note', nullable: true })
  note: string | null;

  @Column('date', { name: 'createdDate', nullable: true })
  createdDate: string | null;

  @Column('date', { name: 'modifiedDate', nullable: true })
  modifiedDate: string | null;

  @Column('int', { name: 'categoryId', nullable: true })
  categoryId: number | null;

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
