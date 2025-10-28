ALTER TABLE "games" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."game_status";--> statement-breakpoint
CREATE TYPE "public"."game_status" AS ENUM('waiting', 'in_progress', 'completed', 'cancelled', 'expired');--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "status" SET DATA TYPE "public"."game_status" USING "status"::"public"."game_status";