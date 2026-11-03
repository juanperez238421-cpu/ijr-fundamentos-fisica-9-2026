-- Audit is append-only through the exam API; DB triggers capture every attempt mutation atomically.
create or replace function public.physics9_ff_attempt_audit_trg_v1()
returns trigger language plpgsql security invoker set search_path=public,pg_temp as $$
declare t text;
begin
 if TG_OP='INSERT' then t:='attempt_created';
 elsif NEW.state='submitted' and OLD.state<>'submitted' then t:='attempt_submitted';
 elsif NEW.final_score is distinct from OLD.final_score or NEW.teacher_feedback is distinct from OLD.teacher_feedback then t:='grade_updated';
 elsif NEW.answers is distinct from OLD.answers then t:='answers_saved';
 elsif NEW.session_hash is distinct from OLD.session_hash then t:='session_rotated';
 else t:='attempt_metadata_updated';
 end if;
 insert into public.physics9_ff_events_v1(attempt_id,actor,event_type,details)
 values (NEW.id,'system',t,jsonb_build_object('revision',NEW.revision,'state',NEW.state,'answers_digest',md5(NEW.answers::text),'numeric_score',NEW.numeric_score,'final_score',NEW.final_score));
 return NEW;
end $$;
revoke all on function public.physics9_ff_attempt_audit_trg_v1() from PUBLIC,anon,authenticated;
drop trigger if exists physics9_ff_attempt_audit_trg_v1 on public.physics9_ff_attempts_v1;
create trigger physics9_ff_attempt_audit_trg_v1 after insert or update on public.physics9_ff_attempts_v1
for each row execute function public.physics9_ff_attempt_audit_trg_v1();

create or replace function public.physics9_ff_immutable_events_trg_v1()
returns trigger language plpgsql security invoker set search_path=public,pg_temp as $$
begin
 raise exception 'Exam audit events are append-only';
end $$;
revoke all on function public.physics9_ff_immutable_events_trg_v1() from PUBLIC,anon,authenticated;
drop trigger if exists physics9_ff_immutable_events_trg_v1 on public.physics9_ff_events_v1;
create trigger physics9_ff_immutable_events_trg_v1 before update or delete on public.physics9_ff_events_v1
for each row execute function public.physics9_ff_immutable_events_trg_v1();
