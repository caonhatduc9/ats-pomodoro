import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Index("dayFocus_user_userId_idx", ["userId"], {})
@Entity("focusedPomodoro", { schema: "ats_pomodoro" })
export class FocusedPomodoro {
  @PrimaryGeneratedColumn({ type: "int", name: "focusedPomodoroId" })
  focusedPomodoroId: number;

  @Column("int", { name: "userId", nullable: true })
  userId: number | null;

  @Column("float", { name: "timeFocus", nullable: true, precision: 12 })
  timeFocus: number | null;

  @Column("date", { name: "createdDate", nullable: true })
  createdDate: string | null;

  @ManyToOne(() => User, (user) => user.focusedPomodoros, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "userId", referencedColumnName: "userId" }])
  user: User;
}
