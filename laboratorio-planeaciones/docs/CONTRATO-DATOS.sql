-- CONTRATO PRELIMINAR, NO MIGRACIÓN NI DESPLIEGUE.
-- Revisar en Supabase local aislado. Esquema sin exposición por Data API.
-- API institucional con rol específico y autorización por expediente pendiente.
begin;
create schema if not exists planning_private;
revoke all on schema planning_private from public, anon, authenticated;
create table planning_private.cases (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references auth.users(id),
  assigned_coordinator uuid not null references auth.users(id),
  grade smallint not null check (grade between 1 and 11),
  subject text not null,
  term smallint not null check (term between 1 and 3),
  state text not null check (state in ('cargada','en_analisis_ia','en_revision','con_ajustes','aprobada','devuelta')),
  received_at timestamptz not null default now(),
  due_at timestamptz not null, -- API fija received_at + interval '192 hours', una sola vez.
  closed_at timestamptz,
  revision bigint not null default 1,
  check(due_at = received_at + interval '192 hours')
);
create table planning_private.versions (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references planning_private.cases(id),
  number integer not null check(number>0),
  file_sha256 text not null check(file_sha256 ~ '^[a-f0-9]{64}$'),
  private_object_key text not null,
  received_at timestamptz not null default now(),
  unique(case_id,number)
);
create table planning_private.sources (
  id uuid primary key default gen_random_uuid(),
  kind text not null check(kind in ('malla','plan_area','estandar','pei')),
  subject text, grade smallint, term smallint,
  sha256 text not null, version text not null,
  valid_from date not null, valid_to date,
  validated_by uuid references auth.users(id),
  object_key text not null
);
create table planning_private.reports (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references planning_private.versions(id),
  model_digest text not null, prompt_version text not null,
  source_manifest jsonb not null, report jsonb not null,
  created_at timestamptz not null default now()
);
create table planning_private.comments (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references planning_private.versions(id),
  actor_id uuid references auth.users(id),
  report_id uuid references planning_private.reports(id),
  kind text not null check(kind in ('ia','coordinador','docente','asesor')),
  anchor jsonb not null, -- document_sha256, version, page, normalized rectangle, excerpt
  body text not null,
  supersedes uuid references planning_private.comments(id),
  created_at timestamptz not null default now()
);
create table planning_private.events (
  id bigint generated always as identity primary key,
  case_id uuid not null references planning_private.cases(id),
  actor_id uuid references auth.users(id),
  occurred_at timestamptz not null default now(),
  type text not null, payload jsonb not null,
  operation_id uuid not null unique
);
create table planning_private.outbox (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references planning_private.cases(id),
  event_id bigint not null references planning_private.events(id),
  recipient_id uuid not null references auth.users(id),
  idempotency_key text not null unique,
  due_at timestamptz not null,
  attempts integer not null default 0,
  sent_at timestamptz, delivered_at timestamptz, last_error_code text
);
create index on planning_private.cases(assigned_coordinator,due_at) where closed_at is null;
create index on planning_private.versions(case_id);
create index on planning_private.comments(version_id);
create index on planning_private.events(case_id,occurred_at);
create index on planning_private.outbox(due_at) where delivered_at is null;
alter table planning_private.cases enable row level security;
alter table planning_private.versions enable row level security;
alter table planning_private.sources enable row level security;
alter table planning_private.reports enable row level security;
alter table planning_private.comments enable row level security;
alter table planning_private.events enable row level security;
alter table planning_private.outbox enable row level security;
revoke all on all tables in schema planning_private from public, anon, authenticated;
revoke all on all sequences in schema planning_private from public, anon, authenticated;
-- Denegación por defecto: no hay políticas permisivas ni credenciales incluidas.
-- Pendientes: asignaciones de asesores/áreas, decisiones y recibos de entrega,
-- protección de UPDATE de received_at/due_at, inmutabilidad eventos, hash encadenado
-- + copia de auditoría independiente, tablas de sincronización y reclamos.
-- Un administrador de BD siempre puede modificar datos; append-only no prueba
-- integridad frente al administrador. No ejecutar antes de probar estos controles.
commit;
