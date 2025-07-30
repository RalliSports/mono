import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LinesService } from './lines.service';
import { LinesController } from './lines.controller';

@Module({
  controllers: [LinesController],
  providers: [LinesService],
  imports: [ScheduleModule.forRoot()],
})
export class LinesModule {}
