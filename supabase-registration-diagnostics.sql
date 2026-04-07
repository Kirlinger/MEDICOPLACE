-- MEDICOPLACE production registration diagnostics
-- Run in Supabase SQL editor for production verification.

-- 1) Confirm users table exists
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'users';

-- 2) Confirm core schema columns exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'users'
ORDER BY ordinal_position;

-- 3) Confirm policies/RLS state for users table
SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'users';

SELECT relname AS table_name, relrowsecurity AS rls_enabled, relforcerowsecurity AS rls_forced
FROM pg_class
WHERE relname = 'users';

-- 4) TEMPORARY RLS disable for registration test (re-enable immediately after test)
-- ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 5) Re-enable RLS after test
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
