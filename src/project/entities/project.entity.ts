import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: ['planning', 'in_progress', 'completed', 'cancelled'],
  })
  status: 'planning' | 'in_progress' | 'completed' | 'cancelled';

  @Column({ type: 'enum', enum: ['low', 'medium', 'high'] })
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
  managerId: string;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'project_developers',
    joinColumn: { name: 'projectId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'developerId', referencedColumnName: 'id' },
  })
  developers: User[];

  @CreateDateColumn()
  createdAt: Date;
}
