-- Migration: 202603190003_donor_program_cohort_details.sql
-- Description: Adds detailed tables for donor management, program performance, and cohort tracking.

-- 1. Donor Details
-- This table stores specific information for users with role='donor' (sponsors).
create table if not exists public.donor_details (
    id uuid primary key references public.profiles (id) on delete cascade,
    category text, -- e.g., 'Private foundation', 'Sector foundation'
    commitment numeric(14, 2), -- Total financial commitment
    investment_focus text, -- e.g., 'STEM scholarships', 'Healthcare delivery'
    reporting_cadence text default 'Quarterly',
    renewal_window text, -- e.g., 'September 2026'
    status text not null default 'Active' check (status in ('Active', 'Renewal due', 'At risk')),
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

-- 2. Program Details
-- Adding more operational columns to the existing programs table.
alter table public.programs add column if not exists program_lead text;
alter table public.programs add column if not exists campuses text[] default '{}';
alter table public.programs add column if not exists total_budget numeric(14, 2) default 0;
alter table public.programs add column if not exists status text default 'active' check (status in ('active', 'upcoming', 'archived'));
alter table public.programs add column if not exists completion_rate numeric(5, 2) default 0;
alter table public.programs add column if not exists placement_rate numeric(5, 2) default 0;

-- 3. Cohorts
-- Formalizing cohort management.
create table if not exists public.cohorts (
    id uuid primary key default gen_random_uuid(),
    program_id uuid references public.programs (id) on delete cascade,
    year integer not null,
    phase text, -- e.g., 'In-programme', 'Selection and onboarding'
    applicants_count integer default 0,
    active_scholars_count integer default 0,
    review_completion_percentage numeric(5, 2) default 0,
    funding_released numeric(14, 2) default 0,
    readiness_status text, -- e.g., 'Final placement wrap-up'
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    unique(program_id, year)
);

-- 4. Enable RLS and add policies
alter table public.donor_details enable row level security;
alter table public.cohorts enable row level security;

-- Policies for admins (assuming we'll have more specific ones later, for now simple admin check)
create policy "Admins can manage donor_details" on public.donor_details for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy "Admins can manage cohorts" on public.cohorts for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Policies for public/authenticated viewing where appropriate
create policy "Authenticated users can view donor_details" on public.donor_details for select using (auth.role() = 'authenticated');
create policy "Authenticated users can view cohorts" on public.cohorts for select using (auth.role() = 'authenticated');

-- Update Triggers
create trigger donor_details_set_updated_at before update on public.donor_details for each row execute function public.set_updated_at();
create trigger cohorts_set_updated_at before update on public.cohorts for each row execute function public.set_updated_at();

-- Sample Data (Commented out for the user to run)
/*
INSERT INTO public.programs (name, program_lead, campuses, total_budget, status, completion_rate, placement_rate)
VALUES 
('Technology & Software Engineering', 'Programme Office West', '{"Lagos", "Abuja"}', 1420000000, 'active', 95.0, 93.0),
('Healthcare Delivery Systems', 'Programme Office Central', '{"Abuja", "Ibadan", "Enugu"}', 1180000000, 'active', 92.0, 90.0);

INSERT INTO public.cohorts (program_id, year, phase, applicants_count, active_scholars_count, review_completion_percentage, funding_released, readiness_status)
SELECT id, 2024, 'In-programme', 512, 236, 94.0, 1080000000, 'Milestone review in April'
FROM public.programs WHERE name = 'Technology & Software Engineering';
*/
