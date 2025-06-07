import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Project } from '../../project/entities/project.entity';
import { Task } from '../../task/entities/task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['admin', 'manager', 'developer'] })
  role: string;

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(() => Project, (project) => project.manager)
  managedProjects: Project[];

  @OneToMany(() => Project, (project) => project.developers)
  projects: Project[];

  @OneToMany(() => Task, (task) => task.assignedTo)
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;
}
