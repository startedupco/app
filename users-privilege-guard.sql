-- Run once in the Supabase SQL Editor.
-- Blocks self-service changes to role/status/plan on public.users.
-- Without this an applicant can PATCH their own role to 'staff' through the
-- anon key and bypass the portal onboarding gate.
-- Direct SQL (Supabase SQL Editor) and the service role are unaffected, so
-- staff roles can still be assigned manually.

CREATE OR REPLACE FUNCTION public.users_guard_privileges()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- auth.role() is NULL for direct SQL (SQL Editor); service role is trusted.
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