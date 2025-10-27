
//Just for logging in CRON
export interface LinesCreationSuccessOutput {
    statName: string;
    athleteName: string;
    predictedValue: number;
    oddsOver: number;
    oddsUnder: number;
    homeTeam: string;
    awayTeam: string;
    matchupId: string;
};