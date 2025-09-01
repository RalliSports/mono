import { Injectable } from '@nestjs/common';
import { pushSubscriptions } from '@repo/db';
import { eq } from 'drizzle-orm';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';
import {
  NotificationPayload,
  PushSubscriptionResponse,
} from 'src/notification/dto/webpush.dto';
import { WebPushService } from 'src/utils/services/webPush';

@Injectable()
export class NotificationService {
  constructor(
    @Drizzle() private readonly db: Database,
    private readonly webPush: WebPushService,
  ) {}

  async sendNotificationToUser(userId: string, payload: NotificationPayload) {
    const subscriptions = await this.db.query.pushSubscriptions.findMany({
      where: eq(pushSubscriptions.userId, userId),
    });

    // Send in parallel and wait for all
    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        this.webPush.sendNotification(
          sub.subscription as PushSubscriptionResponse,
          payload,
        ),
      ),
    );

    // Optionally: filter out failed ones (expired endpoints, etc.)
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error('Failed to send notification:', result.reason);
      }
    });

    return results;
  }

  async broadcastMessageToAllUsers(payload: NotificationPayload) {
    // Fetch all active subscriptions
    const subscriptions = await this.db.query.pushSubscriptions.findMany({
      where: eq(pushSubscriptions.isActive, true),
    });

    if (!subscriptions.length) {
      return { success: false, message: 'No active subscriptions' };
    }

    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        this.webPush.sendNotification(
          sub.subscription as PushSubscriptionResponse,
          payload,
        ),
      ),
    );

    // Optional: handle failures (e.g. expired subscriptions)
    const failed: string[] = [];
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error('Failed to send notification:', result.reason);
        failed.push(subscriptions[index].id);
      }
    });

    return {
      success: true,
      total: subscriptions.length,
      failed: failed.length,
    };
  }

  // 🎮 Game Resolved
  buildGameResolvedMessage(gameId: string, title: string): NotificationPayload {
    return {
      title: 'Game Resolved 🎉',
      body: `Your recent game ${title} has been resolved. Check the results now!`,
      image: 'https://example.com/images/game-resolved.png',
      url: `https://example.com/games/${gameId}/results`, // dynamic link to specific game results
      icon: 'https://example.com/icons/game.png',
      tag: `game-resolved-${gameId}`, // unique per game
    };
  }

  // 🕹️ Game Invite
  buildGameInviteMessage(
    inviterName: string,
    gameTitle: string,
    gameId: string,
  ): NotificationPayload {
    return {
      title: `You’ve Been Invited to join ${gameTitle}`,
      body: `${inviterName} has invited you to join a new game. Don’t keep them waiting!`,
      image: 'https://example.com/images/game-invite.png',
      url: `https://example.com/games/${gameId}/invite`,
      icon: 'https://example.com/icons/invite.png',
      tag: `game-invite-${gameId}`,
    };
  }

  // 💬 New Message
  buildNewChatMessage(
    senderName: string,
    conversationId: string,
  ): NotificationPayload {
    return {
      title: 'New Message 💌',
      body: `You’ve got a new message from ${senderName}. Tap to read it now.`,
      image: 'https://example.com/images/new-message.png',
      url: `https://example.com/messages/${conversationId}`,
      icon: 'https://example.com/icons/message.png',
      tag: `new-message-${conversationId}`,
    };
  }
}
