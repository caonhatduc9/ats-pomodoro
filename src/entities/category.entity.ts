import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from './task.entity';

@Entity('category', { schema: 'ats_pomodoro' })
export class Category {
  @PrimaryGeneratedColumn({ type: 'int', name: 'categoryId' })
  categoryId: number;

  @Column('varchar', { name: 'name', nullable: true, length: 50 })
  name: string | null;

  @Column('text', { name: 'icon', nullable: true })
  icon: string | null;

  @OneToMany(() => Task, (task) => task.category)
  tasks: Task[];
}
