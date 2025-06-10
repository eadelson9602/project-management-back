import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './users.controller';
import { User } from './entities/user.entity';
import { AuthModule } from '@/auth/auth.module';
import { CommonModule } from '../common/common.module';

@Module({
  controllers: [UserController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([User]), AuthModule, CommonModule],
})
export class UsersModule {}
