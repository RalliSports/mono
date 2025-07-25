import { Module } from '@nestjs/common';
import { ParlayService } from './parlay.service';
import { ParlayController } from './parlay.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { WebsocketModule } from 'src/websocket/websocket.module';

@Module({
  imports: [DatabaseModule, AuthModule, WebsocketModule],
  providers: [ParlayService],
  controllers: [ParlayController],
})
export class ParlayModule {}
