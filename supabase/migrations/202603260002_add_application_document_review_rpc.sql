-- Allow admins and reviewers to verify or reject applicant documents stored on applications.

create or replace function public.update_application_document_status(
    p_application_id uuid,
    p_document_id text,
    p_status text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
    reviewer_role public.app_role;
    existing_documents jsonb;
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

    if p_status not in ('pending', 'verified', 'rejected', 'expiring') then
        raise exception 'Invalid document status.';
    end if;

    select documents
    into existing_documents
    from public.applications
    where id = p_application_id
    for update;

    if not found then
        raise exception 'Application not found.';
    end if;

    if not exists (
        select 1
        from jsonb_array_elements(coalesce(existing_documents, '[]'::jsonb)) as document
        where document ->> 'id' = p_document_id
    ) then
        raise exception 'Application document not found.';
    end if;

    update public.applications
    set documents = (
        select coalesce(
            jsonb_agg(
                case
                    when entry.document ->> 'id' = p_document_id then
                        jsonb_set(entry.document, '{status}', to_jsonb(p_status), true)
                    else
                        entry.document
                end
                order by entry.ordinality
            ),
            '[]'::jsonb
        )
        from jsonb_array_elements(coalesce(existing_documents, '[]'::jsonb))
            with ordinality as entry(document, ordinality)
    )
    where id = p_application_id;
end;
$$;

revoke all on function public.update_application_document_status(uuid, text, text) from public;
grant execute on function public.update_application_document_status(uuid, text, text) to authenticated;
