-- Migration: 202603190002_academic_and_admin_data.sql
-- Description: Adds tables for courses, academic terms, progress reports, and documents.

-- 1. Courses
create table if not exists public.courses (
    id uuid primary key default gen_random_uuid(),
    scholar_id uuid not null references public.profiles (id) on delete cascade,
    title text not null,
    credits integer not null,
    status text not null check (status in ('completed', 'in-progress', 'upcoming')),
    score text,
    note text,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

-- 2. Academic Terms
create table if not exists public.academic_terms (
    id uuid primary key default gen_random_uuid(),
    scholar_id uuid not null references public.profiles (id) on delete cascade,
    term text not null,
    gpa numeric(3, 2) not null,
    highlight text,
    focus text,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

-- 3. Progress Reports
create table if not exists public.progress_reports (
    id uuid primary key default gen_random_uuid(),
    scholar_id uuid not null references public.profiles (id) on delete cascade,
    period text not null,
    submitted_on date,
    reviewer text,
    score integer,
    status text not null check (status in ('active', 'submitted', 'draft', 'archived')),
    summary text,
    priorities text[] default '{}',
    signals text[] default '{}',
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

-- 4. Documents
create table if not exists public.documents (
    id uuid primary key default gen_random_uuid(),
    scholar_id uuid not null references public.profiles (id) on delete cascade,
    name text not null,
    type text not null,
    updated_on date not null default current_date,
    expires_on date,
    owner text,
    status text not null check (status in ('verified', 'pending', 'expiring')),
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

-- RLS Policies
alter table public.courses enable row level security;
alter table public.academic_terms enable row level security;
alter table public.progress_reports enable row level security;
alter table public.documents enable row level security;

create policy "Scholars can view their own courses" on public.courses for select using (auth.uid() = scholar_id);
create policy "Scholars can view their own academic terms" on public.academic_terms for select using (auth.uid() = scholar_id);
create policy "Scholars can view their own progress reports" on public.progress_reports for select using (auth.uid() = scholar_id);
create policy "Scholars can view their own documents" on public.documents for select using (auth.uid() = scholar_id);

-- Update Triggers
create trigger courses_set_updated_at before update on public.courses for each row execute function public.set_updated_at();
create trigger academic_terms_set_updated_at before update on public.academic_terms for each row execute function public.set_updated_at();
create trigger progress_reports_set_updated_at before update on public.progress_reports for each row execute function public.set_updated_at();
create trigger documents_set_updated_at before update on public.documents for each row execute function public.set_updated_at();

-- Sample Data (Replace [SCHOLAR_ID] with a valid UUID from profiles)
-- insert into public.courses (scholar_id, title, credits, status, score, note) values
-- ('[SCHOLAR_ID]', 'Introduction to Public Health Modeling', 4, 'completed', '92', 'Exceptional applied research output.'),
-- ('[SCHOLAR_ID]', 'Deep Learning for Public Health', 4, 'in-progress', '88', 'Focusing on maternal health.'),
-- ('[SCHOLAR_ID]', 'National Policy and Systems Design', 3, 'upcoming', null, null);

-- insert into public.academic_terms (scholar_id, term, gpa, highlight, focus) values
-- ('[SCHOLAR_ID]', 'Q1 2025', 3.84, 'Research breakthrough in maternal health forecasting.', 'Public Health Modeling'),
-- ('[SCHOLAR_ID]', 'Q4 2024', 3.92, 'Distinction in advanced research methods.', 'National Health Policy Lab');

-- insert into public.progress_reports (scholar_id, period, submitted_on, reviewer, score, status, summary, priorities, signals) values
-- ('[SCHOLAR_ID]', 'Q1 2026 cycle', '2026-03-12', 'Dr. Miriam Okoro', 92, 'active', 'Academic growth is exceeding expectation, particularly where coursework is tied to applied outputs.', ARRAY['Finalize thesis core', 'Complete internship prep', 'Log 40 hours of research'], ARRAY['High growth', 'Strong readiness', 'Mission-aligned']);

-- insert into public.documents (scholar_id, name, type, updated_on, expires_on, owner, status) values
-- ('[SCHOLAR_ID]', 'Scholarship Award Letter', 'Programme', '2026-03-15', '2028-05-20', 'Program Office', 'verified'),
-- ('[SCHOLAR_ID]', 'Latest University Transcript', 'Academic', '2026-03-10', null, 'University Registry', 'verified'),
-- ('[SCHOLAR_ID]', 'National ID', 'Compliance', '2025-04-21', '2026-04-21', 'NIMC', 'verified');
