export interface OddsEvent {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string; // ISO 8601 timestamp
  home_team: string;
  away_team: string;
}
//     {
// "id": "0ee3f5a0078c21cfdffd1b97002e7da5",
// "sport_key": "americanfootball_nfl",
// "sport_title": "NFL",
// "commence_time": "2025-09-21T19:06:00Z",
// "home_team": "Los Angeles Chargers",
// "away_team": "Denver Broncos"
// },

export type OddsEventsResponse = OddsEvent[];
