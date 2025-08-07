import { Module } from '@nestjs/common';
import { MatchupsService } from './matchups.service';
import { MatchupsController } from './matchups.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [ScheduleModule.forRoot(), DatabaseModule, AuthModule],
  controllers: [MatchupsController],
  providers: [MatchupsService],
})
export class MatchupsModule {}
