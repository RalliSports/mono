import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { GamesModule } from './games/games.module';
import { WebsocketModule } from './websocket/websocket.module';
import { LinesModule } from './lines/lines.module';
import { MatchupsModule } from './matchups/matchups.module';
import { ReferralModule } from './referral/referral.module';
import { UserModule } from './user/user.module';
import { AthletesModule } from './athletes/athletes.module';
import { StatsModule } from './stats/stats.module';
import { TeamModule } from './team/team.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    WebsocketModule,
    GamesModule,
    LinesModule,
    MatchupsModule,
    ReferralModule,
    UserModule,
    AthletesModule,
    StatsModule,
    TeamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
