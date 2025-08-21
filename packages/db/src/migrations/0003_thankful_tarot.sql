CREATE TYPE "public"."line_status" AS ENUM('open', 'locked', 'resolved', 'cancelled');--> statement-breakpoint
ALTER TABLE "lines" ADD COLUMN "status" "line_status" DEFAULT 'open';