import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { AthletesModule } from 'src/athletes/athletes.module';

@Module({
  imports: [DatabaseModule, AuthModule, UserModule, AthletesModule],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
