import { Module } from '@nestjs/common';
import { MatchupsService } from './matchups.service';
import { MatchupsController } from './matchups.controller';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { MatchupStatusUpdaterService } from './cron-matchup/matchup-status-updater.service';
import { LinesService } from 'src/lines/lines.service';
import { MatchupCreationService } from './cron-matchup/matchups-creation.service';
import { TeamService } from 'src/team/team.service';
import { SyncMatchupsWithOddsEventIdService } from './cron-matchup/sync-matchups-with-odds-event-id.service';
import { StatsService } from 'src/stats/stats.service';
import { MatchupLivescoreService } from './cron-matchup/matchup-livescore.service';
import { MatchupCreateLinesService } from './cron-matchup/matchup-create-lines.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [MatchupsController],
  providers: [
    MatchupsService,
    MatchupStatusUpdaterService,
    MatchupCreationService,
    SyncMatchupsWithOddsEventIdService,
    MatchupLivescoreService,
    MatchupCreateLinesService,
    LinesService,
    TeamService,
    StatsService,
  ],
})
export class MatchupsModule { }
