import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
// import { Price } from "./price.entity";
import { User } from "./user.entity";
import { Asset } from "./asset.entity";

@Index("subscription_FK", ["assetId"], {})
// @Index("subscription_price_priceId_idx", ["priceId"], {})
@Index("subscription_user_userId_idx", ["userId"], {})
@Entity("subscription", { schema: "ats_pomodoro" })
export class Subscription {
  @PrimaryGeneratedColumn({ type: "int", name: "subscriptionId" })
  subscriptionId: number;

  @Column("int", { name: "userId" })
  userId: number;

  // @Column("int", { name: "priceId" })
  // priceId: number;

  @Column("date", { name: "createdDate" })
  createdDate: string;

  @Column("date", { name: "endDate", nullable: true })
  endDate: string | null;

  @Column("int", { name: "assetId", nullable: true })
  assetId: number | null;
  @Column('varchar', { name: 'priceId', length: 100 })
  priceId: string | null;
  @Column('varchar', { name: 'customerId', length: 100 })
  customerId: string | null;


  // @ManyToOne(() => Price, (price) => price.subscriptions, {
  //   onDelete: "RESTRICT",
  //   onUpdate: "RESTRICT",
  // })
  // @JoinColumn([{ name: "priceId", referencedColumnName: "priceId" }])
  // price: Price;

  @ManyToOne(() => User, (user) => user.subscriptions, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "userId", referencedColumnName: "userId" }])
  user2: User;

  @Column('enum', { name: 'typeSubscription', enum: ['monthly', 'annual'] })
  typeSubscription: 'monthly' | 'annual';

  @ManyToOne(() => Asset, (asset) => asset.subscriptions, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "assetId", referencedColumnName: "assetId" }])
  asset: Asset;

  @OneToMany(() => User, (user) => user.currentSubscription)
  users: User[];
}
