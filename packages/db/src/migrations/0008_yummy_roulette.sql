CREATE TABLE "tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"ticker" varchar NOT NULL,
	"mint" varchar NOT NULL,
	"cluster" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
