import { Body, Injectable, Post, UseGuards } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { users } from '@repo/db';
import { eq } from 'drizzle-orm';
import { AuthService } from 'src/auth/auth.service';
import { SessionAuthGuard } from 'src/auth/auth.session.guard';
import { UserPayload } from 'src/auth/auth.user.decorator';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';
import { CreateGameDto } from 'src/games/dto/create-game.dto';
import { ParaAnchor } from 'src/utils/services/paraAnchor';
import { User } from './dto/user-response.dto';
import { PublicKey } from '@solana/web3.js';

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

    // Then faucet tokens
    return this.anchor.faucetTokens(userPK);
  }
}
