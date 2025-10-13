import {
  Body,
  Controller,
  Post,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { StreamWebhookPayload } from './dto/stream-webhook.dto';
import { users } from '@repo/db';
import { eq } from 'drizzle-orm';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';
import * as crypto from 'crypto';
import { chatClient } from 'src/utils/services/messaging';

@Controller('webhooks')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    @Drizzle() private readonly db: Database,
  ) {}

  @Post('stream-chat')
  @HttpCode(HttpStatus.OK)
  async handleStreamWebhook(
    @Body() payload: StreamWebhookPayload,
    @Headers() headers: Record<string, string>,
  ) {
    // Validate webhook signature (optional but recommended)
    const signature = headers['x-webhook-signature'];
    if (signature && !this.validateWebhookSignature(payload, signature)) {
      throw new Error('Invalid webhook signature');
    }

    // Only handle message.new events for now
    if (payload.type !== 'message.new') {
      return { status: 'ignored', reason: 'Event type not handled' };
    }

    // Don't notify the sender
    const senderId = payload.message.user.id;

    // Get all members except the sender
    const recipientMembers = payload.members.filter(
      (member) => member.user_id !== senderId && !member.notifications_muted,
    );

    if (recipientMembers.length === 0) {
      return { status: 'ignored', reason: 'No recipients to notify' };
    }

    // Get sender info from our database
    const sender = await this.db.query.users.findFirst({
      where: eq(users.id, senderId),
    });

    if (!sender) {
      console.warn(`Sender not found in database: ${senderId}`);
      return { status: 'ignored', reason: 'Sender not found' };
    }

    // Create notification payload
    // Determine if this is a game chat by checking channel_id pattern
    const isGameChat = payload.channel_id.startsWith('game-');
    const gameId = isGameChat
      ? payload.channel_id.replace('game-', '')
      : undefined;

    const notificationPayload = this.notificationService.buildNewChatMessage(
      sender.username || 'Someone',
      payload.channel_id,
      payload.message.text,
      isGameChat,
      gameId,
    );

    // Send notifications to all recipients
    const results = await Promise.allSettled(
      recipientMembers.map(async (member) => {
        // Find user in our database by paraUserId
        const user = await this.db.query.users.findFirst({
          where: eq(users.id, member.user_id),
        });

        if (user) {
          return this.notificationService.sendChatNotificationToUser(
            user.id,
            notificationPayload,
          );
        }
        return null;
      }),
    );

    const successCount = results.filter((r) => r.status === 'fulfilled').length;
    const failureCount = results.filter((r) => r.status === 'rejected').length;

    return {
      status: 'processed',
      recipients: recipientMembers.length,
      success: successCount,
      failures: failureCount,
    };
  }

  private validateWebhookSignature(payload: any, signature: string): boolean {
    // Stream Chat webhook signature validation
    // You'll need to get your webhook secret from Stream dashboard
    const valid = chatClient.verifyWebhook(payload, signature);
    return valid;
  }
}
