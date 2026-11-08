-- Run this in Supabase Dashboard -> SQL Editor.
--
-- WHY: the applicant site no longer keeps any application data on the device.
-- Theme, push, assistant, the AI-check throttle, avatar shuffle and the
-- notification baseline now follow the account instead of localStorage.
-- Idempotent - safe to re-run.

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "theme" TEXT DEFAULT 'light';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "pushEnabled" BOOLEAN DEFAULT true;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "pushSeenAt" BIGINT DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "assistantEnabled" BOOLEAN DEFAULT true;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "lastAiCheck" BIGINT DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "avatarSalt" INTEGER DEFAULT 0;
