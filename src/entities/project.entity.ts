import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';

export enum ProjectStatus {
  TODO = 'TODO',
  DOING = 'DOING',
  DONE = 'DONE',
  DELETE = 'DELETE',
}

@Index('user_id_idx', ['userId'], {})
@Index('project_user_userId_idx', ['userId'], {})
@Entity('project', { schema: 'ats_pomodoro' })
export class Project {
  @PrimaryGeneratedColumn({ type: 'int', name: 'projectId' })
  projectId: number;

  @Column('int', { name: 'userId' })
  userId: number;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.TODO, name: 'status', nullable: true
  })
  status: ProjectStatus;

  @Column('text', { name: 'projectName' })
  projectName: string;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Column('date', { name: 'createdDate', nullable: true })
  createdDate: string | null;

  @Column('date', { name: 'modifiedDate', nullable: true })
  modifiedDate: string | null;

  @ManyToOne(() => User, (user) => user.projects, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'userId' }])
  user: User;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
}
