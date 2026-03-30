-- Restore PostgREST select access for cohorts.
-- RLS policies still determine which rows are visible.

grant usage on schema public to authenticated;

grant select
on table public.cohorts
to authenticated;
