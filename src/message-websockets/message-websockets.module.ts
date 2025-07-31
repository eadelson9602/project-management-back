import { Module } from '@nestjs/common';
import { MessageWebsocketsService } from './message-websockets.service';
import { MessageWebsocketsGateway } from './message-websockets.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [MessageWebsocketsGateway, MessageWebsocketsService],
})
export class MessageWebsocketsModule {}
