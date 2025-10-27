ALTER TABLE "lines" ADD COLUMN "odds_over" numeric;--> statement-breakpoint
ALTER TABLE "lines" ADD COLUMN "odds_under" numeric;--> statement-breakpoint
ALTER TABLE "lines" ADD COLUMN "is_latest_one" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "lines" ADD COLUMN "last_updated_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "lines" ADD COLUMN "resolved_at" timestamp with time zone;