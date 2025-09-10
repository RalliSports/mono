interface AthleteLines {
  [key: string]: string;
}

interface Athlete {
  id: string;
  name: string;
  jersey: string;
  team_id: string;
  team_name: string;
  lines: AthleteLines;
}

interface TeamLines {
  [key: string]: string;
}

interface Team {
  id: string;
  name: string;
  abbreviation: string;
  score: number;
  lines: TeamLines;
}

interface ProcessedData {
  athletes: Athlete[];
  teams: Team[];
}

async function fetchESPNBoxscoreData(eventId: string): Promise<ProcessedData> {
  try {
    const response = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${eventId}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as any;

    const athletes: Athlete[] = [];
    const teams: Team[] = [];

    // Process athletes (players)
    for (const teamPlayers of data.boxscore.players) {
      const teamInfo = teamPlayers.team;

      for (const statCategory of teamPlayers.statistics) {
        const statName = statCategory.name;
        const keys = statCategory.keys || [];

        for (const athleteData of statCategory.athletes || []) {
          const athlete = athleteData.athlete;
          const athleteId = athlete.id;
          const athleteName =
            `${athlete.firstName || ''} ${athlete.lastName || ''}`.trim();
          const stats = athleteData.stats || [];

          // Create lines dictionary mapping keys to values
          const lines: AthleteLines = {};
          keys.forEach((key: string, index: number) => {
            if (index < stats.length) {
              // Clean key name for better readability
              const cleanKey = key.replace(/\//g, '_').replace(/-/g, '_');
              lines[`${statName}_${cleanKey}`] = stats[index];
            }
          });

          // Check if athlete already exists, if so, merge stats
          const existingAthleteIndex = athletes.findIndex(
            (a) => a.id === athleteId,
          );
          if (existingAthleteIndex !== -1) {
            athletes[existingAthleteIndex].lines = {
              ...athletes[existingAthleteIndex].lines,
              ...lines,
            };
          } else {
            athletes.push({
              id: athleteId,
              name: athleteName,
              jersey: athlete.jersey || '',
              team_id: teamInfo.id,
              team_name: teamInfo.name,
              lines,
            });
          }
        }
      }
    }

    // Process teams and get final scores
    for (const teamData of data.boxscore.teams) {
      const teamInfo = teamData.team;
      const teamStats: TeamLines = {};

      // Extract team statistics
      for (const stat of teamData.statistics || []) {
        teamStats[stat.name] = stat.displayValue;
      }

      // Get final score from the header or competitor data
      let finalScore = 0;
      if (
        data.header &&
        data.header.competitions &&
        data.header.competitions[0]
      ) {
        const competition = data.header.competitions[0];
        const competitor = competition.competitors.find(
          (comp: any) => comp.team.id === teamInfo.id,
        );
        if (competitor) {
          finalScore = parseInt(competitor.score) || 0;
        }
      }

      teams.push({
        id: teamInfo.id,
        name: `${teamInfo.location} ${teamInfo.name}`,
        abbreviation: teamInfo.abbreviation,
        score: finalScore,
        lines: teamStats,
      });
    }

    return { athletes, teams };
  } catch (error) {
    console.error('Error fetching ESPN boxscore data:', error);
    throw error;
  }
}

export { fetchESPNBoxscoreData, Athlete, Team, ProcessedData };
