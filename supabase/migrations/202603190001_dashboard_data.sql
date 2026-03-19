-- Migration: 202603190001_dashboard_data.sql
-- Description: Adds tables for milestones, mentor sessions, impact metrics, funding records, placements, and announcements.

-- 1. Milestones
create table if not exists public.milestones (
    id uuid primary key default gen_random_uuid(),
    scholar_id uuid not null references public.profiles (id) on delete cascade,
    title text not null,
    category text not null check (category in ('course completion', 'internships', 'research', 'leadership', 'national service')),
    status text not null default 'upcoming' check (status in ('completed', 'active', 'upcoming')),
    due_date timestamptz not null,
    impact_description text,
    evidence_url text,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

-- 2. Mentor Sessions
create table if not exists public.mentor_sessions (
    id uuid primary key default gen_random_uuid(),
    scholar_id uuid not null references public.profiles (id) on delete cascade,
    mentor_id uuid references public.profiles (id) on delete set null,
    date timestamptz not null default timezone('utc', now()),
    theme text not null,
    sentiment text not null check (sentiment in ('Strong', 'Positive', 'Watch')),
    summary text not null,
    strengths text[] default '{}',
    action_items text[] default '{}',
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

-- 3. Impact Metrics
create table if not exists public.impact_metrics (
    id uuid primary key default gen_random_uuid(),
    scholar_id uuid references public.profiles (id) on delete cascade,
    label text not null,
    value text not null,
    unit text,
    description text,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

-- 4. Funding Records
create table if not exists public.funding_records (
    id uuid primary key default gen_random_uuid(),
    scholar_id uuid references public.profiles (id) on delete cascade,
    sponsor_id uuid references public.profiles (id) on delete set null,
    program_id uuid references public.programs (id) on delete set null,
    amount numeric(14, 2) not null,
    type text not null check (type in ('commitment', 'disbursement', 'stipend')),
    status text not null default 'pending' check (status in ('pending', 'completed', 'flagged')),
    reference text,
    date timestamptz not null default timezone('utc', now()),
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

-- 5. Placements
create table if not exists public.placements (
    id uuid primary key default gen_random_uuid(),
    scholar_id uuid references public.profiles (id) on delete cascade,
    organization_name text not null,
    role text not null,
    status text not null default 'upcoming' check (status in ('active', 'completed', 'upcoming')),
    location text,
    start_date timestamptz,
    end_date timestamptz,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

-- 6. Announcements
create table if not exists public.announcements (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    body text not null,
    summary text,
    author_id uuid references public.profiles (id) on delete set null,
    priority text not null default 'Medium' check (priority in ('High', 'Medium', 'Low')),
    audience text not null default 'all' check (audience in ('all', 'scholars', 'reviewers', 'applicants', 'donors')),
    is_pinned boolean not null default false,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

-- RLS Policies
alter table public.milestones enable row level security;
alter table public.mentor_sessions enable row level security;
alter table public.impact_metrics enable row level security;
alter table public.funding_records enable row level security;
alter table public.placements enable row level security;
alter table public.announcements enable row level security;

-- Policies for scholars
create policy "Scholars can view their own milestones" on public.milestones for select using (auth.uid() = scholar_id);
create policy "Scholars can view their own mentor sessions" on public.mentor_sessions for select using (auth.uid() = scholar_id);
create policy "Scholars can view their own impact metrics" on public.impact_metrics for select using (auth.uid() = scholar_id or scholar_id is null);
create policy "Scholars can view their own funding records" on public.funding_records for select using (auth.uid() = scholar_id);
create policy "Scholars can view their own placements" on public.placements for select using (auth.uid() = scholar_id);
create policy "Scholars can view announcements" on public.announcements for select using (true);

-- Update Triggers
create trigger milestones_set_updated_at before update on public.milestones for each row execute function public.set_updated_at();
create trigger mentor_sessions_set_updated_at before update on public.mentor_sessions for each row execute function public.set_updated_at();
create trigger impact_metrics_set_updated_at before update on public.impact_metrics for each row execute function public.set_updated_at();
create trigger funding_records_set_updated_at before update on public.funding_records for each row execute function public.set_updated_at();
create trigger placements_set_updated_at before update on public.placements for each row execute function public.set_updated_at();
create trigger announcements_set_updated_at before update on public.announcements for each row execute function public.set_updated_at();
