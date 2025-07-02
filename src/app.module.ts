import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { MessageWebsocketsModule } from './message-websockets/message-websockets.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(
      process.env.STAGE === 'dev'
        ? {
            ssl: false,
            extra: undefined,
            type: 'postgres' as const,
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            autoLoadEntities: true,
            synchronize: true,
          }
        : {
            type: 'postgres' as const,
            url: process.env.DATABASE_URL,
            autoLoadEntities: true,
            synchronize: false,
          },
    ),
    UsersModule,
    ProjectModule,
    TaskModule,
    AuthModule,
    FilesModule,
    MessageWebsocketsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
