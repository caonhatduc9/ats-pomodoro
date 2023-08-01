import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Task } from "./Task";

@Index("project_user_userId_idx", ["userId"], {})
@Index("user_id_idx", ["userId"], {})
@Entity("project", { schema: "ats_pomodoro" })
export class Project {
  @PrimaryGeneratedColumn({ type: "int", name: "projectId" })
  projectId: number;

  @Column("int", { name: "userId" })
  userId: number;

  @Column("text", { name: "projectName" })
  projectName: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("date", { name: "createdDate", nullable: true })
  createdDate: string | null;

  @Column("date", { name: "modifiedDate", nullable: true })
  modifiedDate: string | null;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["TODO", "DOING", "DONE", "DELETE"],
    default: () => "'TODO'",
  })
  status: "TODO" | "DOING" | "DONE" | "DELETE" | null;

  @ManyToOne(() => User, (user) => user.projects, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "userId", referencedColumnName: "userId" }])
  user: User;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
}
