import { Injectable } from '@nestjs/common';
import { athletes, pushSubscriptions, users } from '@repo/db';
import { PublicKey } from '@solana/web3.js';
import { eq, sql } from 'drizzle-orm';
import { AuthService } from 'src/auth/auth.service';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';
import { ParaAnchor } from 'src/utils/services/paraAnchor';
import { WebPushService } from 'src/utils/services/webPush';
import { UpdateUserDto, UpdateUserEmailDto } from './dto/update-user.dto';
import { User } from './dto/user-response.dto';
import { PushSubscriptionResponse } from '../notification/dto/webpush.dto';
import { SendNotificationDto } from './dto/send-notification.dto';

@Injectable()
export class UserService {
  private anchor: ParaAnchor;

  constructor(
    @Drizzle() private readonly db: Database,
    private readonly authService: AuthService,
    private readonly webPush: WebPushService,
  ) {
    this.anchor = new ParaAnchor(this.authService.getPara());
  }

  async findOne(id: string) {
    return await this.db.query.users.findFirst({
      where: eq(users.id, id),
    });
  }

  async updateUser(dto: UpdateUserDto, user: User) {
    // Use the provided avatar URL if available, otherwise keep existing logic for random athlete
    let avatarUrl = dto.avatar;

    if (!avatarUrl && (user.avatar === '' || user.avatar === null)) {
      // Get a random athlete's picture for the avatar (fallback)
      const randomAthlete = await this.db.query.athletes.findFirst({
        where: sql`${athletes.picture} IS NOT NULL AND ${athletes.picture} != ''`,
        orderBy: sql`RANDOM()`,
      });
      avatarUrl = randomAthlete?.picture ?? '';
    }

    const [updatedUser] = await this.db
      .update(users)
      .set({
        firstName: dto.firstName,
        lastName: dto.lastName,
        username: dto.username,
        avatar: avatarUrl,
      })
      .where(eq(users.id, user.id))
      .returning();

    return updatedUser;
  }

  async updateUserEmail(dto: UpdateUserEmailDto, user: User) {
    // Use the provided avatar URL if available, otherwise keep existing logic for random athlete
    let email = dto.email;

    const [updatedUser] = await this.db
      .update(users)
      .set({
        emailAddress: email,
      })
      .where(eq(users.id, user.id))
      .returning();

    return updatedUser;
  }

  async faucetTokens(user: User) {
    const userPK = new PublicKey(user.walletAddress);

    // Check if user has SOL balance
    const connection = await this.anchor.getConnection();
    const balance = await connection.getBalance(userPK);

    // If balance is less than 0.01 SOL (10,000,000 lamports), faucet SOL first
    if (balance < 100_000 && !user.hasBeenFaucetedSol) {
      await this.anchor.faucetSol(userPK);
      await this.db
        .update(users)
        .set({ hasBeenFaucetedSol: true })
        .where(eq(users.id, user.id));
    }

    // Then faucet tokens
    this.anchor.faucetTokens(userPK);
    return;
  }

  async subscribeToWebPushNotification(
    subscription: PushSubscriptionResponse,
    user: User,
  ) {
    // Check if the subscription already exists for this user
    const existing = await this.db.query.pushSubscriptions.findFirst({
      where: sql`${pushSubscriptions.userId} = ${user.id} AND ${pushSubscriptions.subscription} = ${JSON.stringify(subscription)}`,
    });

    if (existing) {
      return {
        message: 'Browser already subscribed',
        sub: existing,
      };
    }

    const [subscribed] = await this.db
      .insert(pushSubscriptions)
      .values({
        subscription,
        userId: user.id,
        isActive: true,
      })
      .returning();

    return subscribed;
  }

  async unsubscribeFromWebPushNotification(dto: PushSubscriptionResponse) {
    // Find subscription by comparing the keys in the JSONB subscription field
    const subscription = await this.db.query.pushSubscriptions.findFirst({
      where: sql`${pushSubscriptions.subscription}->>'endpoint' = ${dto.endpoint} AND ${pushSubscriptions.subscription}->'keys'->>'p256dh' = ${dto.keys.p256dh} AND ${pushSubscriptions.subscription}->'keys'->>'auth' = ${dto.keys.auth}`,
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    await this.db
      .delete(pushSubscriptions)
      .where(
        sql`${pushSubscriptions.subscription}->>'endpoint' = ${dto.endpoint} AND ${pushSubscriptions.subscription}->'keys'->>'p256dh' = ${dto.keys.p256dh} AND ${pushSubscriptions.subscription}->'keys'->>'auth' = ${dto.keys.auth}`,
      );
  }

  async testWebpushNotification(subscription: PushSubscriptionResponse) {
    const payload = {
      title: 'Hello from Ralli 👋',
      body: 'This is a test notification!',
      image: 'image.png',
      // icon: "icon.png",
      // tag: "random unique number",
      // url: "url"
    };

    try {
      await this.webPush.sendNotification(subscription, payload);
    } catch (error) {
      console.error(error, 'error sending web push notification');
    }
  }

  async getAllSubscriptions() {
    const subscriptions = await this.db.query.pushSubscriptions.findMany();
    return subscriptions;

    // Get user data for each subscription
    // const subscriptionsWithUsers = await Promise.all(
    //   subscriptions.map(async (sub) => {
    //     const user = await this.db.query.users.findFirst({
    //       where: eq(users.id, sub.userId),
    //     });

    //     return {
    //       id: sub.id,
    //       userId: sub.userId,
    //       subscription: sub.subscription,
    //       isActive: sub.isActive,
    //       createdAt: sub.createdAt,
    //       user: user
    //         ? {
    //             username: user.username,
    //             emailAddress: user.emailAddress,
    //           }
    //         : undefined,
    //     };
    //   }),
    // );

    // return subscriptionsWithUsers;
  }

  async sendNotificationToUser(dto: SendNotificationDto) {
    if (!dto.subscriptionId) {
      throw new Error('Subscription ID is required');
    }

    const subscription = await this.db.query.pushSubscriptions.findFirst({
      where: eq(pushSubscriptions.id, dto.subscriptionId),
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const payload = {
      title: dto.title,
      body: dto.body,
      url: dto.url || 'https://www.ralli.bet',
    };

    try {
      await this.webPush.sendNotification(
        subscription.subscription as PushSubscriptionResponse,
        payload,
      );
      return { success: true, message: 'Notification sent successfully' };
    } catch (error) {
      console.error('Error sending notification:', error);
      throw new Error('Failed to send notification');
    }
  }

  async sendNotificationToAll(dto: SendNotificationDto) {
    const subscriptions = await this.db.query.pushSubscriptions.findMany({
      where: eq(pushSubscriptions.isActive, true),
    });

    const payload = {
      title: dto.title,
      body: dto.body,
      url: dto.url || 'https://www.ralli.bet',
    };

    const results: Array<{
      subscriptionId: string;
      success: boolean;
      error?: string;
    }> = [];
    let successCount = 0;
    let failureCount = 0;

    for (const subscription of subscriptions) {
      try {
        await this.webPush.sendNotification(
          subscription.subscription as PushSubscriptionResponse,
          payload,
        );
        successCount++;
        results.push({ subscriptionId: subscription.id, success: true });
      } catch (error) {
        failureCount++;
        results.push({
          subscriptionId: subscription.id,
          success: false,
          error: (error as Error).message,
        });
        console.error(
          `Failed to send notification to subscription ${subscription.id}:`,
          error,
        );
      }
    }

    return {
      success: true,
      message: `Sent ${successCount} notifications successfully, ${failureCount} failed`,
      results,
    };
  }
}
