import { Module } from '@nestjs/common';
import { LinesService } from './lines.service';
import { LinesController } from './lines.controller';

@Module({
  controllers: [LinesController],
  providers: [LinesService],
})
export class LinesModule {}
