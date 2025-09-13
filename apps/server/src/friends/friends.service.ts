import { Injectable, NotFoundException } from '@nestjs/common';
import { friends, users } from '@repo/db';
import { and, eq } from 'drizzle-orm';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';

@Injectable()
export class FriendsService {
  constructor(
    @Drizzle() private readonly db: Database,
    // private readonly authService: AuthService,
  ) {}

  async toggleFollow(userId: string, followingId: string) {
    if (userId === followingId) {
      throw new NotFoundException('You cannot follow yourself');
    }

    console.log(followingId, "id user to follow")

    // Check if user exists
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, followingId),
    });
    if (!user) throw new NotFoundException('User not found');

    // Check if already following
    const existing = await this.db.query.friends.findFirst({
      where: and(
        eq(friends.followerId, userId),
        eq(friends.followingId, followingId),
      ),
    });

    if (existing) {
      // Unfollow
      await this.db
        .delete(friends)
        .where(
          and(
            eq(friends.followerId, userId),
            eq(friends.followingId, followingId),
          ),
        );
      return { message: 'Unfollowed successfully' };
    }

    // Follow
    await this.db.insert(friends).values({
      followerId: userId,
      followingId: followingId,
    });

    return { message: 'Followed successfully' };
  }

  async getFollowers(userId: string) {
    return this.db.query.friends.findMany({
      where: eq(friends.followingId, userId),
      with: { follower: true },
    });
  }

  async getFollowing(userId: string) {
    return this.db.query.friends.findMany({
      where: eq(friends.followerId, userId),
      with: { following: true },
    });
  }

    async isCreatorFollowing(
      currentUserId: string,
      userId: string,
    ): Promise<boolean> {
      if (currentUserId === userId) {
        // You always "follow" yourself
        return true;
      }
  
      const follow = await this.db.query.friends.findFirst({
        where: and(
          eq(friends.followerId, userId),
          eq(friends.followingId, currentUserId),
        ),
      });
  
      return !!follow;
    }
  
}
