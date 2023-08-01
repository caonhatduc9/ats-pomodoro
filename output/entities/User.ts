import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { FocusedPomodoro } from "./FocusedPomodoro";
import { Project } from "./Project";
import { Setting } from "./Setting";
import { Subcription } from "./Subcription";
import { Task } from "./Task";

@Index("user_subcription_subcriptionId_idx", ["currentSubcriptionId"], {})
@Entity("user", { schema: "ats_pomodoro" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "userId" })
  userId: number;

  @Column("text", { name: "userName" })
  userName: string;

  @Column("text", { name: "password" })
  password: string;

  @Column("text", { name: "avatarURL", nullable: true })
  avatarUrl: string | null;

  @Column("int", { name: "currentSubcriptionID", nullable: true })
  currentSubcriptionId: number | null;

  @Column("varchar", { name: "gender", nullable: true, length: 10 })
  gender: string | null;

  @Column("date", { name: "birthDate", nullable: true })
  birthDate: string | null;

  @Column("text", { name: "email" })
  email: string;

  @Column("varchar", { name: "phoneNumber", nullable: true, length: 12 })
  phoneNumber: string | null;

  @Column("text", { name: "accessToken", nullable: true })
  accessToken: string | null;

  @Column("text", { name: "paymentAccount", nullable: true })
  paymentAccount: string | null;

  @Column("tinyint", { name: "active", nullable: true })
  active: number | null;

  @Column("enum", {
    name: "authProvider",
    enum: ["local", "google", "apple", "github"],
    default: () => "'local'",
  })
  authProvider: "local" | "google" | "apple" | "github";

  @OneToMany(() => FocusedPomodoro, (focusedPomodoro) => focusedPomodoro.user)
  focusedPomodoros: FocusedPomodoro[];

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];

  @OneToOne(() => Setting, (setting) => setting.user)
  setting: Setting;

  @OneToMany(() => Subcription, (subcription) => subcription.user2)
  subcriptions: Subcription[];

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @ManyToOne(() => Subcription, (subcription) => subcription.users, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([
    { name: "currentSubcriptionID", referencedColumnName: "subcriptionId" },
  ])
  currentSubcription: Subcription;
}
