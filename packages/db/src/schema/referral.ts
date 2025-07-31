import { pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const referralStatusEnum = pgEnum("referral_status", [
  "pending",
  "completed",
]);

export const referralCodes = pgTable("referral_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id"),
  code: varchar("code", { length: 12 }).unique().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const referrals = pgTable("referrals", {
  id: uuid("id").primaryKey().defaultRandom(),
  referrerCode: varchar("referrer_code", { length: 12 })
    .notNull()
    .references(() => referralCodes.code),
  refereeId: text("referee_id"),
  status: referralStatusEnum("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});
