CREATE TYPE "public"."access_status" AS ENUM('whitelisted', 'blacklisted');--> statement-breakpoint
CREATE TYPE "public"."type" AS ENUM('1v1', 'limited', 'unlimited');--> statement-breakpoint
CREATE TYPE "public"."user_control_type" AS ENUM('whitelist', 'blacklist', 'none');--> statement-breakpoint
CREATE TYPE "public"."predicted_direction" AS ENUM('higher', 'lower');--> statement-breakpoint
CREATE TABLE "athletes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar,
	"team" varchar,
	"position" varchar,
	"jersey_number" integer,
	"age" integer,
	"picture" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "game_access" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid,
	"user_id" varchar,
	"status" "access_status",
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "game_mode" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" varchar,
	"description" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "games" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar,
	"creator_id" text,
	"deposit_amount" numeric,
	"currency" varchar,
	"created_at" timestamp with time zone DEFAULT now(),
	"status" varchar,
	"max_participants" integer,
	"game_code" varchar,
	"matchup_group" varchar,
	"deposit_token" varchar,
	"isPrivate" boolean,
	"type" "type",
<<<<<<<< Updated upstream:packages/db/src/migrations/0000_parallel_jack_flag.sql
	"user_control_type" "user_control_type",
========
	"userControlType" "user_control_type",
>>>>>>>> Stashed changes:packages/db/src/migrations/0000_parched_zuras.sql
	"game_mode_id" uuid
);
--> statement-breakpoint
CREATE TABLE "matchup_performance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"matchup_id" uuid,
	"athlete_id" uuid,
	"stats" json
);
--> statement-breakpoint
CREATE TABLE "matchups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_date" date,
	"home_team" varchar,
	"away_team" varchar,
	"status" varchar,
	"score_home" integer,
	"score_away" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"game_id" uuid,
	"joined_at" timestamp with time zone DEFAULT now(),
	"is_winner" boolean
);
--> statement-breakpoint
CREATE TABLE "predictions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"participant_id" uuid,
	"line_id" uuid,
<<<<<<<< Updated upstream:packages/db/src/migrations/0000_parallel_jack_flag.sql
	"predicted_direction" "predicted_direction",
========
	"predicted_direction" varchar,
>>>>>>>> Stashed changes:packages/db/src/migrations/0000_parched_zuras.sql
	"is_correct" boolean,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar,
	"description" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar,
	"wallet_address" varchar,
	"created_at" timestamp with time zone,
	"role_id" uuid
);
--> statement-breakpoint
CREATE TABLE "lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"athlete_id" uuid,
	"stat_id" uuid,
	"matchup_id" uuid,
	"predicted_value" numeric,
	"actual_value" numeric,
	"is_higher" boolean,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "matchup_performance" ADD CONSTRAINT "matchup_performance_matchup_id_matchups_id_fk" FOREIGN KEY ("matchup_id") REFERENCES "public"."matchups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matchup_performance" ADD CONSTRAINT "matchup_performance_athlete_id_athletes_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_participant_id_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_line_id_lines_id_fk" FOREIGN KEY ("line_id") REFERENCES "public"."lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lines" ADD CONSTRAINT "lines_athlete_id_athletes_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lines" ADD CONSTRAINT "lines_stat_id_stats_id_fk" FOREIGN KEY ("stat_id") REFERENCES "public"."stats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lines" ADD CONSTRAINT "lines_matchup_id_matchups_id_fk" FOREIGN KEY ("matchup_id") REFERENCES "public"."matchups"("id") ON DELETE no action ON UPDATE no action;