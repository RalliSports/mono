-- 1) Create enums if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'league_type') THEN
    CREATE TYPE public.league_type AS ENUM ('NFL', 'NBA', 'MLB');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sport_type') THEN
    CREATE TYPE public.sport_type AS ENUM ('football', 'basketball', 'baseball');
  END IF;
END$$;

-- 2) Add columns only if not present (idempotent)
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS sport_type public.sport_type;
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS league_type public.league_type;

ALTER TABLE matchups ADD COLUMN IF NOT EXISTS sport_type public.sport_type;
ALTER TABLE matchups ADD COLUMN IF NOT EXISTS league_type public.league_type;

ALTER TABLE stats ADD COLUMN IF NOT EXISTS sport_type public.sport_type;
ALTER TABLE stats ADD COLUMN IF NOT EXISTS league_type public.league_type;

ALTER TABLE lines ADD COLUMN IF NOT EXISTS sport_type public.sport_type;
ALTER TABLE lines ADD COLUMN IF NOT EXISTS league_type public.league_type;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS sport_type public.sport_type;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS league_type public.league_type;
