import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { teams } from "@repo/db";
import * as schema from "@repo/db";

export const teamsData: (typeof teams.$inferInsert)[] = [
  {
    id: "550e8400-e29b-41d4-b132-446655440001",
    name: "Kansas City Chiefs",
    city: "Kansas City",
    country: "USA",
    foundedYear: 1960,
    coachName: "Andy Reid",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Kansas_City_Chiefs_logo.svg/1200px-Kansas_City_Chiefs_logo.svg.png",
    abbreviation: "KC",
  },
  {
    id: "550e8400-e29b-41d4-b132-446655440002",
    name: "Baltimore Ravens",
    city: "Baltimore",
    country: "USA",
    foundedYear: 1996,
    coachName: "John Harbaugh",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Kansas_City_Chiefs_logo.svg/1200px-Kansas_City_Chiefs_logo.svg.png",
    abbreviation: "BAL",
  },
  {
    id: "550e8400-e29b-41d4-b132-446655440003",
    name: "Buffalo Bills",
    city: "Buffalo",
    country: "USA",
    foundedYear: 1960,
    coachName: "Sean McDermott",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Kansas_City_Chiefs_logo.svg/1200px-Kansas_City_Chiefs_logo.svg.png",
    abbreviation: "BUF",
  },
  {
    id: "550e8400-e29b-41d4-b132-446655440004",
    name: "Miami Dolphins",
    city: "Miami",
    country: "USA",
    foundedYear: 1966,
    coachName: "Mike McDaniel",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Kansas_City_Chiefs_logo.svg/1200px-Kansas_City_Chiefs_logo.svg.png",
    abbreviation: "MIA",
  },
  {
    id: "550e8400-e29b-41d4-b132-446655440005",
    name: "New England Patriots",
    city: "Boston",
    country: "USA",
    foundedYear: 1960,
    coachName: "Mike Vrabel",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Kansas_City_Chiefs_logo.svg/1200px-Kansas_City_Chiefs_logo.svg.png",
    abbreviation: "NE",
  },
  {
    id: "550e8400-e29b-41d4-b132-446655440006",
    name: "New York Jets",
    city: "New York",
    country: "USA",
    foundedYear: 1960,
    coachName: "Aaron Glenn",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Kansas_City_Chiefs_logo.svg/1200px-Kansas_City_Chiefs_logo.svg.png",
    abbreviation: "NYJ",
  },
  {
    id: "550e8400-e29b-41d4-b132-446655440007",
    name: "San Francisco 49ers",
    city: "San Francisco",
    country: "USA",
    foundedYear: 1946,
    coachName: "Kyle Shanahan",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Kansas_City_Chiefs_logo.svg/1200px-Kansas_City_Chiefs_logo.svg.png",
    abbreviation: "SF",
  },
  {
    id: "550e8400-e29b-41d4-b132-446655440008",
    name: "Los Angeles Rams",
    city: "Los Angeles",
    country: "USA",
    foundedYear: 1936,
    coachName: "Sean McVay",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Kansas_City_Chiefs_logo.svg/1200px-Kansas_City_Chiefs_logo.svg.png",
    abbreviation: "LAR",
  },
  {
    id: "550e8400-e29b-41d4-b132-446655440009",
    name: "Seattle Seahawks",
    city: "Seattle",
    country: "USA",
    foundedYear: 1974,
    coachName: "Mike McDonald",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Kansas_City_Chiefs_logo.svg/1200px-Kansas_City_Chiefs_logo.svg.png",
    abbreviation: "SEA",
  },
  {
    id: "550e8400-e29b-41d4-b132-446655440010",
    name: "Green Bay Packers",
    city: "Green Bay",
    country: "USA",
    foundedYear: 1921,
    coachName: "Matt LaFleur",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Kansas_City_Chiefs_logo.svg/1200px-Kansas_City_Chiefs_logo.svg.png",
    abbreviation: "GB",
  },
  {
    id: "550e8400-e29b-41d4-b132-446655440011",
    name: "Las Vegas Raiders",
    city: "Las Vegas",
    country: "USA",
    foundedYear: 1960,
    coachName: "Pete Carroll",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Kansas_City_Chiefs_logo.svg/1200px-Kansas_City_Chiefs_logo.svg.png",
    abbreviation: "LV",
  },
  {
    id: "550e8400-e29b-41d4-b132-446655440012",
    name: "Los Angeles Chargers",
    city: "Los Angeles",
    country: "USA",
    foundedYear: 1960,
    coachName: "Jim Harbaugh",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Kansas_City_Chiefs_logo.svg/1200px-Kansas_City_Chiefs_logo.svg.png",
    abbreviation: "LAC",
  },
  {
    id: "550e8400-e29b-41d4-b132-446655440013",
    name: "Indianapolis Colts",
    city: "Indianapolis",
    country: "USA",
    foundedYear: 1953,
    coachName: "Frank Reich",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Kansas_City_Chiefs_logo.svg/1200px-Kansas_City_Chiefs_logo.svg.png",
    abbreviation: "IND",
  },
];

export const seedTeams = async (db: NodePgDatabase<typeof schema>) => {
  await db.insert(teams).values(teamsData).onConflictDoNothing();
  console.log("✅ Teams seeded");
};
