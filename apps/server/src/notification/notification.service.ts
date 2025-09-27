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

  async sendChatNotificationToUser(
    userId: string,
    payload: NotificationPayload,
  ) {
    // Check if user has chat notifications enabled (you might want to add this to user preferences)
    // For now, we'll send to all their subscriptions
    return this.sendNotificationToUser(userId, payload);
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
      image: 'https://www.ralli.bet/images/game-resolved.png',
      url: `https://www.ralli.bet/games/${gameId}/results`, // dynamic link to specific game results
      icon: 'https://www.ralli.bet/icons/game.png',
      tag: `game-resolved-${gameId}`, // unique per game
    };
  }

  // 🕹️ Game Invite
  buildGameInviteMessage(
    gameTitle: string,
    gameId: string,
    gameCode: string,
  ): NotificationPayload {
    return {
      title: `You’ve Been Invited to join ${gameTitle}`,
      body: `
      You have been invited to join a new game,
      the game code is ${gameCode}
      Don’t keep them waiting!
      `,
      // image: 'https://www.ralli.bet/images/game-invite.png',
      url: `https://www.ralli.bet/game?id=${gameId}`,
      // icon: 'https://www.ralli.bet/icons/invite.png',
      tag: `game-invite-${gameId}`,
    };
  }

  // 💬 New Message
  buildNewChatMessage(
    senderName: string,
    conversationId: string,
    message: string,
  ): NotificationPayload {
    return {
      title: `New Message from ${senderName}`,
      body: message,
      image: 'https://www.ralli.bet/images/new-message.png',
      url: `https://www.ralli.bet/messages/${conversationId}`,
      icon: 'https://www.ralli.bet/icons/message.png',
      tag: `new-message-${conversationId}`,
    };
  }
}
