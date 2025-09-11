DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'matchups' 
        AND column_name = 'odds_api_event_id'
    ) THEN
        ALTER TABLE "matchups" ADD COLUMN "odds_api_event_id" varchar;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'stats' 
        AND column_name = 'odds_api_stat_name'
    ) THEN
        ALTER TABLE "stats" ADD COLUMN "odds_api_stat_name" varchar;
    END IF;
END $$;