-- Physics 9 free-fall assessment v1, isolated from existing student records.
-- Public schema tables contain private student data; browser roles have no privileges.
create table if not exists public.physics9_ff_settings_v1 (
 id text primary key default 'freefall-9-2026' check (id='freefall-9-2026'),
 enabled boolean not null default false,
 opens_at timestamptz,
 closes_at timestamptz,
 duration_minutes integer not null default 45 check(duration_minutes between 10 and 180),
 relative_tolerance numeric not null default 0.005 check(relative_tolerance between 0 and 0.10),
 absolute_time numeric not null default 0.12 check(absolute_time between 0 and 3),
 absolute_height numeric not null default 2 check(absolute_height between 0 and 50),
 absolute_velocity numeric not null default 1.5 check(absolute_velocity between 0 and 20),
 show_final_score boolean not null default false,
 updated_at timestamptz not null default now()
);
insert into public.physics9_ff_settings_v1(id) values ('freefall-9-2026') on conflict do nothing;

create table if not exists public.physics9_ff_variants_v1 (
 id text primary key check(id ~ '^P[123]V[123]$'),
 question_number integer not null check(question_number between 1 and 3),
 title text not null,
 situation text not null check(situation in ('drop','up','down')),
 height_ft numeric not null check(height_ft>0 and height_ft<100000),
 velocity_fts numeric not null check(velocity_fts between -1000 and 1000),
 gravity_fts2 numeric not null default 32 check(gravity_fts2>0),
 observation_s numeric not null check(observation_s>0),
 enabled boolean not null default true
);
insert into public.physics9_ff_variants_v1
(id,question_number,title,situation,height_ft,velocity_fts,gravity_fts2,observation_s)
values
 ('P1V1',1,'Water tower','drop',576,0,32,2),
 ('P1V2',1,'Science center tower','drop',1024,0,32,3),
 ('P1V3',1,'Observation tower','drop',1296,0,32,4),
 ('P2V1',2,'Rooftop launch','up',864,48,32,2),
 ('P2V2',2,'Mountain observatory','up',560,80,32,2),
 ('P2V3',2,'Research building','up',750,64,32,2),
 ('P3V1',3,'Hot-air balloon','down',1200,-72,32,4),
 ('P3V2',3,'Rescue balloon','down',1800,-48,32,5),
 ('P3V3',3,'Weather balloon','down',2300,-60,32,6)
on conflict(id) do nothing;

create table if not exists public.physics9_ff_invites_v1 (
 id uuid primary key default gen_random_uuid(),
 student_name text not null check(length(student_name) between 2 and 120),
 group_code text not null check(group_code in ('9A','9B','9C')),
 code_hash text not null unique check(code_hash ~ '^[0-9a-f]{64}$'),
 active boolean not null default true,
 issued_at timestamptz not null default now(),
 revoked_at timestamptz
);
create table if not exists public.physics9_ff_attempts_v1 (
 id uuid primary key default gen_random_uuid(),
 invite_id uuid not null unique references public.physics9_ff_invites_v1(id),
 session_hash text not null check(session_hash ~ '^[0-9a-f]{64}$'),
 variant_ids jsonb not null check(jsonb_typeof(variant_ids)='array' and jsonb_array_length(variant_ids)=3),
 answers jsonb not null default '{}'::jsonb check(jsonb_typeof(answers)='object'),
 revision integer not null default 0 check(revision>=0),
 state text not null default 'active' check(state in ('active','submitted')),
 started_at timestamptz not null default now(),
 deadline_at timestamptz not null,
 submitted_at timestamptz,
 numeric_score numeric(4,2),
 final_score numeric(4,2) check(final_score is null or final_score between 0 and 5),
 teacher_feedback text,
 reviewed_at timestamptz,
 breakdown jsonb,
 updated_at timestamptz not null default now()
);
create index if not exists physics9_ff_attempts_start_idx on public.physics9_ff_attempts_v1(started_at);
create table if not exists public.physics9_ff_events_v1 (
 id bigint generated always as identity primary key,
 attempt_id uuid references public.physics9_ff_attempts_v1(id),
 actor text not null check(actor in ('student','teacher','system')),
 event_type text not null,
 details jsonb not null default '{}'::jsonb,
 occurred_at timestamptz not null default now()
);
create index if not exists physics9_ff_events_attempt_idx on public.physics9_ff_events_v1(attempt_id,id);
create table if not exists public.physics9_ff_rate_v1 (
 ip_digest text primary key check(ip_digest ~ '^[0-9a-f]{64}$'),
 window_start timestamptz not null default now(),
 failures integer not null default 0,
 blocked_until timestamptz
);

alter table public.physics9_ff_settings_v1 enable row level security;
alter table public.physics9_ff_variants_v1 enable row level security;
alter table public.physics9_ff_invites_v1 enable row level security;
alter table public.physics9_ff_attempts_v1 enable row level security;
alter table public.physics9_ff_events_v1 enable row level security;
alter table public.physics9_ff_rate_v1 enable row level security;
revoke all on public.physics9_ff_settings_v1, public.physics9_ff_variants_v1, public.physics9_ff_invites_v1, public.physics9_ff_attempts_v1, public.physics9_ff_events_v1, public.physics9_ff_rate_v1 from anon, authenticated;
revoke all on sequence public.physics9_ff_events_v1_id_seq from anon, authenticated;
-- No browser policies. Access exclusively through the Edge Function using a service key.
comment on table public.physics9_ff_attempts_v1 is 'Private student physics9 freefall responses. Server-only, one attempt per one-time teacher-issued invite.';
comment on table public.physics9_ff_events_v1 is 'Private audit history; no direct browser access or mutation APIs.';
