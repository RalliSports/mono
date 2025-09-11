import { Injectable } from '@nestjs/common';
import { referralCodes, referrals } from '@repo/db';
import { eq, and } from 'drizzle-orm';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';

@Injectable()
export class ReferralService {
  constructor(@Drizzle() private readonly db: Database) {}

  /**
   * Generate a unique referral code for a user
   */
  async generateReferralCode(userId: string): Promise<string> {
    // Check if user already has a referral code
    const existingCode = await this.db.query.referralCodes.findFirst({
      where: eq(referralCodes.userId, userId),
    });

    if (existingCode) {
      return existingCode.code;
    }

    // Generate a new unique code
    let code: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      code = this.generateRandomCode();
      const existing = await this.db.query.referralCodes.findFirst({
        where: eq(referralCodes.code, code),
      });

      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new Error('Failed to generate unique referral code');
    }

    // Insert the new referral code
    await this.db.insert(referralCodes).values({
      userId,
      code: code!,
    });

    return code!;
  }

  /**
   * Get referral code for a user
   */
  async getReferralCode(userId: string): Promise<string | null> {
    const referralCode = await this.db.query.referralCodes.findFirst({
      where: eq(referralCodes.userId, userId),
    });

    return referralCode?.code || null;
  }

  /**
   * Process a referral when a new user signs up
   */
  async processReferral(
    referralCode: string,
    newUserId: string,
  ): Promise<boolean> {
    try {
      // Find the referrer by code
      const referrerCode = await this.db.query.referralCodes.findFirst({
        where: eq(referralCodes.code, referralCode),
      });

      if (!referrerCode) {
        console.log(`Invalid referral code: ${referralCode}`);
        return false;
      }

      // Check if this user was already referred (prevent duplicate referrals)
      const existingReferral = await this.db.query.referrals.findFirst({
        where: and(
          eq(referrals.referrerCode, referralCode),
          eq(referrals.refereeId, newUserId),
        ),
      });

      if (existingReferral) {
        console.log(`User ${newUserId} already referred by ${referralCode}`);
        return false;
      }

      // Create the referral record
      await this.db.insert(referrals).values({
        referrerCode: referrerCode.code,
        refereeId: newUserId,
        status: 'pending',
      });

      console.log(
        `Successfully processed referral: ${referralCode} -> ${newUserId}`,
      );
      return true;
    } catch (error) {
      console.error('Error processing referral:', error);
      return false;
    }
  }

  /**
   * Get referral statistics for a user
   */
  async getReferralStats(userId: string) {
    const referralCode = await this.getReferralCode(userId);
    if (!referralCode) {
      return { totalReferrals: 0, completedReferrals: 0, pendingReferrals: 0 };
    }

    const allReferrals = await this.db.query.referrals.findMany({
      where: eq(referrals.referrerCode, referralCode),
    });

    const completedReferrals = allReferrals.filter(
      (r) => r.status === 'completed',
    ).length;
    const pendingReferrals = allReferrals.filter(
      (r) => r.status === 'pending',
    ).length;

    return {
      totalReferrals: allReferrals.length,
      completedReferrals,
      pendingReferrals,
      referralCode,
    };
  }

  /**
   * Generate a random 6-character referral code
   */
  private generateRandomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Validate a referral code format
   */
  isValidReferralCode(code: string): boolean {
    return /^[A-Z0-9]{6}$/.test(code);
  }

  /**
   * Find all users referred by a specific user
   */
  async findAllReferredUsers(userId: string) {
    const referralCode = await this.getReferralCode(userId);
    if (!referralCode) {
      return [];
    }

    const referredUsers = await this.db.query.referrals.findMany({
      where: eq(referrals.referrerCode, referralCode),
      with: {
        referee: {
          columns: {
            id: true,
            username: true,
            emailAddress: true,
            createdAt: true,
          },
        },
      },
    });

    return referredUsers.map((referral) => ({
      id: referral.referee?.id,
      username: referral.referee?.username,
      emailAddress: referral.referee?.emailAddress,
      status: referral.status,
      referredAt: referral.createdAt,
    }));
  }

  /**
   * Fetch user's referral code (alias for getReferralCode)
   */
  async fetchUserReferralCode(userId: string): Promise<string | null> {
    return this.getReferralCode(userId);
  }

  /**
   * Apply a referral code to a user (process referral)
   */
  async applyReferralCode(
    referralCode: string,
    userId: string,
  ): Promise<boolean> {
    return this.processReferral(referralCode, userId);
  }

  async getRefferer(userId: string) {
    return this.db.query.referrals.findFirst({
      where: eq(referrals.refereeId, userId),
    });
  }
}
