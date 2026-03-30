-- Ensure cohort records are preserved if a linked program is deleted.

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
