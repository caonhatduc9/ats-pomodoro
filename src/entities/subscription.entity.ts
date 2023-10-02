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
import { Asset } from './asset.entity';

@Index('subscription_FK', ['assetId'], {})
@Index('subscription_FK_1', ['userId'], {})
@Entity('subscription', { schema: 'ats_pomodoro' })
export class Subscription {
  @PrimaryGeneratedColumn({ type: 'int', name: 'subscriptionId' })
  subscriptionId: number;

  // @Column("int", { name: "priceId" })
  // priceId: number;

  @Column('datetime', { name: 'createdDate' })
  createdDate: string;

  @Column('datetime', { name: 'endDate', nullable: true })
  endDate: string | null;

  @Column('int', { name: 'assetId', nullable: true })
  assetId: number | null;
  @Column('varchar', { name: 'priceId', length: 100 })
  priceId: string | null;
  @Column('varchar', { name: 'customerId', length: 100 })
  customerId: string | null;

  @Column('varchar', { name: 'stripeSubscriptionId', length: 100 })
  stripeSubscriptionId: string;

  @Column('int', { name: 'userId', nullable: true })
  userId: number | null;

  @ManyToOne(() => User, (user) => user.subscriptions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'userId' }])
  user: User;

  @Column('enum', { name: 'typeSubscription', enum: ['monthly', 'annual'] })
  typeSubscription: 'monthly' | 'annual';

  @ManyToOne(() => Asset, (asset) => asset.subscriptions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'assetId', referencedColumnName: 'assetId' }])
  asset: Asset;
}
