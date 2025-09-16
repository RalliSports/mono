ALTER TABLE "tokens" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "tokens" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "tokens" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "token_id" uuid;--> statement-breakpoint
ALTER TABLE "games" DROP COLUMN "currency";--> statement-breakpoint
ALTER TABLE "games" DROP COLUMN "deposit_token";