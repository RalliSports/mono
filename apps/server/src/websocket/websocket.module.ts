import { Global, Module } from '@nestjs/common';
import { WebSocketGatewayService } from './websocket.gateway';

@Global()
@Module({
  providers: [WebSocketGatewayService],
  exports: [WebSocketGatewayService],
})
export class WebsocketModule {}
