// Base types for NFL betting data structure

interface Outcome {
    name: "Over" | "Under";
    description: string;  // Player name
    price: number;        // Decimal odds
    point: number;        // Betting line/threshold
  }
  
  interface Market {
    key: string;          // Market type identifier
    last_update: string;  // ISO datetime string
    outcomes: Outcome[];
  }
  
  interface Bookmaker {
    key: string;          // Bookmaker identifier
    title: string;        // Bookmaker display name
    markets: Market[];
  }
  
  interface NFLGame {
    id: string;                    // Unique game identifier
    sport_key: string;             // Sport identifier (e.g., "americanfootball_nfl")
    sport_title: string;           // Sport display name (e.g., "NFL")
    commence_time: string;         // ISO datetime string
    home_team: string;             // Home team name
    away_team: string;             // Away team name
    bookmakers: Bookmaker[];
  }
  
  // Market type definitions based on the data
  type MarketType = 
    | "player_field_goals"     // Field goals over/under
    | "player_kicking_points"  // Total kicking points
    | "player_pass_tds"        // Passing touchdowns
    | "player_pass_yds"        // Passing yards
    | "player_reception_yds"   // Receiving yards
    | "player_receptions"      // Number of receptions
    | "player_rush_attempts"   // Rush attempts
    | "player_rush_yds"        // Rushing yards
    | "player_sacks";          // Sacks
  
  // The root data structure
  export type NFLBettingData = NFLGame;