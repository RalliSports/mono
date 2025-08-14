CREATE TYPE "public"."matchup_status" AS ENUM('scheduled', 'in_progress', 'finished', 'cancelled');--> statement-breakpoint
ALTER TABLE "matchups" ALTER COLUMN "status" SET DATA TYPE "public"."matchup_status" USING "status"::"public"."matchup_status";--> statement-breakpoint
ALTER TABLE "athletes" ADD COLUMN "espn_athlete_id" varchar;--> statement-breakpoint
ALTER TABLE "matchups" ADD COLUMN "espn_event_id" varchar;--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "espn_team_id" varchar;