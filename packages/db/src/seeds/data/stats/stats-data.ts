import { stats } from "@repo/db";
export const statsData: (typeof stats.$inferInsert)[] = [
  // PASSING
  {
    name: "passing_yards",
    description: "Total passing yards by a player in a game.",
    customId: 10001,
    id: "550e8401-e29b-41d4-a716-446655440001",
  },
  {
    name: "passing_touchdowns",
    description: "Total passing touchdowns by a player.",
    customId: 10002,
    id: "550e8401-e29b-41d4-a716-446655440002",
  },
  {
    name: "passing_completions",
    description: "Total number of completed passes.",
    customId: 10003,
    id: "550e8401-e29b-41d4-a716-446655440003",
  },
  { 
    name: "passing_attempts", 
    description: "Total number of pass attempts.", 
    customId: 10004,
    id: "550e8401-e29b-41d4-a716-446655440004",
  },
  {
    name: "interceptions_thrown",
    description: "Total number of interceptions thrown.",
    customId: 10005,
    id: "550e8401-e29b-41d4-a716-446655440005",
  },
  {
    name: "passing_yards_per_attempt",
    description: "Average yards gained per pass attempt.",
    customId: 10006,
    id: "550e8401-e29b-41d4-a716-446655440006",
  },
  {
    name: "passer_rating",
    description: "Quarterback passer rating for the game.",
    customId: 10007,
    id: "550e8401-e29b-41d4-a716-446655440007",
  },
  {
    name: "passing_longest_completion",
    description: "Longest completed pass (yards).",
    customId: 10008,
    id: "550e8401-e29b-41d4-a716-446655440008",
  },

  // RUSHING
  { 
    name: "rushing_yards", 
    description: "Total rushing yards gained.", 
    customId: 10009,
    id: "550e8401-e29b-41d4-a716-446655440009",
  },
  {
    name: "rushing_touchdowns",
    description: "Total rushing touchdowns scored.",
    customId: 10010,
    id: "550e8401-e29b-41d4-a716-446655440010",
  },
  { 
    name: "rushing_attempts", 
    description: "Total number of rush attempts.", 
    customId: 10011,
    id: "550e8401-e29b-41d4-a716-446655440011",
  },
  { 
    name: "rushing_longest_run", 
    description: "Longest rushing play (yards).", 
    customId: 10012,
    id: "550e8401-e29b-41d4-a716-446655440012",
  },
  {
    name: "rushing_yards_per_attempt",
    description: "Average yards per rush attempt.",
    customId: 10013,
    id: "550e8401-e29b-41d4-a716-446655440013",
  },

  // RECEIVING
  { 
    name: "receiving_yards", 
    description: "Total receiving yards.", 
    customId: 10014,
    id: "550e8401-e29b-41d4-a716-446655440014",
  },
  { 
    name: "receptions", 
    description: "Total number of completed catches.", 
    customId: 10015,
    id: "550e8401-e29b-41d4-a716-446655440015",
  },
  { 
    name: "receiving_touchdowns", 
    description: "Total receiving touchdowns.", 
    customId: 10016,
    id: "550e8401-e29b-41d4-a716-446655440016",
  },
  { 
    name: "receiving_targets", 
    description: "Total number of times targeted.", 
    customId: 10017,
    id: "550e8401-e29b-41d4-a716-446655440017",
  },
  {
    name: "receiving_longest_catch",
    description: "Longest reception (yards).",
    customId: 10018,
    id: "550e8401-e29b-41d4-a716-446655440018",
  },
  { 
    name: "yards_after_catch", 
    description: "Total yards gained after catch.", 
    customId: 10019,
    id: "550e8401-e29b-41d4-a716-446655440019",
  },

  // COMBINED / GENERAL
  {
    name: "completions_plus_attempts",
    description: "Total of completions and attempts (for combo props).",
    customId: 10020,
    id: "550e8401-e29b-41d4-a716-446655440020",
  },
  {
    name: "rushing_plus_receiving_yards",
    description: "Combined rushing and receiving yards.",
    customId: 10021,
    id: "550e8401-e29b-41d4-a716-446655440021",
  },
  {
    name: "total_touchdowns",
    description:
      "Sum of rushing, receiving, and passing touchdowns (if allowed).",
    customId: 10022,
    id: "550e8401-e29b-41d4-a716-446655440022",
  },

  // FUMBLES
  { 
    name: "fumbles", 
    description: "Total number of fumbles.", 
    customId: 10023,
    id: "550e8401-e29b-41d4-a716-446655440023",
  },
  { 
    name: "fumbles_lost", 
    description: "Fumbles lost to the opposing team.", 
    customId: 10024,
    id: "550e8401-e29b-41d4-a716-446655440024",
  },

  // DEFENSE (for occasional props/DFS)
  { 
    name: "total_tackles", 
    description: "Total tackles (solo + assist).", 
    customId: 10025,
    id: "550e8401-e29b-41d4-a716-446655440025",
  },
  { 
    name: "sacks", 
    description: "Total quarterback sacks.", 
    customId: 10026,
    id: "550e8401-e29b-41d4-a716-446655440026",
  },
  {
    name: "interceptions",
    description: "Total interceptions made by a defender.",
    customId: 10027,
    id: "550e8401-e29b-41d4-a716-446655440027",
  },

  // KICKING (less common, but sometimes available)
  {
    name: "field_goals_made",
    description: "Number of successful field goals.",
    customId: 10028,
    id: "550e8401-e29b-41d4-a716-446655440028",
  },
  {
    name: "extra_points_made",
    description: "Number of successful extra points.",
    customId: 10029,
    id: "550e8401-e29b-41d4-a716-446655440029",
  },

  // TEAM STATS / GAME LINES
  { 
    name: "team_total_points", 
    description: "Points scored by the team.", 
    customId: 10030,
    id: "550e8401-e29b-41d4-a716-446655440030",
  },
  {
    name: "team_total_yards",
    description: "Total net yards gained by the team.",
    customId: 10031,
    id: "550e8401-e29b-41d4-a716-446655440031",
  },
  { 
    name: "spread", 
    description: "Point spread for the matchup.", 
    customId: 10032,
    id: "550e8401-e29b-41d4-a716-446655440032",
  },
  {
    name: "over_under",
    description: "Over/under line for total points scored in the game.",
    customId: 10033,
    id: "550e8401-e29b-41d4-a716-446655440033",
  },
];
