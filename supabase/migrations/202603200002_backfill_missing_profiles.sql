-- Backfill missing profile rows for existing auth users.
-- This prevents FK failures when inserting into public.applications (applicant_id -> profiles.id).

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
select
    au.id,
    coalesce(au.email, ''),
    coalesce(nullif(trim(au.raw_user_meta_data ->> 'first_name'), ''), 'Applicant'),
    coalesce(nullif(trim(au.raw_user_meta_data ->> 'last_name'), ''), 'User'),
    nullif(trim(au.raw_user_meta_data ->> 'phone'), ''),
    nullif(trim(au.raw_user_meta_data ->> 'state_of_origin'), ''),
    case
        when au.raw_user_meta_data ->> 'role' in ('applicant', 'donor', 'scholar', 'admin', 'reviewer', 'partner')
            then (au.raw_user_meta_data ->> 'role')::public.app_role
        else 'applicant'::public.app_role
    end,
    case
        when au.raw_user_meta_data ->> 'account_type' in ('applicant', 'donor', 'scholar', 'admin', 'reviewer', 'partner')
            then (au.raw_user_meta_data ->> 'account_type')::public.app_role
        else 'applicant'::public.app_role
    end
from auth.users au
where not exists (
    select 1
    from public.profiles p
    where p.id = au.id
);
