-- Enforce upload immutability at database level after submission/deadline.
create or replace function public.physics9_ff_evidence_guard_v2()
returns trigger language plpgsql security invoker set search_path=public,pg_temp as $$
declare v_state text; v_deadline timestamptz;
begin
 select state,deadline_at into v_state,v_deadline
 from public.physics9_ff_attempts_v1 where id=new.attempt_id for update;
 if v_state is distinct from 'active' or v_deadline<=now() then
  raise exception 'PROCEDURE_UPLOAD_CLOSED';
 end if;
 if TG_OP='UPDATE' then
  if new.attempt_id is distinct from old.attempt_id then
   raise exception 'PROCEDURE_ATTEMPT_CANNOT_CHANGE';
  end if;
  new.revision:=old.revision+1;
  if new.revision>100 then raise exception 'PROCEDURE_REPLACEMENT_LIMIT'; end if;
 end if;
 return new;
end $$;
revoke all on function public.physics9_ff_evidence_guard_v2() from public,anon,authenticated;
drop trigger if exists physics9_ff_evidence_guard_v2 on public.physics9_ff_evidence_v1;
create trigger physics9_ff_evidence_guard_v2
 before insert or update on public.physics9_ff_evidence_v1
 for each row execute function public.physics9_ff_evidence_guard_v2();
