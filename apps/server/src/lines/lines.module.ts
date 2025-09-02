import { Module } from '@nestjs/common';
import { LinesService } from './lines.service';
import { LinesController } from './lines.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ DatabaseModule, AuthModule],
  controllers: [LinesController],
  providers: [LinesService],
})
export class LinesModule {}
