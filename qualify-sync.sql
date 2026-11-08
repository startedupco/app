-- Run this in Supabase Dashboard -> SQL Editor.
--
-- WHY: qualify.html (the school-report scanner) stored the scanned subject
-- marks, the computed APS and the matched course shortlist in localStorage
-- only, so none of it followed the account to another device. These columns
-- put them on the users row. Safe to re-run.
--
-- Until this has been run, the client keeps writing the local copy and the
-- direct upsert silently drops just these columns (PostgREST PGRST204), so
-- nothing else breaks.

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "qualifyMarks" JSONB DEFAULT '[]';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "qualifyCourses" JSONB DEFAULT '[]';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "qualifyAps" INTEGER DEFAULT 0;
