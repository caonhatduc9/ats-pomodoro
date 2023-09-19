import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Setting } from './setting.entity';
import { Subscription } from './subscription.entity';

@Entity('asset', { schema: 'ats_pomodoro' })
export class Asset {
  @PrimaryGeneratedColumn({ type: 'int', name: 'assetId' })
  assetId: number;

  @Column('text', { name: 'assetName' })
  assetName: string;

  @Column('text', { name: 'author' })
  author: string;

  @Column('varchar', { name: 'type', length: 20 })
  type: string;

  @Column('text', { name: 'assetURL' })
  assetUrl: string;

  @Column('tinyint', { name: 'isFree' })
  isFree: number;

  @Column('date', { name: 'createdDate' })
  createdDate: string;

  @Column('date', { name: 'publishedDate', nullable: true })
  publishedDate: string | null;

  @Column('date', { name: 'modifiedDate', nullable: true })
  modifiedDate: string | null;

  @Column('tinyint', { name: 'isDefault', nullable: false, default: 0 })
  isDefault: number | null;

  @Column('float', { name: 'price', default: 0 })
  price: number;

  @OneToMany(() => Setting, (setting) => setting.backgroundMusic2)
  settings: Setting[];

  // @OneToMany(() => Setting, (setting) => setting.longBreakBackground2)
  // settings2: Setting[];

  @OneToMany(() => Setting, (setting) => setting.currentBackgroundSelected2)
  settings3: Setting[];

  @OneToMany(() => Setting, (setting) => setting.ringSound2)
  settings4: Setting[];

  // @OneToMany(() => Setting, (setting) => setting.shortBreakBackground2)
  // settings5: Setting[];

  @OneToMany(() => Subscription, (subscription) => subscription.asset)
  subscriptions: Subscription[];
}


// import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// import { Setting } from "./Setting";
// import { Subcription } from "./Subcription";

// @Entity("asset", { schema: "ats_pomodoro" })
// export class Asset {
//   @PrimaryGeneratedColumn({ type: "int", name: "assetId" })
//   assetId: number;

//   @Column("text", { name: "assetName" })
//   assetName: string;

//   @Column("text", { name: "author" })
//   author: string;

//   @Column("text", { name: "assetURL" })
//   assetUrl: string;

//   @Column("tinyint", { name: "isFree" })
//   isFree: number;

//   @Column("date", { name: "createdDate" })
//   createdDate: string;

//   @Column("date", { name: "publishedDate", nullable: true })
//   publishedDate: string | null;

//   @Column("date", { name: "modifiedDate", nullable: true })
//   modifiedDate: string | null;

//   @Column("varchar", { name: "type", length: 20 })
//   type: string;

//   @Column("tinyint", { name: "isDefault", default: () => "'0'" })
//   isDefault: number;

//   @OneToMany(() => Setting, (setting) => setting.backgroundMusicSelected2)
//   settings: Setting[];

//   @OneToMany(() => Setting, (setting) => setting.ringSoundSelected2)
  // settings2: Setting[];

//   @OneToMany(() => Setting, (setting) => setting.currentBackgroundSelected2)
//   settings3: Setting[];

//   @OneToMany(() => Subcription, (subcription) => subcription.asset)
//   subcriptions: Subcription[];
// }
