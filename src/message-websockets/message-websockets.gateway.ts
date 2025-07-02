import { WebSocketGateway } from '@nestjs/websockets';
import { MessageWebsocketsService } from './message-websockets.service';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: true,
})
export class MessageWebsocketsGateway {
  constructor(
    private readonly messageWebsocketsService: MessageWebsocketsService,
  ) {}

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }
}
