import { ESPNBoxScoreResponse } from '../types/matchup-boxscore-espn-response.types';

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
  home_away: string;
  won: boolean;
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

    const data: ESPNBoxScoreResponse = (await response.json()) as any;

    const athletes: Athlete[] = [];
    const teams: Team[] = [];

    // Process athletes (players)
    for (const teamPlayers of data.boxscore.players) {
      //data.boxscore.players[0] = teamPlayers
      const teamInfo = teamPlayers.team;

      for (const statCategory of teamPlayers.statistics) {
        //data.boxscore.players[0].statistics[0] = statCategory
        const statName = statCategory.name; //"name": "passing",
        const keys = statCategory.keys || []; //"keys": ["completions/passingAttempts","passingYards"]

        for (const athleteData of statCategory.athletes || []) {
          //data.boxscore.players[0].statistics[0].athletes[0] = athleteData
          const athlete = athleteData.athlete;
          const athleteId = athlete.id;
          const athleteName = athlete.displayName;
          const stats = athleteData.stats || []; // "stats": ["21/34","188"]

          // Create lines dictionary mapping keys to values
          const lines: AthleteLines = {};
          keys.forEach((key: string, index: number) => {
            if (index < stats.length) {
              // Clean key name for better readability
              // const cleanKey = key.replace(/\//g, '_').replace(/-/g, '_');
              // lines[`${statName}_${cleanKey}`] = stats[index];
              lines[key] = stats[index];
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
              team_name: teamInfo.displayName,
              lines,
            });
          }
        }
      }
    }

    // Process teams and get final scores
    for (const teamData of data.boxscore.teams) {
      //data.boxscore.teams[0] = teamData
      const teamInfo = teamData.team;
      const teamStats: TeamLines = {};

      // Extract team statistics
      for (const stat of teamData.statistics || []) {
        teamStats[stat.name] = stat.displayValue;
      }

      // Get final score from the header or competitor data
      let finalScore = 0;
      let ifWinner = false;
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
          ifWinner = competitor.winner;
        }
      }

      teams.push({
        id: teamInfo.id,
        name: teamInfo.displayName,
        abbreviation: teamInfo.abbreviation,
        score: finalScore,
        home_away: teamData.homeAway,
        won: ifWinner,
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
