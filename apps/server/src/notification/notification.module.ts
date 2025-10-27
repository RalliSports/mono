import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { WebPushService } from 'src/utils/services/webPush';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationController],
  providers: [NotificationService, WebPushService],
  exports: [NotificationService],
})
export class NotificationModule {}
