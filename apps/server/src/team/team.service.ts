import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Database } from 'src/database/database.provider';
import { Drizzle } from 'src/database/database.decorator';
import { AuthService } from 'src/auth/auth.service';
import { athletes, matchups, teams } from '@repo/db';
import { and, eq, gt, or } from 'drizzle-orm';

@Injectable()
export class TeamService {
  constructor(
    @Drizzle() private readonly db: Database,
    private readonly authService: AuthService,
  ) {}

  async create(createTeamDto: CreateTeamDto) {
    const [createdTeam] = await this.db
      .insert(teams)
      .values({
        ...createTeamDto,
      })
      .returning();

    return createdTeam;
  }

  async findOne(teamId: string) {
    const team = await this.db.query.teams.findFirst({
      where: eq(teams.id, teamId),
      with: { athletes: true, awayMatchups: true, homeMatchups: true },
    });

    if (!team) throw new NotFoundException('Team not found');

    return team;
  }

  async getAthletesForTeam(teamId: string) {
    return await this.db
      .select()
      .from(athletes)
      .where(eq(athletes.teamId, teamId));
  }

  async getOpenMatchupsForTeam(teamId: string) {
    const now = new Date();
    return await this.db
      .select()
      .from(matchups)
      .where(
        and(
          or(eq(matchups.homeTeamId, teamId), eq(matchups.awayTeamId, teamId)),
          gt(matchups.startsAt, now),
        ),
      )
      .orderBy(matchups.startsAt);
  }

  async update(teamId: string, updateTeamDto: UpdateTeamDto) {
    return await this.db
      .update(teams)
      .set({
        ...updateTeamDto,
      })
      .where(eq(teams.id, teamId))
      .returning();
  }

  async remove(teamId: string) {
    return await this.db.delete(teams).where(eq(teams.id, teamId));
  }
}
