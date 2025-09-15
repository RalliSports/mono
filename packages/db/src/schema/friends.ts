import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const friends = pgTable("friends", {
  id: uuid("id").primaryKey().defaultRandom(),
  followerId: uuid("follower_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // who follows
  followingId: uuid("following_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // who is being followed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const friendsRelations = relations(friends, ({ one }) => ({
  follower: one(users, {
    fields: [friends.followerId],
    references: [users.id],
    relationName: "followers",
  }),
  following: one(users, {
    fields: [friends.followingId],
    references: [users.id],
    relationName: "following",
  }),
}));
