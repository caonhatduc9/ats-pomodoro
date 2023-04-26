import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Price } from './price.entity';
import { User } from './user.entity';

@Index('subcription_user_userId_idx', ['userId'], {})
@Index('subcription_price_priceId_idx', ['priceId'], {})
@Entity('subcription', { schema: 'ats_pomodoro' })
export class Subcription {
  @PrimaryGeneratedColumn({ type: 'int', name: 'subcriptionId' })
  subcriptionId: number;

  @Column('int', { name: 'userId' })
  userId: number;

  @Column('int', { name: 'priceId' })
  priceId: number;

  @Column('date', { name: 'createdDate' })
  createdDate: string;

  @Column('date', { name: 'endDate', nullable: true })
  endDate: string | null;

  @ManyToOne(() => Price, (price) => price.subcriptions, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'priceId', referencedColumnName: 'priceId' }])
  price: Price;

  @ManyToOne(() => User, (user) => user.subcriptions, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'userId' }])
  user2: User;

  @OneToMany(() => User, (user) => user.currentSubcription)
  users: User[];
}
