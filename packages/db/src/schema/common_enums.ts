import { pgEnum } from "drizzle-orm/pg-core";

export const sportTypeEnum = pgEnum("sport_type", [
    "football",
    "basketball",
    "baseball"
]);

export const leagueTypeEnum = pgEnum("league_type", [
    "NFL",
    "NBA",
    "MLB",
]);
