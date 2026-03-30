-- Add missing review_notes column to applications table
alter table public.applications
add column if not exists review_notes text not null default '';
