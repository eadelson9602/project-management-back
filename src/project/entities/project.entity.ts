import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToMany,
  JoinTable,
  Index,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Task } from '../../task/entities/task.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index({ unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: ['planning', 'in_progress', 'completed', 'cancelled'],
  })
  @Index()
  status: 'planning' | 'in_progress' | 'completed' | 'cancelled';

  @Column({ type: 'enum', enum: ['low', 'medium', 'high'] })
  @Index()
  priority: 'low' | 'medium' | 'high';

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  // managerId
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'managerId' })
  manager: User;

  @Column('uuid')
  @Index()
  managerId: string;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'project_developers',
    joinColumn: { name: 'projectId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'developerId', referencedColumnName: 'id' },
  })
  developers: User[];

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;
}
