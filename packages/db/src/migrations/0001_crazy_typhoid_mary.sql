ALTER TABLE "predictions" DROP CONSTRAINT "predictions_participant_id_participants_id_fk";
--> statement-breakpoint
ALTER TABLE "predictions" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "predictions" DROP COLUMN "participant_id";