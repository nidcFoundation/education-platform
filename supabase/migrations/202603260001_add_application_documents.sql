-- Store applicant document uploads on the application record.

alter table public.applications
add column if not exists documents jsonb not null default '[]'::jsonb;
