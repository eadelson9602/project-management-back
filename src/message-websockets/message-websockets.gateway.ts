import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessageWebsocketsService } from './message-websockets.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/types/jwt.types';
@WebSocketGateway({
  cors: true,
})
export class MessageWebsocketsGateway {
  @WebSocketServer()
  ws_server: Server;

  constructor(
    private readonly messageWebsocketsService: MessageWebsocketsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization?.split(
      ' ',
    )[1] as string;
    if (!token) {
      client.disconnect();
      return;
    }
    try {
      const payload: JwtPayload = this.jwtService.verify(token);

      if (payload) {
        await this.messageWebsocketsService.handleConnection(
          client,
          payload.id,
        );

        this.ws_server.emit(
          'clients-updated',
          this.messageWebsocketsService.getConnectedClients(),
        );
      }
    } catch (error: unknown) {
      console.log('error', error);
      client.disconnect();
      return;
    }
  }

  handleDisconnect(client: Socket) {
    this.messageWebsocketsService.handleDisconnect(client.id);
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    // enviar el mensaje al cliente que lo envio
    // client.emit('message-from-server', {
    //   fullName: 'Soy Yo!',
    //   message: payload.message,
    //   id: client.id,
    // });

    // enviar el mensaje a todos los clientes excepto al que lo envio
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy Yo!',
    //   message: payload.message,
    //   id: client.id,
    // });

    // enviar mensaje a todos los clientes
    this.ws_server.emit('message-from-server', {
      fullName: this.messageWebsocketsService.getUserFullName(client.id),
      message: payload.message,
      id: client.id,
    });
  }
}
