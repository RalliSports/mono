ALTER TABLE "participants" ADD COLUMN "created_txn_signature" text;--> statement-breakpoint
ALTER TABLE "bets" ADD COLUMN "resolved_txn_signature" text;--> statement-breakpoint
ALTER TABLE "bets" DROP COLUMN "created_txn_signature";