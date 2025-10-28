CREATE TYPE "public"."game_status" AS ENUM('waiting', 'locked', 'completed', 'cancelled');--> statement-breakpoint
ALTER TYPE "public"."type" RENAME TO "game_type";--> statement-breakpoint
ALTER TABLE "games" RENAME COLUMN "isPrivate" TO "is_private";--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "status" SET DATA TYPE "public"."game_status" USING "status"::"public"."game_status";--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "current_participants" integer;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "locked_at" timestamp with time zone;