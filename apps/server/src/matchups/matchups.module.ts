import { Module } from '@nestjs/common';
import { MatchupsService } from './matchups.service';
import { MatchupsController } from './matchups.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { MatchupStatusUpdaterService } from './cron-matchup/matchup-status-updater.service';
import { LinesService } from 'src/lines/lines.service';

@Module({
  imports: [ScheduleModule.forRoot(), DatabaseModule, AuthModule],
  controllers: [MatchupsController],
  providers: [MatchupsService, MatchupStatusUpdaterService, LinesService],
})
export class MatchupsModule {}
