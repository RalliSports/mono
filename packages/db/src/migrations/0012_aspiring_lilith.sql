ALTER TABLE "matchups" ADD COLUMN IF NOT EXISTS "odds_api_event_id" varchar;--> statement-breakpoint
ALTER TABLE "stats" ADD COLUMN IF NOT EXISTS "odds_api_stat_name" varchar;