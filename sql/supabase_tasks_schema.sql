-- Supabase / Postgres schema for tasks table
-- Option A: numeric primary key (client-generated or server-side sequence)

-- Create extension for UUID generation if you prefer UUIDs
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Option 1: Bigint id (recommended if you keep client-generated numeric ids)
CREATE TABLE IF NOT EXISTS public.tasks (
  id bigint PRIMARY KEY,
  title text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Option 2: UUID primary key (if you prefer server-generated or client UUIDs)
-- CREATE TABLE IF NOT EXISTS public.tasks (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   title text NOT NULL,
--   completed boolean NOT NULL DEFAULT false,
--   notes text,
--   created_at timestamptz NOT NULL DEFAULT now(),
--   updated_at timestamptz NOT NULL DEFAULT now()
-- );

-- Trigger function to keep updated_at in sync
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_updated_at ON public.tasks;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Index for filtering completed/pending quickly
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON public.tasks (completed);

-- Example: grant access to anon role (adjust for your security requirements)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO anon;

-- Notes:
-- - If you use Option 1 (bigint id) and generate ids client-side, ensure uniqueness (timestamp+rand) or use a server sequence.
-- - If you switch to server-generated ids, update the client to read inserted row ids and sync them into local state.
