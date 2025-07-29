import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000', 
      'http://localhost:3001',
      'https://betmavrik-frontend.up.railway.app',
      'https://betmavrik-backend.up.railway.app'
    ],
    credentials: true,
  },
})
export class CasinoWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients: Map<string, Socket> = new Map();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, client);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, payload: { userId: string }) {
    client.join(`user_${payload.userId}`);
    console.log(`User ${payload.userId} joined their room`);
  }

  @SubscribeMessage('leave')
  handleLeave(client: Socket, payload: { userId: string }) {
    client.leave(`user_${payload.userId}`);
    console.log(`User ${payload.userId} left their room`);
  }

  notifyBalanceChange(userId: string, balance: number) {
    this.server.to(`user_${userId}`).emit('balanceUpdate', {
      userId,
      balance,
      timestamp: new Date().toISOString(),
    });
  }

  notifyAllClients(event: string, data: any) {
    this.server.emit(event, data);
  }
} 