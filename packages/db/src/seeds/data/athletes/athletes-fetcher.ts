import axios from "axios";
import fs from "fs";
import path from "path";

export const TEAMS = [11, 13, 26, 33];
//Indianapolis colts, Las Vegas raiders, Seattle Seahawks, Baltimore ravens
export const BASE_URL =
  "https://sports.core.api.espn.com/v2/sports/football/leagues/nfl";
export const LANG = "en";
export const REGION = "us";

export interface SeederAthlete {
  name: string;
  team: string;
  position: string;
  jerseyNumber: number;
  age: number | null;
  picture: string;
}

export async function fetchJSON(url: string) {
  const resp = await axios.get(url);
  return resp.data;
}

export function calculateAge(dob: string): number | null {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const diff = Date.now() - birthDate.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export async function fetchTeamName(teamRef: string): Promise<string> {
  const data = await fetchJSON(teamRef);
  return data.displayName || "Unknown Team";
}

export async function fetchAthleteDetails(
  athleteRef: string
): Promise<SeederAthlete> {
  const data = await fetchJSON(athleteRef);
  const age = data.dateOfBirth ? calculateAge(data.dateOfBirth) : null;

  let picture = "";
  // Headshot field might be an object or array
  if (data.headshot?.href) {
    picture = data.headshot.href;
  } else if (Array.isArray(data.headshot) && data.headshot.length > 0) {
    picture = data.headshot[0].href || "";
  }

  // const teamRefUrl = data.team?.["$ref"];
  // const teamName = teamRefUrl
  //   ? await fetchTeamName(teamRefUrl)
  //   : "Unknown Team";

  return {
    name:
      data.displayName ||
      `${data.firstName} ${data.lastName}` ||
      "Unknown Name",
    team: data.team?.displayName || "Unknown Team",
    position:
      data.position?.name || data.position?.displayName || "Unknown Position",
    jerseyNumber: data.jersey ? parseInt(data.jersey) : 0,
    age,
    picture,
  };
}

export const fetchAthletes = async () => {
  const allAthletes: SeederAthlete[] = [];

  for (const teamId of TEAMS) {
    let pageIndex = 1;
    let pageCount = 1;

    const teamRefUrl = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/teams/${teamId}`;
    const teamName = teamRefUrl
      ? await fetchTeamName(teamRefUrl)
      : "Unknown Team";

    while (pageIndex <= pageCount) {
      const url = `${BASE_URL}/seasons/2025/teams/${teamId}/athletes?lang=${LANG}&region=${REGION}&page=${pageIndex}`;
      console.log(`Fetching team ${teamId} athletes page ${pageIndex}`);

      const data = await fetchJSON(url);
      pageCount = data.pageCount;

      for (const item of data.items) {
        const athleteRef = Array.isArray(item["$ref"])
          ? item["$ref"][0]
          : item["$ref"];
        try {
          const athlete = await fetchAthleteDetails(athleteRef);
          athlete.team = teamName;
          allAthletes.push(athlete);
          console.log(`Fetched athlete: ${JSON.stringify(athlete)}`);
        } catch (err) {
          console.error(`Failed to fetch athlete at ${athleteRef}`, err);
        }
      }

      pageIndex++;
    }
  }

  // Write the athletes to a file
  const filePath = path.join(__dirname, "preseason-athletes.ts");

  // Construct TypeScript file content as a string
  const tsContent = `import { athletes } from "@repo/db";

export const preSeasonAthletes: (typeof athletes.$inferInsert)[] = ${JSON.stringify(allAthletes, null, 2)};
`;

  // Write the file
  fs.writeFileSync(filePath, tsContent);

  console.log(`Saved ${allAthletes.length} athletes to ${filePath}`);
  return allAthletes;
};
