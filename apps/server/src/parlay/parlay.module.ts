import { Module } from '@nestjs/common';
import { ParlayService } from './parlay.service';
import { ParlayController } from './parlay.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [ParlayService],
  controllers: [ParlayController],
})
export class ParlayModule {}
