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

@Index("task_user_userId_idx", ["userId"], {})
@Index("task_project_projectId_idx", ["projectId"], {})
@Entity("task", { schema: "ats_pomodoro" })
export class Task {
  @PrimaryGeneratedColumn({ type: "int", name: "taskId" })
  taskId: number;

  @Column("int", { name: "projectId" })
  projectId: number;

  @Column("int", { name: "userId" })
  userId: number;

  @Column("varchar", { name: "status", length: 20 })
  status: string;

  @Column("text", { name: "taskName" })
  taskName: string;

  @Column("int", { name: "estimatePomonoro" })
  estimatePomonoro: number;

  @Column("int", {
    name: "actualPormonoro",
    nullable: true,
    default: () => "'0'",
  })
  actualPormonoro: number | null;

  @Column("time", { name: "timeSpent", nullable: true })
  timeSpent: string | null;

  @Column("text", { name: "note", nullable: true })
  note: string | null;

  @Column("date", { name: "createdDate" })
  createdDate: string;

  @Column("date", { name: "modifiedDate", nullable: true })
  modifiedDate: string | null;

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
