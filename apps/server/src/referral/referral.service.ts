import { Injectable, NotFoundException } from '@nestjs/common';
import { referralCodes, referrals } from '@repo/db';
import { eq } from 'drizzle-orm';
import { AuthService } from 'src/auth/auth.service';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';
import { generateRandonCode } from 'src/utils/generateRandonCode';
import { ReferralStatus } from './enum/referral';
import { User } from 'src/user/dto/user-respons.dto';

@Injectable()
export class ReferralService {
  constructor(
    @Drizzle() private readonly db: Database,
    private readonly authService: AuthService,
  ) {}

  async generateReferralCode(user: User) {
    const newCode = await this.generateUniqueReferralCode();
    const existing = await this.db.query.referralCodes.findFirst({
      where: eq(referralCodes.userId, user.id),
    });

    if (existing) return existing;

    const [code] = await this.db
      .insert(referralCodes)
      .values({
        userId: user.id,
        code: newCode,
      })
      .returning();

    return code;
  }

  async findAllReferredUsers(user: User) {

    const referredUsers = await this.db.query.referrals.findMany({
      where: eq(referralCodes.userId, user.id),
    });

    return referredUsers;
  }

  async fetchUserReferralCode(user: User) {
    const referralCode = await this.db.query.referralCodes.findFirst({
      where: eq(referralCodes.userId, user.id),
    });

    if (!referralCode) {
      throw new NotFoundException('User has no referral code.');
    }

    return referralCode;
  }

  async applyReferralCode(code: string, user: User) {
   
    // Check if code exists
    const codeEntry = await this.db.query.referralCodes.findFirst({
      where: eq(referralCodes.code, code),
    });

    if (!codeEntry) throw new Error('Referral code not found');

    // Prevent self-referral
    if (codeEntry.userId === user.id)
      throw new Error('Cannot use your own code');

    // Check if already applied
    const existingReferral = await this.db.query.referrals.findFirst({
      where: eq(referrals.refereeId, user.id),
    });

    if (existingReferral) throw new Error('Referral already used');

    const [referral] = await this.db
      .insert(referrals)
      .values({
        referrerCode: code,
        refereeId: user.id,
        status: ReferralStatus.PENDING,
      })
      .returning();

    return referral;
  }

  async generateUniqueReferralCode(): Promise<string> {
    let attempt = 0;
    let code: string;

    do {
      code = generateRandonCode(8); // Generate random 8-character code
      const existing = await this.db.query.referralCodes.findFirst({
        where: eq(referralCodes, code),
      }); // Check DB for conflicts

      if (!existing) break; // If code not found in DB, use it

      attempt++; // If found, try again
    } while (attempt < 10); // Try max 10 times

    if (attempt === 10) {
      throw new Error('Failed to generate unique game code'); // Safety fallback
    }

    return code; // Return the unique code
  }
}
