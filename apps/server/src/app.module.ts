import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { WebsocketModule } from './websocket/websocket.module';
import { GamesModule } from './games/games.module';
import { LinesModule } from './lines/lines.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    WebsocketModule,
    GamesModule,
    LinesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
