import { InferSelectModel } from "drizzle-orm";
import {
  athletes,
  game_access,
  game_mode,
  games,
  lines,
  matchup_performance,
  matchups,
  participants,
  bets,
  referrals,
  roles,
  stats,
  users,
  teams,
} from "../schema";

export type User = InferSelectModel<typeof users>;
export type Game = InferSelectModel<typeof games>;
export type GameAccess = InferSelectModel<typeof game_access>;
export type GameMode = InferSelectModel<typeof game_mode>;
export type Athlete = InferSelectModel<typeof athletes>;
export type Line = InferSelectModel<typeof lines>;
export type Matchup = InferSelectModel<typeof matchups>;
export type MatchupPerformance = InferSelectModel<typeof matchup_performance>;
export type Participant = InferSelectModel<typeof participants>;
export type Bet = InferSelectModel<typeof bets>;
export type Referral = InferSelectModel<typeof referrals>;
export type Role = InferSelectModel<typeof roles>;
export type Stat = InferSelectModel<typeof stats>;
export type Team = InferSelectModel<typeof teams>;
