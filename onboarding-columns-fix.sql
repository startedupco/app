-- onboarding-columns-fix.sql
-- Run this in Supabase Dashboard -> SQL Editor.
--
-- WHY: onboarding.html saves { totalAps, docsReady, studyTypes, fieldOfInterest,
-- needsNsfas } onto the users row. These columns did not exist, so PostgREST
-- rejected the WHOLE upsert with PGRST204 ("column does not exist") and the
-- profile stayed empty in the portal. Safe to re-run.

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "totalAps" INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "docsReady" JSONB DEFAULT '[]';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "studyTypes" JSONB DEFAULT '[]';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "fieldOfInterest" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "needsNsfas" BOOLEAN DEFAULT false;
