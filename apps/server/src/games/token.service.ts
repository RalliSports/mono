import {
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { tokens } from '@repo/db';
import { eq } from 'drizzle-orm';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';
import { CreateTokenDto } from './dto/create-token.dto';

@Injectable()
export class TokenService {
  constructor(@Drizzle() private readonly db: Database) {}

  async create(dto: CreateTokenDto) {
    const [newRecord] = await this.db
      .insert(tokens)
      .values({
        name: dto.name,
        mint: dto.mint,
        cluster: dto.cluster,
        ticker: dto.ticker,
      })
      .returning();
    return newRecord;
  }

  async findAll() {
    return this.db.query.tokens.findMany();
  }

  async remove(id: string) {
    const [deleted] = await this.db
      .delete(tokens)
      .where(eq(tokens.id, id))
      .returning();

    if (!deleted) throw new NotFoundException('token not found');
    return deleted;
  }
}
