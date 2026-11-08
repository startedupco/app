-- ============================================================================
-- public.users - full column scheme
-- Run in Supabase Dashboard -> SQL Editor. Idempotent: every statement is
-- ADD COLUMN IF NOT EXISTS, so it is safe to re-run any time.
--
-- `id` (UUID PK) and `email` (TEXT UNIQUE NOT NULL) are intentionally absent
-- below - they are created with the table and must already exist.
-- ============================================================================

-- ---- Account ----
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "role" TEXT DEFAULT 'applicant';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'active';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "plan" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "phone" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMPTZ DEFAULT NOW();

-- ---- Identity ----
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "name" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "middleName" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "surname" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "title" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "full_name" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "avatar" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "avatarSeed" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "avatarStyle" TEXT DEFAULT '';

-- ---- Onboarding / profile ----
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "idNumber" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "dob" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "gender" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "populationGroup" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "disability" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "homeLanguage" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "additionalLanguage" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "street" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "suburb" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "city" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "province" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "postalCode" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "currentStatus" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "onboardingComplete" BOOLEAN DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "onboarding" BOOLEAN DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "onboarded" BOOLEAN DEFAULT false;

-- ---- Next of kin ----
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "nokTitle" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "nokFirstName" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "nokLastName" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "nokRelationship" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "nokIdNumber" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "nokPhone" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "nokEmail" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "nokMaritalStatus" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "nokEmployment" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "nokEmployer" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "nokJobTitle" TEXT DEFAULT '';

-- ---- Education ----
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "school" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "grade" INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "startYear" INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "completedYear" INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "isUpgrading" BOOLEAN DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "isRewriting" BOOLEAN DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "marks" JSONB DEFAULT '[]';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "qualifications" JSONB DEFAULT '[]';

-- ---- Study preferences (onboarding) ----
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "studyTypes" JSONB DEFAULT '[]';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "fieldOfInterest" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "needsNsfas" BOOLEAN DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "totalAps" INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "docsReady" JSONB DEFAULT '[]';

-- ---- Report scanner (qualify.html) ----
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "qualifyMarks" JSONB DEFAULT '[]';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "qualifyCourses" JSONB DEFAULT '[]';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "qualifyAps" INTEGER DEFAULT 0;

-- ---- Money / saved content ----
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "nsfasCycle" TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "bursaries" JSONB DEFAULT '{}';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "accounts" JSONB DEFAULT '[]';

-- ---- Device-free preferences (no localStorage) ----
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "theme" TEXT DEFAULT 'light';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "pushEnabled" BOOLEAN DEFAULT true;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "pushSeenAt" BIGINT DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "assistantEnabled" BOOLEAN DEFAULT true;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "lastAiCheck" BIGINT DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "avatarSalt" INTEGER DEFAULT 0;

-- ============================================================================
-- RLS (already applied in fix-everything.sql / supabase-schema.sql - listed
-- here only so this file is self-contained if the table is ever recreated)
-- ============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_select_own" ON public.users;
CREATE POLICY "users_select_own" ON public.users FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "users_insert_own" ON public.users;
CREATE POLICY "users_insert_own" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "users_update_own" ON public.users;
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = id);

-- ============================================================================
-- Privilege guard. RLS is row-level only, so users_update_own on its own would
-- let a signed-in applicant change their own role to 'staff' and skip the
-- onboarding gate. role/status/plan are service-role-only values (direct SQL
-- from the SQL Editor and the service role are unaffected).
-- ============================================================================
CREATE OR REPLACE FUNCTION public.users_guard_privileges()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF auth.role() IS NULL OR auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW.role IS NULL OR NEW.role NOT IN ('applicant', 'student') THEN
      NEW.role := 'applicant';
    END IF;
    NEW.status := 'active';
    NEW.plan := COALESCE(NEW.plan, '');
  ELSE
    IF NEW.role IS DISTINCT FROM OLD.role
       AND COALESCE(NEW.role, '') NOT IN ('applicant', 'student') THEN
      NEW.role := OLD.role;
    END IF;
    NEW.status := OLD.status;
    NEW.plan := OLD.plan;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS users_guard_privileges ON public.users;
CREATE TRIGGER users_guard_privileges
BEFORE INSERT OR UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.users_guard_privileges();
