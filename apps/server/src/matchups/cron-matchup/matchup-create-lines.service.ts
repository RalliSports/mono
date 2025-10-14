import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Drizzle } from 'src/database/database.decorator';
import { Database } from 'src/database/database.provider';
import { MatchupsService } from '../matchups.service';
import { matchups } from '@repo/db';
import { and, eq, gte, isNotNull, lte } from 'drizzle-orm';
import { MatchupStatus } from '../enum/matchups';
import { ADMIN_WALLET_PUBLIC_KEY } from 'src/utils/services/paraAnchor';
import { LinesCreationSuccessOutput } from './types/lines-creation-success-outpot.type';

@Injectable()
export class MatchupCreateLinesService {
    private readonly logger = new Logger(MatchupCreateLinesService.name);

    constructor(
        @Drizzle() private readonly db: Database,
        private readonly matchupsService: MatchupsService,
    ) { }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleCron() {
        this.logger.log('Running matchup create lines cron job...');
        //line prediction for 72 hours + [1 day Tolerance]
        const UPTO_DAYS = 4;//Upto (N) of days in future to create lines for
        const NOW = new Date();
        const UPTO_DATE = new Date();
        UPTO_DATE.setDate(NOW.getDate() + UPTO_DAYS);
        const matchupsToCreateLinesFor =
            await this.db.query.matchups.findMany({
                where: and(
                    eq(matchups.ifLinesCreated, false),
                    eq(matchups.status, MatchupStatus.SCHEDULED),
                    isNotNull(matchups.oddsApiEventId),
                    gte(matchups.startsAt, NOW),
                    lte(matchups.startsAt, UPTO_DATE),
                ),
            });
        this.logger.log(
            `Found ${matchupsToCreateLinesFor.length} matchups to create lines for`,
        );
        if (matchupsToCreateLinesFor.length === 0) {
            this.logger.log('No matchups to create lines for, skipping...');
            return;
        }
        for (const matchup of matchupsToCreateLinesFor) {
            const matchupId = matchup.id;
            const walletAddress = ADMIN_WALLET_PUBLIC_KEY.toString();
            try {
                const createdLines: LinesCreationSuccessOutput[] =
                    await this.matchupsService.createLinesForMatchup(
                        {
                            matchupId,
                        },
                        {
                            walletAddress
                        },
                    );
                for (const line of createdLines) {
                    this.logger.log(`Created Line: ${line.homeTeam} - ${line.awayTeam} | ${line.statName} - ${line.athleteName} | ${line.predictedValue}`);
                }
                if (createdLines.length === 0) {
                    this.logger.log(`No lines found for matchup ${matchup.id}`);
                    continue;
                }
                this.logger.log(`SUCCESS: Created lines for matchup ${matchup.id}`);
            } catch (error) {
                this.logger.error(
                    `ERROR: Error creating lines for matchup ${matchup.id}`,
                    error,
                );
            }
        }
    }
}