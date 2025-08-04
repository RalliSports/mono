import { stats } from "@repo/db";
export const statsData: (typeof stats.$inferInsert)[] = [
  // PASSING
  {
    name: "passing_yards",
    description: "Total passing yards by a player in a game.",
  },
  {
    name: "passing_touchdowns",
    description: "Total passing touchdowns by a player.",
  },
  {
    name: "passing_completions",
    description: "Total number of completed passes.",
  },
  { name: "passing_attempts", description: "Total number of pass attempts." },
  {
    name: "interceptions_thrown",
    description: "Total number of interceptions thrown.",
  },
  {
    name: "passing_yards_per_attempt",
    description: "Average yards gained per pass attempt.",
  },
  {
    name: "passer_rating",
    description: "Quarterback passer rating for the game.",
  },
  {
    name: "passing_longest_completion",
    description: "Longest completed pass (yards).",
  },

  // RUSHING
  { name: "rushing_yards", description: "Total rushing yards gained." },
  {
    name: "rushing_touchdowns",
    description: "Total rushing touchdowns scored.",
  },
  { name: "rushing_attempts", description: "Total number of rush attempts." },
  { name: "rushing_longest_run", description: "Longest rushing play (yards)." },
  {
    name: "rushing_yards_per_attempt",
    description: "Average yards per rush attempt.",
  },

  // RECEIVING
  { name: "receiving_yards", description: "Total receiving yards." },
  { name: "receptions", description: "Total number of completed catches." },
  { name: "receiving_touchdowns", description: "Total receiving touchdowns." },
  { name: "receiving_targets", description: "Total number of times targeted." },
  {
    name: "receiving_longest_catch",
    description: "Longest reception (yards).",
  },
  { name: "yards_after_catch", description: "Total yards gained after catch." },

  // COMBINED / GENERAL
  {
    name: "completions_plus_attempts",
    description: "Total of completions and attempts (for combo props).",
  },
  {
    name: "rushing_plus_receiving_yards",
    description: "Combined rushing and receiving yards.",
  },
  {
    name: "total_touchdowns",
    description:
      "Sum of rushing, receiving, and passing touchdowns (if allowed).",
  },

  // FUMBLES
  { name: "fumbles", description: "Total number of fumbles." },
  { name: "fumbles_lost", description: "Fumbles lost to the opposing team." },

  // DEFENSE (for occasional props/DFS)
  { name: "total_tackles", description: "Total tackles (solo + assist)." },
  { name: "sacks", description: "Total quarterback sacks." },
  {
    name: "interceptions",
    description: "Total interceptions made by a defender.",
  },

  // KICKING (less common, but sometimes available)
  {
    name: "field_goals_made",
    description: "Number of successful field goals.",
  },
  {
    name: "extra_points_made",
    description: "Number of successful extra points.",
  },

  // TEAM STATS / GAME LINES
  { name: "team_total_points", description: "Points scored by the team." },
  {
    name: "team_total_yards",
    description: "Total net yards gained by the team.",
  },
  { name: "spread", description: "Point spread for the matchup." },
  {
    name: "over_under",
    description: "Over/under line for total points scored in the game.",
  },
];
