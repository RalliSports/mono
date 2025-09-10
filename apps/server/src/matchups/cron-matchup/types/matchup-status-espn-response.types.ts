// ESPN Status response types
export interface EspnMatchupStatusResponse {
  clock: number;
  displayClock: string;
  period: number;
  type: EspnStatusType;
}

export interface EspnStatusType {
  id: string;
  name: EspnStatusName;
  state: EspnStatusState;
  completed: boolean;
  description: string;
  detail: string;
  shortDetail: string;
}

export const enum EspnStatusName {
  SCHEDULED = 'STATUS_SCHEDULED',
  IN_PROGRESS = 'STATUS_IN_PROGRESS',
  CURRENT = 'STATUS_CURRENT',
  FINAL = 'STATUS_FINAL',
  CANCELED = 'STATUS_CANCELED',
  POSTPONED = 'STATUS_POSTPONED',
  HALFTIME = 'STATUS_HALFTIME',
  DELAYED = 'STATUS_DELAYED',
}

export const enum EspnStatusState {
  POST = 'post',
  PRE = 'pre',
  IN = 'in',
}

// {
// "$ref": "http://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/401774591/competitions/401774591/status?lang=en&region=us",
// "clock": 0,
// "displayClock": "0:00",
// "period": 4,
// "type": {
//   "id": "3",
//   "name": "STATUS_FINAL",
//   "state": "post",
//   "completed": true,
//   "description": "Final",
//   "detail": "Final",
//   "shortDetail": "Final"
//   }
// }
