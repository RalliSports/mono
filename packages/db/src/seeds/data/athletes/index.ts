import { fetchAthletes } from "./athletes-fetcher";

async function main() {
  try {
    await fetchAthletes();
  } catch (error) {
    console.error("❌ Failed to fetch athletes:", error);
  }
}

main();
