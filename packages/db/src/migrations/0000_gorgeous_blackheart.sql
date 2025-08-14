CREATE TYPE "public"."access_status" AS ENUM('whitelisted', 'blacklisted');--> statement-breakpoint
CREATE TYPE "public"."type" AS ENUM('1v1', 'limited', 'unlimited');--> statement-breakpoint
CREATE TYPE "public"."user_control_type" AS ENUM('whitelist', 'blacklist', 'none');--> statement-breakpoint
CREATE TYPE "public"."matchup_status" AS ENUM('scheduled', 'in_progress', 'finished', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."predicted_direction" AS ENUM('over', 'under');--> statement-breakpoint
CREATE TYPE "public"."role_type" AS ENUM('admin', 'user', 'moderator');--> statement-breakpoint
CREATE TYPE "public"."referral_status" AS ENUM('pending', 'completed');--> statement-breakpoint
CREATE TABLE "athletes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"custom_id" serial NOT NULL,
	"espn_athlete_id" varchar,
	"name" varchar,
	"position" varchar,
	"jersey_number" integer,
	"age" integer,
	"picture" varchar,
	"team_id" uuid,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "athletes_custom_id_unique" UNIQUE("custom_id")
);
--> statement-breakpoint
CREATE TABLE "game_access" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid,
	"user_id" uuid,
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
	"creator_id" uuid,
	"deposit_amount" numeric,
	"currency" varchar,
	"created_at" timestamp with time zone DEFAULT now(),
	"status" varchar,
	"max_participants" integer,
	"num_bets" integer,
	"game_code" varchar,
	"matchup_group" varchar,
	"deposit_token" varchar,
	"isPrivate" boolean,
	"type" "type",
	"user_control_type" "user_control_type",
	"game_mode_id" uuid,
	"created_txn_signature" text,
	"resolved_txn_signature" text
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
	"espn_event_id" varchar,
	"game_date" date,
	"starts_at" timestamp,
	"status" "matchup_status",
	"score_home" integer,
	"score_away" integer,
	"home_team_id" uuid,
	"away_team_id" uuid,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"game_id" uuid,
	"joined_at" timestamp with time zone DEFAULT now(),
	"is_winner" boolean
);
--> statement-breakpoint
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
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role_type" "role_type" DEFAULT 'user',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"custom_id" integer NOT NULL,
	"name" varchar,
	"description" varchar,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "stats_custom_id_unique" UNIQUE("custom_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text,
	"last_name" text,
	"username" text,
	"avatar" text,
	"wallet_address" varchar,
	"email_address" varchar,
	"para_user_id" text,
	"has_been_fauceted_sol" boolean,
	"created_at" timestamp with time zone DEFAULT now()
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
	"created_at" timestamp DEFAULT now(),
	"starts_at" timestamp,
	"created_txn_signature" text,
	"resolved_txn_signature" text
);
--> statement-breakpoint
CREATE TABLE "referral_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"code" varchar(12) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "referral_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "referrals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"referrer_code" varchar(12) NOT NULL,
	"referee_id" uuid,
	"status" "referral_status" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"espn_team_id" varchar,
	"name" varchar(100) NOT NULL,
	"city" varchar(100) NOT NULL,
	"country" varchar(100) NOT NULL,
	"founded_year" integer,
	"coach_name" varchar(100),
	"avatar" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"abbreviation" varchar(3)
);
--> statement-breakpoint
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matchup_performance" ADD CONSTRAINT "matchup_performance_matchup_id_matchups_id_fk" FOREIGN KEY ("matchup_id") REFERENCES "public"."matchups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matchup_performance" ADD CONSTRAINT "matchup_performance_athlete_id_athletes_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matchups" ADD CONSTRAINT "matchups_home_team_id_teams_id_fk" FOREIGN KEY ("home_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matchups" ADD CONSTRAINT "matchups_away_team_id_teams_id_fk" FOREIGN KEY ("away_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bets" ADD CONSTRAINT "bets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bets" ADD CONSTRAINT "bets_participant_id_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bets" ADD CONSTRAINT "bets_line_id_lines_id_fk" FOREIGN KEY ("line_id") REFERENCES "public"."lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bets" ADD CONSTRAINT "bets_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lines" ADD CONSTRAINT "lines_athlete_id_athletes_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lines" ADD CONSTRAINT "lines_stat_id_stats_id_fk" FOREIGN KEY ("stat_id") REFERENCES "public"."stats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lines" ADD CONSTRAINT "lines_matchup_id_matchups_id_fk" FOREIGN KEY ("matchup_id") REFERENCES "public"."matchups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrer_code_referral_codes_code_fk" FOREIGN KEY ("referrer_code") REFERENCES "public"."referral_codes"("code") ON DELETE no action ON UPDATE no action;