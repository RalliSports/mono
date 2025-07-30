import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LinesService } from './lines.service';
import { LinesController } from './lines.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [ScheduleModule.forRoot(), DatabaseModule],
  controllers: [LinesController],
  providers: [LinesService],
})
export class LinesModule {}
