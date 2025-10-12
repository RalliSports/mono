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
    const payload = {
      title: 'Game Resolved 🎉',
      body: `Your recent game ${title} has been resolved. Check the results now!`,
      image: 'https://www.ralli.bet/images/game-resolved.png',
      url: `https://www.ralli.bet/game?id=${gameId}`, // Links to game page where results are shown
      urlPath: `/game?id=${gameId}`,
      icon: 'https://www.ralli.bet/icons/game.png',
      tag: `game-resolved-${gameId}`, // unique per game
      actions: [
        { action: 'open', title: 'View Results' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
      requireInteraction: true,
    };
    console.log(
      'Building game resolved notification with urlPath:',
      payload.urlPath,
    );
    return payload;
  }

  // 🕹️ Game Invite
  buildGameInviteMessage(
    gameTitle: string,
    gameId: string,
    gameCode: string,
  ): NotificationPayload {
    const payload = {
      title: `You've Been Invited to join ${gameTitle}`,
      body: `
      You have been invited to join a new game,
      the game code is ${gameCode}
      Don't keep them waiting!
      `,
      // image: 'https://www.ralli.bet/images/game-invite.png',
      url: `https://www.ralli.bet/game?id=${gameId}`,
      urlPath: `/game?id=${gameId}`,
      // icon: 'https://www.ralli.bet/icons/invite.png',
      tag: `game-invite-${gameId}`,
      actions: [
        { action: 'open', title: 'Join Game' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
      requireInteraction: true,
    };
    console.log(
      'Building game invite notification with urlPath:',
      payload.urlPath,
    );
    return payload;
  }

  // 💬 New Message
  buildNewChatMessage(
    senderName: string,
    conversationId: string,
    message: string,
    isGroupChat: boolean = true,
    gameId?: string,
  ): NotificationPayload {
    // Determine the appropriate URL based on chat type
    let url: string;
    let urlPath: string;

    if (isGroupChat && gameId) {
      // Group message in a game - link to game page with chat tab active
      url = `https://www.ralli.bet/game?id=${gameId}&tab=chats`;
      urlPath = `/game?id=${gameId}&tab=chats`;
    } else {
      // Direct message - link to profile with chats tab active
      url = `https://www.ralli.bet/profile?tab=chats&channel=${conversationId}`;
      urlPath = `/profile?tab=chats&channel=${conversationId}`;
    }

    return {
      title: `New Message from ${senderName}`,
      body: message,
      image: 'https://www.ralli.bet/images/new-message.png',
      url,
      urlPath,
      icon: 'https://www.ralli.bet/icons/message.png',
      tag: `new-message-${conversationId}`,
      actions: [
        { action: 'open', title: 'View Message' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
      requireInteraction: true,
    };
  }
}
