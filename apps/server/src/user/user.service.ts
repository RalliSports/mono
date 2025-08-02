import { Injectable } from '@nestjs/common';
import { users } from '@repo/db';
import { eq } from 'drizzle-orm';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';

@Injectable()
export class UserService {
  constructor(
    @Drizzle() private readonly db: Database,
  ) {}


async  findOne(id: string) {
    return await this.db.query.users.findFirst({
      where: eq(users.id, id),
    })
  }
}
