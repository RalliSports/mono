import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { GamesModule } from './games/games.module';
import { WebsocketModule } from './websocket/websocket.module';
import { LinesModule } from './lines/lines.module';
import { ReferralModule } from './referral/referral.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    WebsocketModule,
    GamesModule,
    LinesModule,
    ReferralModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
