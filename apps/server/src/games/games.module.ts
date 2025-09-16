import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { GameAccessService } from './game-access.service';
import { GameAccessController } from './game-access.controller';
import { GameModeController } from './game-mode.controller';
import { GameModeService } from './game-mode.service';
import { UserModule } from 'src/user/user.module';
import { ParaAnchor } from 'src/utils/services/paraAnchor';
import { NotificationModule } from 'src/notification/notification.module';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { FriendsModule } from 'src/friends/friends.module';

@Module({
  imports: [DatabaseModule, AuthModule, UserModule, NotificationModule, FriendsModule],
  controllers: [GamesController, GameAccessController, GameModeController, TokenController],
  providers: [GamesService, GameAccessService, GameModeService, ParaAnchor, TokenService],
})
export class GamesModule {}
