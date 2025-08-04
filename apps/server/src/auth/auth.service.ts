import ParaServer, { Environment } from '@getpara/server-sdk';
import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { users } from '@repo/db';
import { eq } from 'drizzle-orm';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';
import { Role, User } from 'src/user/dto/user-respons.dto';

@Injectable()
export class AuthService {
  private readonly paraServer: ParaServer;

  constructor(@Drizzle() private readonly db: Database) {
    this.paraServer = new ParaServer(
      Environment.BETA,
      process.env.PARA_API_KEY,
    );
  }

  async validateSession(session: string): Promise<User | null> {
    try {
      await this.paraServer.importSession(session);
      const isActive = await this.paraServer.isSessionActive();

      console.log('started');
      if (!isActive) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNAUTHORIZED,
          message: 'Session expired',
        });
      }

      const para = await this.getPara();

      const userExisted = await this.db.query.users.findFirst({
        where: eq(users.paraUserId, para.getUserId() ?? ''),
      });

      if (userExisted) {
        return {
          emailAddress: userExisted.emailAddress as string,
          id: userExisted.id,
          paraUserId: userExisted.paraUserId as string,
          walletAddress: userExisted.walletAddress as string,
          // role: userExisted.role as Role,
        };
      } else {
        await this.db
          .insert(users)
          .values({
            paraUserId: para.getUserId(),
            emailAddress: para.email,
            walletAddress: para.availableWallets[0].address,
          })
          .onConflictDoNothing();
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

      return {
        emailAddress: user.emailAddress as string,
        id: user.id,
        paraUserId: user.paraUserId as string,
        walletAddress: user.walletAddress as string,
        // role: user.role as Role,
      };
    } catch (error) {
      console.error('Session validation failed:', error);
      return null;
    }
  }

  getPara(): ParaServer {
    return this.paraServer;
  }
}
