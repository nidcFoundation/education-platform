create extension if not exists pgcrypto;

do $$
begin
    if not exists (
        select 1
        from pg_type
        where typname = 'app_role'
    ) then
        create type public.app_role as enum (
            'applicant',
            'donor',
            'scholar',
            'admin',
            'reviewer',
            'partner'
        );
    end if;
end $$;

create table if not exists public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    email text not null unique,
    first_name text not null,
    last_name text not null,
    phone text,
    state_of_origin text,
    role public.app_role not null default 'applicant',
    account_type public.app_role not null default 'applicant',
    status text not null default 'active',
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.programs (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    title text not null,
    description text not null,
    focus_area text not null,
    lead text,
    location text,
    duration text,
    capacity integer not null default 0,
    active_scholars_count integer not null default 0,
    completion_rate numeric(5, 2) not null default 0,
    placement_rate numeric(5, 2) not null default 0,
    budget numeric(14, 2),
    status text not null default 'active',
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.cohorts (
    id uuid primary key default gen_random_uuid(),
    year integer not null unique,
    phase text not null,
    applicants_count integer not null default 0,
    active_scholars_count integer not null default 0,
    review_completion numeric(5, 2) not null default 0,
    funding_released numeric(14, 2),
    readiness text not null default 'planned',
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.applications (
    id uuid primary key default gen_random_uuid(),
    applicant_id uuid not null references public.profiles (id) on delete cascade,
    cohort_id uuid references public.cohorts (id) on delete set null,
    program_id uuid references public.programs (id) on delete set null,
    status text not null default 'draft',
    current_step integer not null default 1,
    personal_info jsonb not null default '{}'::jsonb,
    academic_background jsonb not null default '{}'::jsonb,
    essays jsonb not null default '{}'::jsonb,
    submitted_at timestamptz,
    last_saved_at timestamptz not null default timezone('utc', now()),
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = timezone('utc', now());
    return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists programs_set_updated_at on public.programs;
create trigger programs_set_updated_at
before update on public.programs
for each row
execute function public.set_updated_at();

drop trigger if exists cohorts_set_updated_at on public.cohorts;
create trigger cohorts_set_updated_at
before update on public.cohorts
for each row
execute function public.set_updated_at();

drop trigger if exists applications_set_updated_at on public.applications;
create trigger applications_set_updated_at
before update on public.applications
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (
        id,
        email,
        first_name,
        last_name,
        phone,
        state_of_origin,
        role,
        account_type
    )
    values (
        new.id,
        coalesce(new.email, ''),
        coalesce(new.raw_user_meta_data ->> 'first_name', ''),
        coalesce(new.raw_user_meta_data ->> 'last_name', ''),
        new.raw_user_meta_data ->> 'phone',
        new.raw_user_meta_data ->> 'state_of_origin',
        coalesce((new.raw_user_meta_data ->> 'role')::public.app_role, 'applicant'::public.app_role),
        coalesce((new.raw_user_meta_data ->> 'account_type')::public.app_role, 'applicant'::public.app_role)
    )
    on conflict (id) do update
    set
        email = excluded.email,
        first_name = excluded.first_name,
        last_name = excluded.last_name,
        phone = excluded.phone,
        state_of_origin = excluded.state_of_origin,
        role = excluded.role,
        account_type = excluded.account_type;

    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.programs enable row level security;
alter table public.cohorts enable row level security;
alter table public.applications enable row level security;

drop policy if exists "Profiles are viewable by the signed-in owner" on public.profiles;
create policy "Profiles are viewable by the signed-in owner"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "Profiles are updatable by the signed-in owner" on public.profiles;
create policy "Profiles are updatable by the signed-in owner"
on public.profiles
for update
using (auth.uid() = id);

drop policy if exists "Programs are publicly readable" on public.programs;
create policy "Programs are publicly readable"
on public.programs
for select
using (true);

drop policy if exists "Cohorts are publicly readable" on public.cohorts;
create policy "Cohorts are publicly readable"
on public.cohorts
for select
using (true);

drop policy if exists "Applications are viewable by the signed-in owner" on public.applications;
create policy "Applications are viewable by the signed-in owner"
on public.applications
for select
using (auth.uid() = applicant_id);

drop policy if exists "Applications are insertable by the signed-in owner" on public.applications;
create policy "Applications are insertable by the signed-in owner"
on public.applications
for insert
with check (auth.uid() = applicant_id);

drop policy if exists "Applications are updatable by the signed-in owner" on public.applications;
create policy "Applications are updatable by the signed-in owner"
on public.applications
for update
using (auth.uid() = applicant_id);
