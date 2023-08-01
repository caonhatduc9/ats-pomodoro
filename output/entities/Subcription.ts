import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Price } from "./Price";
import { User } from "./User";
import { Asset } from "./Asset";

@Index("subcription_FK", ["assetId"], {})
@Index("subcription_price_priceId_idx", ["priceId"], {})
@Index("subcription_user_userId_idx", ["userId"], {})
@Entity("subcription", { schema: "ats_pomodoro" })
export class Subcription {
  @PrimaryGeneratedColumn({ type: "int", name: "subcriptionId" })
  subcriptionId: number;

  @Column("int", { name: "userId" })
  userId: number;

  @Column("int", { name: "priceId" })
  priceId: number;

  @Column("date", { name: "createdDate" })
  createdDate: string;

  @Column("date", { name: "endDate", nullable: true })
  endDate: string | null;

  @Column("int", { name: "assetId", nullable: true })
  assetId: number | null;

  @ManyToOne(() => Price, (price) => price.subcriptions, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "priceId", referencedColumnName: "priceId" }])
  price: Price;

  @ManyToOne(() => User, (user) => user.subcriptions, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "userId", referencedColumnName: "userId" }])
  user2: User;

  @ManyToOne(() => Asset, (asset) => asset.subcriptions, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "assetId", referencedColumnName: "assetId" }])
  asset: Asset;

  @OneToMany(() => User, (user) => user.currentSubcription)
  users: User[];
}
