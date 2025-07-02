import { Module } from '@nestjs/common';
import { MessageWebsocketsService } from './message-websockets.service';
import { MessageWebsocketsGateway } from './message-websockets.gateway';

@Module({
  providers: [MessageWebsocketsGateway, MessageWebsocketsService],
})
export class MessageWebsocketsModule {}
