import { relations } from "drizzle-orm";
import { pgTable, pgEnum, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const roleTypeEnum = pgEnum("role_type", ["admin", "user", "moderator"]);

export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: roleTypeEnum("role_type").default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));
