import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Project } from '../../project/entities/project.entity';
import { Task } from '../../task/entities/task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true, generated: 'uuid' })
  uid: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: ['admin', 'manager', 'developer'] })
  role: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true, type: 'timestamp' })
  deletedAt: Date;

  @OneToMany(() => Project, (project) => project.manager)
  managedProjects: Project[];

  @OneToMany(() => Project, (project) => project.developers)
  projects: Project[];

  @OneToMany(() => Task, (task) => task.assignedTo)
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @BeforeInsert()
  checkFieldstoInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsToUpdate() {
    this.email = this.email.toLowerCase().trim();
  }
}
