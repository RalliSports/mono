import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { WebPushService } from 'src/utils/services/webPush';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [UserService, WebPushService],
})
export class UserModule {}
