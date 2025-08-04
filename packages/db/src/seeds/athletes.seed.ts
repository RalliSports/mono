import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { athletes } from "@repo/db";
import * as schema from "@repo/db";

export const athletesData: (typeof athletes.$inferInsert)[] = [
  // Quarterbacks
  {
    id: "550e8400-e29b-41d4-a716-446655440030",
    name: "Josh Allen",
    team: "Buffalo Bills",
    position: "QB",
    jerseyNumber: 17,
    age: 28,
    picture: "https://example.com/images/josh_allen.jpg",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440031",
    name: "Patrick Mahomes",
    team: "Kansas City Chiefs",
    position: "QB",
    jerseyNumber: 15,
    age: 29,
    picture: "https://example.com/images/patrick_mahomes.jpg",
  },
  // Running Backs
  {
    id: "550e8400-e29b-41d4-a716-446655440032",
    name: "Christian McCaffrey",
    team: "San Francisco 49ers",
    position: "RB",
    jerseyNumber: 23,
    age: 28,
    picture: "https://example.com/images/christian_mccaffrey.jpg",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440033",
    name: "Derrick Henry",
    team: "Baltimore Ravens",
    position: "RB",
    jerseyNumber: 22,
    age: 30,
    picture: "https://example.com/images/derrick_henry.jpg",
  },
  // Wide Receivers
  {
    id: "550e8400-e29b-41d4-a716-446655440034",
    name: "Tyreek Hill",
    team: "Miami Dolphins",
    position: "WR",
    jerseyNumber: 10,
    age: 30,
    picture: "https://example.com/images/tyreek_hill.jpg",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440035",
    name: "Cooper Kupp",
    team: "Los Angeles Rams",
    position: "WR",
    jerseyNumber: 10,
    age: 31,
    picture: "https://example.com/images/cooper_kupp.jpg",
  },
  // Tight Ends
  {
    id: "550e8400-e29b-41d4-a716-446655440036",
    name: "Travis Kelce",
    team: "Kansas City Chiefs",
    position: "TE",
    jerseyNumber: 87,
    age: 35,
    picture: "https://example.com/images/travis_kelce.jpg",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440037",
    name: "Mark Andrews",
    team: "Baltimore Ravens",
    position: "TE",
    jerseyNumber: 89,
    age: 29,
    picture: "https://example.com/images/mark_andrews.jpg",
  },
];

export const seedAthletes = async (db: NodePgDatabase<typeof schema>) => {
  await db.insert(athletes).values(athletesData).onConflictDoNothing();
  console.log("✅ Athletes seeded");
};
