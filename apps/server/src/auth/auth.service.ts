import ParaServer, { Environment } from '@getpara/server-sdk';
import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { users } from '@repo/db';
import { PublicKey } from '@solana/web3.js';
import { eq } from 'drizzle-orm';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';
import { User } from 'src/user/dto/user-response.dto';
import { ParaAnchor } from 'src/utils/services/paraAnchor';
import { generateUniqueGamertag } from 'src/utils/generateGamertag';
import { getRandomAthleteAvatar } from 'src/utils/getRandomAthleteAvatar';
import { ReferralService } from 'src/referral/referral.service';
import { chatClient } from 'src/utils/services/messaging';

@Injectable()
export class AuthService {
  private readonly paraServer: ParaServer;
  private anchor: ParaAnchor;

  constructor(
    @Drizzle() private readonly db: Database,
    private readonly referralService: ReferralService,
  ) {
    this.paraServer = new ParaServer(
      Environment.BETA,
      process.env.PARA_API_KEY!,
    );
    this.anchor = new ParaAnchor(this.getPara());
  }

  async validateSession(
    session: string,
    email?: string,
    referralCode?: string,
  ): Promise<User | null> {
    // try {
    await this.paraServer.importSession(session);
    const isActive = await this.paraServer.isSessionActive();

    if (!isActive) {
      console.error('Session expired');

      return null;
    }

    const para = await this.getPara();

    const userEmail = para.getEmail() || para.email;

    const userExisted = await this.db.query.users.findFirst({
      where: eq(users.paraUserId, para.getUserId() ?? ''),
    });

    if (userExisted) {
      if (!userExisted.hasBeenFaucetedSol) {
        try {
          await this.faucetTokens({
            emailAddress: userExisted.emailAddress as string,
            id: userExisted.id,
            paraUserId: userExisted.paraUserId as string,
            walletAddress: userExisted.walletAddress as string,
          });
        } catch (error) {
          console.error(error, 'error faucetTokens');
        }
      }

      const existingRefferer = await this.referralService.getRefferer(
        userExisted.id,
      );
      if (!existingRefferer && referralCode) {
        await this.referralService.processReferral(
          referralCode,
          userExisted.id,
        );
      }

      const existingCode = await this.referralService.getReferralCode(
        userExisted.id,
      );
      if (!existingCode) {
        await this.referralService.generateReferralCode(userExisted.id);
      }

      if (userExisted.emailAddress === null && userEmail) {
        await this.db
          .update(users)
          .set({
            emailAddress: userEmail,
          })
          .where(eq(users.id, userExisted.id));
      }

      // Register/update user with Stream Chat
      await this.registerUserWithStreamChat(userExisted);

      return {
        emailAddress: userExisted.emailAddress as string,
        id: userExisted.id,
        paraUserId: userExisted.paraUserId as string,
        walletAddress: userExisted.walletAddress as string,
        // role: userExisted.role as Role,
      };
    } else {
      const gamertag = await generateUniqueGamertag(this.db, users);

      const newUser = await this.db
        .insert(users)
        .values({
          paraUserId: para.getUserId(),
          emailAddress: userEmail,
          walletAddress: para.availableWallets[0].address,
          username: gamertag,
          avatar: '/images/pfp-1.svg',
          isFirstLogin: true,
        })
        .onConflictDoNothing()
        .returning();

      await this.referralService.generateReferralCode(newUser[0].id);
      if (referralCode) {
        await this.referralService.processReferral(referralCode, newUser[0].id);
      }
      // Register/update user with Stream Chat
      await this.registerUserWithStreamChat(newUser[0]);
    }

    // fetch the newly created user if needed
    const user = await this.db.query.users.findFirst({
      where: eq(users.paraUserId, para.getUserId() ?? ''),
    });

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'User not found',
      });
    }

    // Register/update user with Stream Chat
    await this.registerUserWithStreamChat(user);

    if (!user.hasBeenFaucetedSol) {
      try {
        await this.faucetTokens({
          emailAddress: user.emailAddress as string,
          id: user.id,
          paraUserId: user.paraUserId as string,
          walletAddress: user.walletAddress as string,
        });
      } catch (error) {
        console.error(error, 'error faucetTokens');
      }
    }

    if (referralCode && !userExisted) {
      try {
        await this.referralService.processReferral(referralCode, user.id);
      } catch (error) {
        console.error('Error processing referral:', error);
      }
    }

    return {
      emailAddress: user.emailAddress as string,
      id: user.id,
      paraUserId: user.paraUserId as string,
      walletAddress: user.walletAddress as string,
      // role: user.role as Role,
    };
    // } catch (error) {
    //   console.error('Session validation failed:', error);
    //   return null;
    // }
  }

  getPara(): ParaServer {
    return this.paraServer;
  }

  private async registerUserWithStreamChat(user: any): Promise<void> {
    try {
      // Check if user already exists in Stream Chat
      const existingUser = await chatClient.queryUsers({ id: user.paraUserId });

      if (existingUser.users.length === 0) {
        // User doesn't exist, create them
        await chatClient.upsertUser({
          id: user.paraUserId,
          name: user.username,
          image: user.avatar,
        });
        console.log(`Registered user ${user.username} with Stream Chat`);
      } else {
        // User exists, update their info if needed
        await chatClient.upsertUser({
          id: user.paraUserId,
          name: user.username,
          image: user.avatar,
        });
        console.log(`Updated user ${user.username} in Stream Chat`);
      }
    } catch (error) {
      console.error('Failed to register user with Stream Chat:', error);
      // Don't throw error - Stream Chat registration failure shouldn't break auth
    }
  }

  async faucetTokens(user: User) {
    const userPK = new PublicKey(user.walletAddress);

    // Check if user has SOL balance
    const connection = await this.anchor.getConnection();
    const balance = await connection.getBalance(userPK);

    // If balance is less than 0.01 SOL (10,000,000 lamports), faucet SOL first
    if (balance < 100_000) {
      console.log(
        `User ${user.walletAddress} has low SOL balance (${balance} lamports), fauceting SOL first`,
      );
      await this.anchor.faucetSol(userPK);
    }

    if (!user.hasBeenFaucetedSol) {
      // Then faucet tokens
      this.anchor.faucetTokens(userPK);
      await this.db
        .update(users)
        .set({ hasBeenFaucetedSol: true })
        .where(eq(users.id, user.id));
    }

    return { message: 'Tokens fauceted' };
  }
}
