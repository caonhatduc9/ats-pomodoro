import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Project } from "./Project";
import { User } from "./User";

@Index("task_project_projectId_idx", ["projectId"], {})
@Index("task_user_userId_idx", ["userId"], {})
@Entity("task", { schema: "ats_pomodoro" })
export class Task {
  @PrimaryGeneratedColumn({ type: "int", name: "taskId" })
  taskId: number;

  @Column("int", { name: "projectId", nullable: true })
  projectId: number | null;

  @Column("int", { name: "userId" })
  userId: number;

  @Column("text", { name: "taskName" })
  taskName: string;

  @Column("text", { name: "note", nullable: true })
  note: string | null;

  @Column("date", { name: "createdDate", nullable: true })
  createdDate: string | null;

  @Column("date", { name: "modifiedDate", nullable: true })
  modifiedDate: string | null;

  @Column("float", { name: "estimatePomodoro", precision: 12 })
  estimatePomodoro: number;

  @Column("float", {
    name: "actualPomodoro",
    nullable: true,
    precision: 12,
    default: () => "'0'",
  })
  actualPomodoro: number | null;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["TODO", "DOING", "DONE", "DELETE"],
    default: () => "'TODO'",
  })
  status: "TODO" | "DOING" | "DONE" | "DELETE" | null;

  @Column("float", { name: "timeSpent", nullable: true, precision: 12 })
  timeSpent: number | null;

  @ManyToOne(() => Project, (project) => project.tasks, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "projectId", referencedColumnName: "projectId" }])
  project: Project;

  @ManyToOne(() => User, (user) => user.tasks, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "userId", referencedColumnName: "userId" }])
  user: User;
}
