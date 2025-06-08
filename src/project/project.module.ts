import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { User } from '../users/entities/user.entity';
import { AuthModule } from '@/auth/auth.module';
import { CommonModule } from '@/common/common.module';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
  imports: [
    TypeOrmModule.forFeature([Project, User]),
    AuthModule,
    CommonModule,
  ],
})
export class ProjectModule {}
