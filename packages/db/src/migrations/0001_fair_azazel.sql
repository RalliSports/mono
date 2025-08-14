ALTER TABLE "users" ALTER COLUMN "has_been_fauceted_sol" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_address_unique" UNIQUE("email_address");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_para_user_id_unique" UNIQUE("para_user_id");