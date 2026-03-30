-- Allow admins and reviewers to read applicant profiles and applications.

create or replace function public.is_admin_or_reviewer()
returns boolean
language sql
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.profiles
        where id = auth.uid()
          and role in ('admin'::public.app_role, 'reviewer'::public.app_role)
    );
$$;

revoke all on function public.is_admin_or_reviewer() from public;
grant execute on function public.is_admin_or_reviewer() to authenticated;

drop policy if exists "Admins and reviewers can view all profiles" on public.profiles;
create policy "Admins and reviewers can view all profiles"
on public.profiles
for select
using (public.is_admin_or_reviewer());

drop policy if exists "Admins and reviewers can view all applications" on public.applications;
create policy "Admins and reviewers can view all applications"
on public.applications
for select
using (public.is_admin_or_reviewer());
