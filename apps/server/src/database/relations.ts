import { relations } from 'drizzle-orm';
import {
  users,
  roles,
  games,
  gameMode,
  gameAccess,
  participants,
  athletes,
  stats,
  predictions,
  matchups,
  matchupPerformance,
  leaderboard,
} from './schemas';

// User relations
export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
  createdGames: many(games),
  participations: many(participants),
  gameAccess: many(gameAccess),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));

// Game relations
export const gamesRelations = relations(games, ({ one, many }) => ({
  creator: one(users, {
    fields: [games.creatorId],
    references: [users.id],
  }),
  gameMode: one(gameMode, {
    fields: [games.gameModeId],
    references: [gameMode.id],
  }),
  participants: many(participants),
  leaderboard: many(leaderboard),
  gameAccess: many(gameAccess),
}));

export const gameModeRelations = relations(gameMode, ({ many }) => ({
  games: many(games),
}));

export const gameAccessRelations = relations(gameAccess, ({ one }) => ({
  game: one(games, {
    fields: [gameAccess.gameId],
    references: [games.id],
  }),
  user: one(users, {
    fields: [gameAccess.userId],
    references: [users.id],
  }),
}));

// Participant relations
export const participantsRelations = relations(
  participants,
  ({ one, many }) => ({
    user: one(users, {
      fields: [participants.userId],
      references: [users.id],
    }),
    game: one(games, {
      fields: [participants.gameId],
      references: [games.id],
    }),
    predictions: many(predictions),
    leaderboard: many(leaderboard),
  }),
);

// Athlete relations
export const athletesRelations = relations(athletes, ({ many }) => ({
  predictions: many(predictions),
  matchupPerformances: many(matchupPerformance),
}));

// Prediction relations
export const predictionsRelations = relations(predictions, ({ one }) => ({
  participant: one(participants, {
    fields: [predictions.participantId],
    references: [participants.id],
  }),
  athlete: one(athletes, {
    fields: [predictions.athleteId],
    references: [athletes.id],
  }),
  stat: one(stats, {
    fields: [predictions.statId],
    references: [stats.id],
  }),
  matchup: one(matchups, {
    fields: [predictions.matchupId],
    references: [matchups.id],
  }),
}));

export const statsRelations = relations(stats, ({ many }) => ({
  predictions: many(predictions),
}));

// Matchup relations
export const matchupsRelations = relations(matchups, ({ many }) => ({
  predictions: many(predictions),
  performances: many(matchupPerformance),
}));

export const matchupPerformanceRelations = relations(
  matchupPerformance,
  ({ one }) => ({
    matchup: one(matchups, {
      fields: [matchupPerformance.matchupId],
      references: [matchups.id],
    }),
    athlete: one(athletes, {
      fields: [matchupPerformance.athleteId],
      references: [athletes.id],
    }),
  }),
);

// Leaderboard relations
export const leaderboardRelations = relations(leaderboard, ({ one }) => ({
  game: one(games, {
    fields: [leaderboard.gameId],
    references: [games.id],
  }),
  participant: one(participants, {
    fields: [leaderboard.participantId],
    references: [participants.id],
  }),
}));
