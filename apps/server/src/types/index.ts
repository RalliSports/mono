import {
  games,
  users,
  lines,
  participants,
  bets,
  athletes,
  matchups,
  stats,
  game_mode,
} from '@repo/db';

// Game types with relations
export type GameWithRelations = typeof games.$inferSelect & {
  gameMode: typeof game_mode.$inferSelect | null;
  participants: (typeof participants.$inferSelect & {
    user: typeof users.$inferSelect | null;
    bets: (typeof bets.$inferSelect & {
      line:
        | (typeof lines.$inferSelect & {
            athlete: typeof athletes.$inferSelect | null;
            matchup: typeof matchups.$inferSelect | null;
            stat: typeof stats.$inferSelect | null;
          })
        | null;
    })[];
  })[];
  creator: typeof users.$inferSelect | null;
};

// User types
export type UserWithRelations = typeof users.$inferSelect;

// Line types with relations
export type LineWithRelations = typeof lines.$inferSelect & {
  athlete: typeof athletes.$inferSelect | null;
  matchup: typeof matchups.$inferSelect | null;
  stat: typeof stats.$inferSelect | null;
};

// Export the types with the same names for compatibility
export type GamesFindOne = GameWithRelations;
export type GamesFindAll = GameWithRelations[];
export type GamesFindAllInstance = GameWithRelations;
export type UserFindOne = UserWithRelations;
export type LineFindAll = LineWithRelations[];
export type LineFindAllInstance = LineWithRelations;
