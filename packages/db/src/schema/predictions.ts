import { pgTable,pgEnum, boolean, timestamp } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { participants } from "./participants";
import { lines } from "./lines";
import { relations } from "drizzle-orm";

export const predictedDirectionEnum = pgEnum("predicted_direction", [
  "higher",
  "lower",
]);

export const predictions = pgTable("predictions", {
  id: uuid("id").primaryKey().defaultRandom(),
  participantId: uuid("participant_id").references(() => participants.id),
  lineId: uuid("line_id").references(() => lines.id),
  predictedDirection: predictedDirectionEnum("predicted_direction"),
  isCorrect: boolean("is_correct"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const predictionsRelations = relations(predictions, ({ one }) => ({
  participant: one(participants, {
    fields: [predictions.participantId],
    references: [participants.id],
  }),
  line: one(lines, {
    fields: [predictions.lineId],
    references: [lines.id],
  }),
}));
