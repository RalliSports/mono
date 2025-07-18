import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway(0, { cors: { origin: '*' }, path: '/socket.io' })
export class WebSocketGatewayService
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('WebSocketGateway');

  @WebSocketServer() io: Server;

  private clients: Map<string, Socket> = new Map();

  async onModuleInit(): Promise<void> {
    this.logger.log('Websocket initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.clients.set(client.id, client);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.clients.delete(client.id);
  }

  @SubscribeMessage('ping')
  handlePing(client: Socket, payload: any) {
    client.emit('pong', { text: "it's working!!!!!" });
  }

  sendToClient(clientId: string, event: string, data: any) {
    const client = this.clients.get(clientId);
    if (client) {
      client.emit(event, data);
    }
  }

  broadcast(event: string, data: any) {
    this.io.emit(event, data);
  }
}
