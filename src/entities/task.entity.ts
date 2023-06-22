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

@Index('task_user_userId_idx', ['userId'], {})
@Index('task_project_projectId_idx', ['projectId'], {})
@Entity('task', { schema: 'ats_pomodoro' })
export class Task {
  @PrimaryGeneratedColumn({ type: 'int', name: 'taskId' })
  taskId: number;

  @Column('int', { name: 'projectId', nullable: true })
  projectId: number;

  @Column('int', { name: 'userId' })
  userId: number;

  @Column('varchar', { name: 'status', length: 20, nullable: true })
  status: string | null;

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

  @Column('float', { name: 'timeSpent', nullable: true })
  timeSpent: number | null;

  @Column('text', { name: 'note', nullable: true })
  note: string | null;

  @Column('date', { name: 'createdDate' })
  createdDate: string;

  @Column('date', { name: 'modifiedDate', nullable: true })
  modifiedDate: string | null;

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
}
