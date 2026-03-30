-- Align cohorts with the schema expected by the admin dashboard and cohorts pages.

alter table public.cohorts
add column if not exists program_id uuid;

alter table public.cohorts
alter column program_id drop not null;

do $$
declare
    fk_delete_rule "char";
begin
    select confdeltype
    into fk_delete_rule
    from pg_constraint
    where conname = 'cohorts_program_id_fkey'
      and conrelid = 'public.cohorts'::regclass;

    if fk_delete_rule is distinct from 'n' then
        if fk_delete_rule is not null then
            alter table public.cohorts
            drop constraint cohorts_program_id_fkey;
        end if;

        alter table public.cohorts
        add constraint cohorts_program_id_fkey
        foreign key (program_id)
        references public.programs (id)
        on delete set null;
    end if;
end;
$$;

alter table public.cohorts
add column if not exists review_completion_percentage numeric(5, 2) not null default 0;

alter table public.cohorts
add column if not exists readiness_status text;

alter table public.cohorts
alter column readiness_status set default 'planned';

do $$
begin
    if exists (
        select 1
        from information_schema.columns
        where table_schema = 'public'
          and table_name = 'cohorts'
          and column_name = 'review_completion'
    ) then
        execute $sql$
            update public.cohorts
            set review_completion_percentage = coalesce(review_completion_percentage, review_completion, 0)
            where review_completion is not null
        $sql$;
    end if;

    if exists (
        select 1
        from information_schema.columns
        where table_schema = 'public'
          and table_name = 'cohorts'
          and column_name = 'readiness'
    ) then
        execute $sql$
            update public.cohorts
            set readiness_status = coalesce(
                nullif(btrim(readiness_status), ''),
                nullif(btrim(readiness), ''),
                'planned'
            )
            where readiness is not null
               or readiness_status is null
               or btrim(readiness_status) = ''
        $sql$;
    end if;
end;
$$;
