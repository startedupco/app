-- Allow applicants to delete their own applications.
-- Apply manually in the Supabase SQL Editor.
-- Fixes: deleting an application in the portal previously had no effect
-- because no DELETE policy existed on public.applications.

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "applications_delete_own" ON public.applications;
CREATE POLICY "applications_delete_own"
    ON public.applications
    FOR DELETE
    USING (auth.uid()::text = "userId"::text);