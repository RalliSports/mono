import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { GameAccessService } from './game-access.service';
import { GameAccessController } from './game-access.controller';
import { GameModeController } from './game-mode.controller';
import { GameModeService } from './game-mode.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [GamesController, GameAccessController, GameModeController],
  providers: [GamesService, GameAccessService, GameModeService],
})
export class GamesModule {}
