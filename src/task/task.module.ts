import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Project } from '../project/entities/project.entity';
import { User } from '../users/entities/user.entity';
import { AuthModule } from '@/auth/auth.module';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [TypeOrmModule.forFeature([Task, Project, User]), AuthModule],
})
export class TaskModule {}
