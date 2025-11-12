// import { fetchAthletes } from "./nfl/nfl-athletes-fetcher";
import { fetchAthletes } from "./nba/nba-athletes-fetcher";

async function main() {
  try {
    await fetchAthletes();
  } catch (error) {
    console.error("❌ Failed to fetch athletes:", error);
  }
}

main();
