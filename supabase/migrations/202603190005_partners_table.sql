-- Migration: 202603190005_partners_table.sql
-- Description: Creates the partners table for institutional collaborators.

create table if not exists public.partners (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    type text not null, -- e.g., 'Academic Institution', 'Government', 'Private Sector'
    tier text not null check (tier in ('Founding', 'Core', 'Strategic', 'Corporate', 'Development Partner')),
    logo_url text,
    website_url text,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

-- Enable RLS
alter table public.partners enable row level security;

-- Public read access
create policy "Anyone can view partners" on public.partners for select using (true);

-- Admin manage access
create policy "Admins can manage partners" on public.partners for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Sample Data
insert into public.partners (name, type, tier) values
('University of Ibadan', 'Academic Institution', 'Founding'),
('Lagos State Government', 'Government', 'Strategic'),
('Nigerian National Petroleum Company', 'Government Enterprise', 'Strategic'),
('MainOne Cable Company', 'Private Sector', 'Corporate'),
('Andela Nigeria', 'Private Sector', 'Corporate'),
('World Bank Group', 'International', 'Development Partner'),
('African Development Bank', 'International', 'Development Partner'),
('Covenant University', 'Academic Institution', 'Core');
