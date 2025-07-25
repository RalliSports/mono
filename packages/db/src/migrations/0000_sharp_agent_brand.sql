CREATE TYPE "public"."accessStatus" AS ENUM('whitelisted', 'blacklisted');--> statement-breakpoint
CREATE TYPE "public"."type" AS ENUM('1v1', 'limited', 'unlimited');--> statement-breakpoint
CREATE TYPE "public"."user_control_type" AS ENUM('whitelist', 'blacklist', 'none');--> statement-breakpoint
CREATE TABLE "athletes" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar,
	"team" varchar,
	"position" varchar,
	"jersey_number" integer,
	"age" integer,
	"picture" varchar
);
--> statement-breakpoint
CREATE TABLE "game_access" (
	"id" varchar PRIMARY KEY NOT NULL,
	"game_id" varchar,
	"user_id" varchar,
	"accessStatus" "accessStatus"
);
--> statement-breakpoint
CREATE TABLE "game_mode" (
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar,
	"description" varchar
);
--> statement-breakpoint
CREATE TABLE "games" (
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar,
	"creator_id" varchar,
	"deposit_amount" numeric,
	"currency" varchar,
	"created_at" timestamp with time zone,
	"invite_link" varchar,
	"status" varchar,
	"max_participants" integer,
	"game_code" varchar,
	"matchup_group" varchar,
	"deposit_token" varchar,
	"isPrivate" boolean,
	"type" "type",
	"game_access_id" varchar,
	"user_control_type" "user_control_type",
	"game_mode_id" varchar
);
--> statement-breakpoint
CREATE TABLE "matchup_performance" (
	"id" varchar PRIMARY KEY NOT NULL,
	"matchup_id" varchar,
	"athlete_id" varchar,
	"stats" json
);
--> statement-breakpoint
CREATE TABLE "matchups" (
	"id" varchar PRIMARY KEY NOT NULL,
	"game_date" date,
	"home_team" varchar,
	"away_team" varchar,
	"status" varchar,
	"score_home" integer,
	"score_away" integer
);
--> statement-breakpoint
CREATE TABLE "participants" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"game_id" varchar,
	"joined_at" timestamp with time zone,
	"is_winner" boolean
);
--> statement-breakpoint
CREATE TABLE "predictions" (
	"id" varchar PRIMARY KEY NOT NULL,
	"participant_id" varchar,
	"athlete_id" varchar,
	"stat_id" varchar,
	"matchup_id" varchar,
	"predicted_direction" varchar,
	"predicted_value" numeric,
	"actual_value" numeric,
	"is_correct" boolean
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar
);
--> statement-breakpoint
CREATE TABLE "stats" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar,
	"description" varchar
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"username" varchar,
	"wallet_address" varchar,
	"created_at" timestamp with time zone,
	"role_id" varchar
);
--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_game_mode_id_game_mode_id_fk" FOREIGN KEY ("game_mode_id") REFERENCES "public"."game_mode"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matchup_performance" ADD CONSTRAINT "matchup_performance_matchup_id_matchups_id_fk" FOREIGN KEY ("matchup_id") REFERENCES "public"."matchups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matchup_performance" ADD CONSTRAINT "matchup_performance_athlete_id_athletes_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_participant_id_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_athlete_id_athletes_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_stat_id_stats_id_fk" FOREIGN KEY ("stat_id") REFERENCES "public"."stats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_matchup_id_matchups_id_fk" FOREIGN KEY ("matchup_id") REFERENCES "public"."matchups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;