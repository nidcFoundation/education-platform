create table if not exists public.support_requests (
    id uuid primary key default gen_random_uuid(),
    support_type text not null check (support_type in ('donor', 'partner')),
    name text not null,
    email text not null,
    message text not null,
    status text not null default 'pending',
    created_at timestamptz not null default timezone('utc', now())
);

alter table public.support_requests enable row level security;
