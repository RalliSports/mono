import axios from "axios";

const TEAMS = [...Array(30).keys()].map((i) => i + 1).concat([33, 34]);
const BASE_URL =
  "https://sports.core.api.espn.com/v2/sports/football/leagues/nfl";
const LANG = "en";
const REGION = "us";

interface SeederAthlete {
  name: string;
  team: string;
  position: string;
  jerseyNumber: number;
  age: number | null;
  picture: string;
}

async function fetchJSON(url: string) {
  const resp = await axios.get(url);
  return resp.data;
}

function calculateAge(dob: string): number | null {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const diff = Date.now() - birthDate.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

async function fetchTeamName(teamRef: string): Promise<string> {
  const data = await fetchJSON(teamRef);
  return data.displayName || "Unknown Team";
}

async function fetchAthleteDetails(athleteRef: string): Promise<SeederAthlete> {
  const data = await fetchJSON(athleteRef);
  const age = data.dateOfBirth ? calculateAge(data.dateOfBirth) : null;

  let picture = "";
  // Headshot field might be an object or array
  if (data.headshot?.href) {
    picture = data.headshot.href;
  } else if (Array.isArray(data.headshot) && data.headshot.length > 0) {
    picture = data.headshot[0].href || "";
  }

  const teamRefUrl = data.team?.["$ref"];
  const teamName = teamRefUrl
    ? await fetchTeamName(teamRefUrl)
    : "Unknown Team";

  return {
    name:
      data.displayName ||
      `${data.firstName} ${data.lastName}` ||
      "Unknown Name",
    team: teamName,
    position:
      data.position?.abbreviation || data.position?.name || "Unknown Position",
    jerseyNumber: data.jersey ? parseInt(data.jersey) : 0,
    age,
    picture,
  };
}

export const seedAthletes = async () => {
  const allAthletes: SeederAthlete[] = [];

  for (const teamId of TEAMS) {
    let pageIndex = 1;
    let pageCount = 1;

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
          allAthletes.push(athlete);
        } catch (err) {
          console.error(`Failed to fetch athlete at ${athleteRef}`, err);
        }
      }

      pageIndex++;
    }
  }

  return allAthletes;
};
