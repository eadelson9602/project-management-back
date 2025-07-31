import { Injectable, NotFoundException } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

interface ConnectedClients {
  [id: string]: {
    socket: Socket;
    user: User;
  };
}

@Injectable()
export class MessageWebsocketsService {
  private conectedClients: ConnectedClients = {};

  constructor(
    @InjectRepository(User)
    private readonly userRespository: Repository<User>,
  ) {}

  getConnectedClients(): string[] {
    return Object.keys(this.conectedClients);
  }

  async handleConnection(client: Socket, userId: string) {
    const user = await this.userRespository.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    this.conectedClients[client.id] = {
      socket: client,
      user,
    };
  }

  handleDisconnect(clientId: string) {
    delete this.conectedClients[clientId];
  }

  getUserFullName(clientId: string) {
    return this.conectedClients[clientId].user.name;
  }
}
