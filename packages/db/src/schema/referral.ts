import { relations } from "drizzle-orm";
import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const referralStatusEnum = pgEnum("referral_status", [
  "pending",
  "completed",
]);

export const referralCodes = pgTable("referral_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
  code: varchar("code", { length: 12 }).unique().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const referralCodesRelations = relations(
  referralCodes,
  ({ one, many }) => ({
    user: one(users, {
      fields: [referralCodes.userId],
      references: [users.id],
    }),
  })
);

export const referrals = pgTable("referrals", {
  id: uuid("id").primaryKey().defaultRandom(),
  referrerCode: varchar("referrer_code", { length: 12 })
    .notNull()
    .references(() => referralCodes.code),
  refereeId: uuid("referee_id"),
  status: referralStatusEnum("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const referralRelations = relations(referrals, ({ one }) => ({
  referee: one(users, {
    fields: [referrals.refereeId],
    references: [users.id],
  }),
}));
