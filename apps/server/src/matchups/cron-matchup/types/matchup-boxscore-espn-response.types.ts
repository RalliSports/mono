export interface ESPNTeam {
  id: string;
  displayName: string;
  abbreviation: string;
}

export interface ESPNStatistic {
  name: string;
  displayValue: string;
}

export interface ESPNAthlete {
  id: string;
  displayName: string;
  jersey: string;
}

export interface ESPNAthleteData {
  athlete: ESPNAthlete;
  stats: string[];
}

export interface ESPNStatCategory {
  name: string;
  keys: string[];
  athletes: ESPNAthleteData[];
}

export interface ESPNTeamData {
  team: ESPNTeam;
  statistics: ESPNStatistic[];
  homeAway: 'home' | 'away';
}

export interface ESPNPlayerData {
  team: ESPNTeam;
  statistics: ESPNStatCategory[];
}

export interface ESPNCompetitor {
  team: ESPNTeam;
  score: string;
  winner: boolean;
}

export interface ESPNCompetition {
  competitors: ESPNCompetitor[];
}

export interface ESPNHeader {
  competitions: ESPNCompetition[];
}

export interface ESPNBoxscore {
  teams: ESPNTeamData[];
  players: ESPNPlayerData[];
}

// Main ESPN API Response export Interface - Only used properties
export interface ESPNBoxScoreResponse {
  boxscore: ESPNBoxscore;
  header: ESPNHeader;
}
