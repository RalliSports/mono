CREATE TYPE "public"."referral_status" AS ENUM('pending', 'completed');--> statement-breakpoint
CREATE TABLE "referral_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"code" varchar(12) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "referral_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "referrals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"referrer_code" varchar(12) NOT NULL,
	"referee_id" text,
	"status" "referral_status" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_address" varchar;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrer_code_referral_codes_code_fk" FOREIGN KEY ("referrer_code") REFERENCES "public"."referral_codes"("code") ON DELETE no action ON UPDATE no action;