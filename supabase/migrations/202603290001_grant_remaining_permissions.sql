-- Grant select access for programs and profiles to authenticated users.
-- RLS policies still determine which rows are actually visible.

grant usage on schema public to authenticated;

grant select
on table public.programs
to authenticated;

grant select
on table public.profiles
to authenticated;

grant select
on table public.donor_details
to authenticated;

grant select
on table public.funding_records
to authenticated;

grant select
on table public.milestones
to authenticated;

grant select
on table public.placements
to authenticated;

grant select
on table public.announcements
to authenticated;
