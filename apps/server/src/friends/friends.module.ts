import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [DatabaseModule, AuthModule, UserModule, NotificationModule],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
