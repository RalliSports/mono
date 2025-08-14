import { Body, Injectable, Post, UseGuards } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { users, athletes } from '@repo/db';
import { eq, sql } from 'drizzle-orm';
import { AuthService } from 'src/auth/auth.service';
import { SessionAuthGuard } from 'src/auth/auth.session.guard';
import { UserPayload } from 'src/auth/auth.user.decorator';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './dto/user-response.dto';
import { PublicKey } from '@solana/web3.js';
import { CreateGameDto } from 'src/games/dto/create-game.dto';
import { ParaAnchor } from 'src/utils/services/paraAnchor';

@Injectable()
export class UserService {
  private anchor: ParaAnchor;

  constructor(
    @Drizzle() private readonly db: Database,
    private readonly authService: AuthService,
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
    return { message: 'Tokens fauceted' };
  }
}
