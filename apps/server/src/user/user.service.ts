import { Injectable } from '@nestjs/common';
import { athletes, pushSubscriptions, users } from '@repo/db';
import { PublicKey } from '@solana/web3.js';
import { eq, sql } from 'drizzle-orm';
import { AuthService } from 'src/auth/auth.service';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';
import { ParaAnchor } from 'src/utils/services/paraAnchor';
import { WebPushService } from 'src/utils/services/webPush';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './dto/user-response.dto';
import { PushSubscriptionResponse } from './dto/webpush.dto';

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
    // Get a random athlete's picture for the avatar
    const randomAthlete = await this.db.query.athletes.findFirst({
      where: sql`${athletes.picture} IS NOT NULL AND ${athletes.picture} != ''`,
      orderBy: sql`RANDOM()`,
    });

    const avatarUrl = randomAthlete?.picture || dto.avatar;

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
  async faucetTokens(user: User) {
    const userPK = new PublicKey(user.walletAddress);

    // Check if user has SOL balance
    const connection = await this.anchor.getConnection();
    const balance = await connection.getBalance(userPK);

    // If balance is less than 0.01 SOL (10,000,000 lamports), faucet SOL first
    if (balance < 100_000 && !user.hasBeenFaucetedSol) {
      console.log(
        `User ${user.walletAddress} has low SOL balance (${balance} lamports), fauceting SOL first`,
      );
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
      })
      .returning();

    return subscribed;
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
      console.log(error, 'error sending web push notification');
    }
  }
}
