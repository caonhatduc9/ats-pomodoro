import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Subcription } from "./Subcription";

@Entity("price", { schema: "ats_pomodoro" })
export class Price {
  @PrimaryGeneratedColumn({ type: "int", name: "priceId" })
  priceId: number;

  @Column("varchar", { name: "type", length: 45 })
  type: string;

  @Column("float", { name: "price", precision: 12 })
  price: number;

  @Column("text", { name: "planDetail" })
  planDetail: string;

  @OneToMany(() => Subcription, (subcription) => subcription.price)
  subcriptions: Subcription[];
}
