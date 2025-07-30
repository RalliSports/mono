export interface EspnTeam {
  id: string;
  uid: string;
  abbreviation: string;
  name: string;
  displayName: string;
  logo: string;
}

export interface EspnOddsDetails {
  provider: { id: string; name: string; priority?: number };
  details: string; // e.g. "DET -2"
  overUnder?: number;
  spread?: number;
  awayTeamOdds: {
    favorite: boolean;
    underdog: boolean;
    team: EspnTeam;
  };
  homeTeamOdds: {
    favorite: boolean;
    underdog: boolean;
    team: EspnTeam;
  };
  open: {
    over?: {
      value: number;
      displayValue: string;
      alternateDisplayValue: string;
    };
    under?: {
      value: number;
      displayValue: string;
      alternateDisplayValue: string;
    };
    total?: {
      value: number;
      displayValue: string;
      alternateDisplayValue: string;
    };
  };
  current: {
    over?: {
      value: number;
      displayValue: string;
      alternateDisplayValue: string;
      outcome?: { type: string };
    };
    under?: {
      value: number;
      displayValue: string;
      alternateDisplayValue: string;
      outcome?: { type: string };
    };
    total?: { alternateDisplayValue: string; american: string };
  };
}

export interface EspnCompetition {
  odds?: EspnOddsDetails[];
}

export interface EspnEvent {
  id: string;
  date: string;
  competitions?: EspnCompetition[];
}

export interface EspnScoreboardResponse {
  events?: EspnEvent[];
}
