import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Project } from '../../project/entities/project.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: ['todo', 'in_progress', 'review', 'done'] })
  @Index()
  status: string;

  @Column({ type: 'enum', enum: ['low', 'medium', 'high'] })
  @Index()
  priority: string;

  @Column('float')
  estimatedHours: number;

  @Column({ type: 'float', nullable: true })
  actualHours: number;

  @Column({ type: 'date' })
  dueDate: Date;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column('uuid')
  @Index()
  projectId: string;

  // Relación con el desarrollador asignado
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'assignedToId' })
  assignedTo: User;

  @CreateDateColumn()
  createdAt: Date;
}
