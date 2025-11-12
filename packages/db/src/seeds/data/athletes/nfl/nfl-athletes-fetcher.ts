import axios from "axios";
import fs from "fs";
import path from "path";

export const TEAMS = [
  22, // Arizona Cardinals
  1, // Atlanta Falcons
  33, // Baltimore Ravens
  2, // Buffalo Bills
  29, // Carolina Panthers
  3, // Chicago Bears
  4, // Cincinnati Bengals
  5, // Cleveland Browns
  6, // Dallas Cowboys
  7, // Denver Broncos
  8, // Detroit Lions
  9, // Green Bay Packers
  34, // Houston Texans
  11, // Indianapolis Colts
  30, // Jacksonville Jaguars
  12, // Kansas City Chiefs
  13, // Las Vegas Raiders
  24, // Los Angeles Chargers
  14, // Los Angeles Rams
  15, // Miami Dolphins
  16, // Minnesota Vikings
  17, // New England Patriots
  18, // New Orleans Saints
  19, // New York Giants
  20, // New York Jets
  21, // Philadelphia Eagles
  23, // Pittsburgh Steelers
  25, // San Francisco 49ers
  26, // Seattle Seahawks
  27, // Tampa Bay Buccaneers
  10, // Tennessee Titans
  28, // Washington Commanders
];

export const BASE_URL =
  "https://sports.core.api.espn.com/v2/sports/football/leagues/nfl";
export const LANG = "en";
export const REGION = "us";
export const YEAR = "2026";
export const SPORT_TYPE = "football";
export const LEAGUE_TYPE = "NFL";

export interface SeederAthlete {
  name: string;
  espnAthleteId: string;
  team: string;
  espnTeamId: string;
  position: string;
  jerseyNumber: number;
  age: number | null;
  picture: string;
  sportType: string;
  leagueType: string;
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
    espnTeamId: data.team?.id || "Unknown espnTeamId",
    position:
      data.position?.name || data.position?.displayName || "Unknown Position",
    jerseyNumber: data.jersey ? parseInt(data.jersey) : 0,
    age,
    picture,
    espnAthleteId: data.id,
    sportType: SPORT_TYPE,
    leagueType: LEAGUE_TYPE,
  };
}

export const fetchAthletes = async () => {
  const allAthletes: SeederAthlete[] = [];

  for (const teamId of TEAMS) {
    let pageIndex = 1;
    let pageCount = 1; // initial placeholder val, will get updated with actual page count in the loop

    const teamRefUrl = `${BASE_URL}/teams/${teamId}`;
    const teamName = teamRefUrl
      ? await fetchTeamName(teamRefUrl)
      : "Unknown Team";

    while (pageIndex <= pageCount) {
      const url = `${BASE_URL}/seasons/${YEAR}/teams/${teamId}/athletes?lang=${LANG}&region=${REGION}&page=${pageIndex}`;
      console.log(`Fetching team ${teamId} athletes page ${pageIndex}`);

      const data = await fetchJSON(url);
      pageCount = data.pageCount; // Updated the page count with the actual value from the API response

      for (const item of data.items) {
        const athleteRef = Array.isArray(item["$ref"])
          ? item["$ref"][0]
          : item["$ref"];
        try {
          const athlete = await fetchAthleteDetails(athleteRef);
          athlete.team = teamName;
          athlete.espnTeamId = teamId.toString();
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
  const filePath = path.join(__dirname, "nfl-athletes-latest.ts");

  // Construct TypeScript file content as a string
  const tsContent = `
export const nflAthletes = ${JSON.stringify(allAthletes, null, 2)};
`;

  // Write the file
  fs.writeFileSync(filePath, tsContent);

  console.log(`Saved ${allAthletes.length} athletes to ${filePath}`);
  return allAthletes;
};
