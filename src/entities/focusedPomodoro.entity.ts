import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Index('dayFocus_user_userId_idx', ['userId'], {})
@Entity('focusedpomodoro', { schema: 'ats_pomodoro' })
export class Focusedpomodoro {
  @Column('int', { primary: true, name: 'focusedPomodoroId' })
  focusedPomodoroId: number;

  @Column('int', { name: 'userId', nullable: true })
  userId: number | null;

  @Column('time', { name: 'timeFocus', nullable: true })
  timeFocus: string | null;

  @Column('date', { name: 'createdDate', nullable: true })
  createdDate: string | null;

  @ManyToOne(() => User, (user) => user.focusedpomodoros, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'userId' }])
  user: User;
}
