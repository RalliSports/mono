import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { athletes } from "@repo/db";
import * as schema from "@repo/db";
import { preSeasonAthletes } from "./data/athletes/preseason-athletes";

export const athletesData: (typeof athletes.$inferInsert)[] = preSeasonAthletes;
// Replace first 5 athlete ids matching those in linesData

export const seedAthletes = async (db: NodePgDatabase<typeof schema>) => {
  const fixedAthleteIds = [
    //keeping athlete ids the same for now - for data consistency in seeding
    "1aae0249-6b34-41a3-87b9-5131b91fb9af",
    "8bd865b0-22dc-42b5-aa73-d37dd3729765",
    "e91e546f-75a0-4bfb-9bb5-3e21d2258edf",
    "9528068f-57b5-4380-bc04-f4238057b440",
    "17b27fd9-8ebe-4ce7-9e84-cb34714386a6",
  ];

  for (let i = 0; i < 5 && i < athletesData.length; i++) {
    if (athletesData?.[i]) {
      athletesData[i]!.id = fixedAthleteIds[i];
    }
  }
  await db.insert(athletes).values(athletesData).onConflictDoNothing();
  console.log("✅ Athletes seeded");
};
