-- Migration: 202603190004_notifications_and_deadlines.sql
-- Description: Adds tables for user-specific notifications and platform-wide/user-specific deadlines.

-- 1. Notifications
create table if not exists public.notifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles (id) on delete cascade,
    title text not null,
    body text not null,
    type text not null default 'info' check (type in ('info', 'warning', 'success', 'error')),
    is_read boolean not null default false,
    link text,
    created_at timestamptz not null default timezone('utc', now())
);

-- 2. Deadlines
create table if not exists public.deadlines (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles (id) on delete cascade, -- Optional: user-specific deadline
    label text not null,
    description text,
    due_date timestamptz not null,
    is_urgent boolean not null default false,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

-- RLS Policies
alter table public.notifications enable row level security;
alter table public.deadlines enable row level security;

create policy "Users can view their own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update their own notifications (mark as read)" on public.notifications for update using (auth.uid() = user_id);

create policy "Deadlines are viewable by assigned user or all if global" on public.deadlines for select using (user_id is null or auth.uid() = user_id);

-- Update Triggers
create trigger deadlines_set_updated_at before update on public.deadlines for each row execute function public.set_updated_at();

-- Sample Data for Applicants (Replace [USER_ID] with real UUID)
-- insert into public.notifications (user_id, title, body, type, is_read) values
-- ('[USER_ID]', 'Profile Verification Successful', 'Your identity documents have been verified. You can now proceed to the essay section.', 'success', false),
-- ('[USER_ID]', 'Upcoming Deadline', 'The Phase 1 application cycle closes in 7 days. Ensure all documents are uploaded.', 'warning', false);

-- insert into public.deadlines (user_id, label, due_date, is_urgent) values
-- ('[USER_ID]', 'Initial Application Submission', '2026-03-25', true),
-- (null, 'NTDI Selection Board Webinar', '2026-03-20', false);
