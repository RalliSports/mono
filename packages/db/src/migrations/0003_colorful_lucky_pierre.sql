ALTER TABLE "athletes" ADD COLUMN "custom_id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_custom_id_unique" UNIQUE("custom_id");