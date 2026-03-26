-- Persist rubric scores alongside review decisions.

alter table public.applications
add column if not exists review_scores jsonb not null default '{}'::jsonb;

drop function if exists public.update_application_decision(uuid, uuid, text, text);

create or replace function public.update_application_decision(
    p_application_id uuid,
    p_applicant_id uuid,
    p_decision text,
    p_notes text,
    p_scores jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
    reviewer_role public.app_role;
begin
    if auth.uid() is null then
        raise exception 'Unauthorized';
    end if;

    select role
    into reviewer_role
    from public.profiles
    where id = auth.uid();

    if reviewer_role is null or reviewer_role not in ('admin', 'reviewer') then
        raise exception 'Unauthorized';
    end if;

    if p_decision not in (
        'draft',
        'submitted',
        'under_review',
        'shortlisted',
        'interview_stage',
        'accepted',
        'rejected'
    ) then
        raise exception 'Invalid application decision.';
    end if;

    update public.applications
    set
        status = p_decision,
        review_notes = coalesce(p_notes, ''),
        review_scores = coalesce(p_scores, '{}'::jsonb)
    where id = p_application_id
      and applicant_id = p_applicant_id;

    if not found then
        raise exception 'Application not found.';
    end if;

    if p_decision = 'accepted' then
        update public.profiles
        set role = 'scholar'::public.app_role
        where id = p_applicant_id;

        if not found then
            raise exception 'Applicant profile not found.';
        end if;
    end if;
end;
$$;

revoke all on function public.update_application_decision(uuid, uuid, text, text, jsonb) from public;
grant execute on function public.update_application_decision(uuid, uuid, text, text, jsonb) to authenticated;
