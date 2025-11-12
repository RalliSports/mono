import axios from "axios";
import fs from "fs";
import path from "path";

export const TEAMS = [
    1,  // Atlanta Hawks
    2,  // Boston Celtics
    17, // Brooklyn Nets
    30, // Charlotte Hornets
    4,  // Chicago Bulls
    5,  // Cleveland Cavaliers
    6,  // Dallas Mavericks
    7,  // Denver Nuggets
    8,  // Detroit Pistons
    9,  // Golden State Warriors
    10, // Houston Rockets
    11, // Indiana Pacers
    12, // LA Clippers
    13, // Los Angeles Lakers
    29, // Memphis Grizzlies
    14, // Miami Heat
    15, // Milwaukee Bucks
    16, // Minnesota Timberwolves
    3,  // New Orleans Pelicans
    18, // New York Knicks
    25, // Oklahoma City Thunder
    19, // Orlando Magic
    20, // Philadelphia 76ers
    21, // Phoenix Suns
    22, // Portland Trail Blazers
    23, // Sacramento Kings
    24, // San Antonio Spurs
    28, // Toronto Raptors
    26, // Utah Jazz
    27, // Washington Wizards
]

export const BASE_URL =
    "https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba";
export const LANG = "en";
export const REGION = "us";
export const YEAR = "2026";
export const SPORT_TYPE = "basketball";
export const LEAGUE_TYPE = "NBA";

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
    if (data.headshot?.href) {
        picture = data.headshot.href;
    } else if (Array.isArray(data.headshot) && data.headshot.length > 0) {
        picture = data.headshot[0].href || "";
    }
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
        let pageCount = 1;//place holder initial value, will get updated with actual page count in the loop

        const teamRefUrl = `${BASE_URL}/teams/${teamId}`;
        const teamName = teamRefUrl
            ? await fetchTeamName(teamRefUrl)
            : "Unknown Team";

        while (pageIndex <= pageCount) {
            const url = `${BASE_URL}/seasons/${YEAR}/teams/${teamId}/athletes?lang=${LANG}&region=${REGION}&page=${pageIndex}`;
            console.log(`Fetching team ${teamId} athletes page ${pageIndex}`);

            const data = await fetchJSON(url);
            pageCount = data.pageCount; // Updated the actual page count from the API response

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
    const filePath = path.join(__dirname, "nba-athletes-latest.ts");

    // Construct TypeScript file content as a string
    const tsContent = `
export const nbaAthletes = ${JSON.stringify(allAthletes, null, 2)};
`;

    // Write the file
    fs.writeFileSync(filePath, tsContent);

    console.log(`Saved ${allAthletes.length} athletes to ${filePath}`);
    return allAthletes;
};
