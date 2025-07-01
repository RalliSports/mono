CREATE TYPE "public"."parlayStatus" AS ENUM('open', 'closed', 'settled');--> statement-breakpoint
CREATE TABLE "parlay_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pool_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"score" numeric DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "legs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entry_id" uuid NOT NULL,
	"player_id" text NOT NULL,
	"stat_type" varchar(50) NOT NULL,
	"line" numeric NOT NULL,
	"bet_type" varchar(10) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parlays" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entry_amount" numeric NOT NULL,
	"status" "parlayStatus" NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "parlay_entries" ADD CONSTRAINT "parlay_entries_pool_id_parlays_id_fk" FOREIGN KEY ("pool_id") REFERENCES "public"."parlays"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legs" ADD CONSTRAINT "legs_entry_id_parlay_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."parlay_entries"("id") ON DELETE cascade ON UPDATE no action;