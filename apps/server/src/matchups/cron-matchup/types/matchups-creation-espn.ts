export interface EspnEventData {
  id: string;
  date: string;
  name?: string;
  competitions: EspnCompetition[];
  // Additional fields if needed
}

export interface EspnCompetition {
  id: string;
  date: string;
  competitors: EspnCompetitionCompetitor[];
  // Additional fields if needed
}

export interface EspnCompetitionCompetitor {
  $ref: string;
  id: string;
  uid: string;
  type: 'team';
  order: number;
  homeAway: 'home' | 'away';
  team: {
    $ref: string;
  };
  score: {
    $ref: string;
  };
  record: {
    $ref: string;
  };
}
