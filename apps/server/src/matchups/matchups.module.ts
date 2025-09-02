import { Module } from '@nestjs/common';
import { MatchupsService } from './matchups.service';
import { MatchupsController } from './matchups.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { MatchupStatusUpdaterService } from './cron-matchup/matchup-status-updater.service';
import { LinesService } from 'src/lines/lines.service';
import { MatchupCreationService } from './cron-matchup/matchups-creation.service';
import { TeamService } from 'src/team/team.service';

@Module({
  imports: [ScheduleModule.forRoot(), DatabaseModule, AuthModule],
  controllers: [MatchupsController],
  providers: [
    MatchupsService,
    MatchupStatusUpdaterService,
    MatchupCreationService,
    LinesService,
    TeamService,
  ],
})
export class MatchupsModule {}
