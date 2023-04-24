import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Task } from "./task.entity";

@Index("user_id_idx", ["userId"], {})
@Index("project_user_userId_idx", ["userId"], {})
@Entity("project", { schema: "ats_pomodoro" })
export class Project {
  @PrimaryGeneratedColumn({ type: "int", name: "projectId" })
  projectId: number;

  @Column("int", { name: "userId" })
  userId: number;

  @Column("text", { name: "projectName" })
  projectName: string;

  @Column("text", { name: "description" })
  description: string;

  @Column("date", { name: "createdDate" })
  createdDate: string;

  @Column("date", { name: "modifiedDate", nullable: true })
  modifiedDate: string | null;

  @ManyToOne(() => User, (user) => user.projects, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "userId", referencedColumnName: "userId" }])
  user: User;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
}
