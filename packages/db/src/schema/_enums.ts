import { pgEnum } from "drizzle-orm/pg-core";



export const parlayStatus = pgEnum("parlayStatus", ["open", "closed", "settled"])

export type Status = (typeof parlayStatus.enumValues)[number];
