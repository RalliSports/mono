import { Injectable } from '@nestjs/common';
import { users } from '@repo/db';
import { eq } from 'drizzle-orm';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(@Drizzle() private readonly db: Database) {}

  async findOne(id: string) {
    return await this.db.query.users.findFirst({
      where: eq(users.id, id),
    });
  }

  async updateUser(dto: UpdateUserDto, user: User) {
    const [updatedUser] = await this.db
      .update(users)
      .set({
        firstName: dto.firstName,
        lastName: dto.lastName,
        userName: dto.userName,
        avatar: dto.avatar,
      })
      .where(eq(users.id, user.id))
      .returning();

    return updatedUser;
  }
}
