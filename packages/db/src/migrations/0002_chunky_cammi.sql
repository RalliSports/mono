CREATE TABLE "bets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"participant_id" uuid,
	"line_id" uuid,
	"game_id" uuid,
	"predicted_direction" "predicted_direction",
	"is_correct" boolean,
	"created_at" timestamp DEFAULT now(),
	"created_txn_signature" text
);
--> statement-breakpoint
DROP TABLE "predictions" CASCADE;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "created_txn_signature" text;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "resolved_txn_signature" text;--> statement-breakpoint
ALTER TABLE "lines" ADD COLUMN "created_txn_signature" text;--> statement-breakpoint
ALTER TABLE "lines" ADD COLUMN "resolved_txn_signature" text;--> statement-breakpoint
ALTER TABLE "bets" ADD CONSTRAINT "bets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bets" ADD CONSTRAINT "bets_participant_id_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bets" ADD CONSTRAINT "bets_line_id_lines_id_fk" FOREIGN KEY ("line_id") REFERENCES "public"."lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bets" ADD CONSTRAINT "bets_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" DROP COLUMN "txn_id";