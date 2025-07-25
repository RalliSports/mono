import { relations } from "drizzle-orm";
import { pgTable, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const roles = pgTable("roles", {
  id: varchar("id").primaryKey(),
  name: varchar("name"),
});

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));