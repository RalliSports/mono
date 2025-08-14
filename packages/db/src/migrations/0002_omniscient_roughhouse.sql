ALTER TABLE "matchups" ALTER COLUMN "status" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "athletes" DROP COLUMN "espn_athlete_id";--> statement-breakpoint
ALTER TABLE "matchups" DROP COLUMN "espn_event_id";--> statement-breakpoint
ALTER TABLE "teams" DROP COLUMN "espn_team_id";--> statement-breakpoint
DROP TYPE "public"."matchup_status";