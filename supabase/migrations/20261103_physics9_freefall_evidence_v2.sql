-- Physics 9: private evidence file, uploaded only through the authenticated exam Edge Function.
-- PDFs and raster photos; no HTML/SVG or public storage read policies.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('physics9-freefall-procedures','physics9-freefall-procedures',false,5242880,
array['application/pdf','image/jpeg','image/png','image/webp']::text[])
on conflict (id) do update set
  public=false,file_size_limit=5242880,
  allowed_mime_types=excluded.allowed_mime_types;

create table if not exists public.physics9_ff_evidence_v1(
 attempt_id uuid primary key references public.physics9_ff_attempts_v1(id) on delete restrict,
 object_path text unique not null,
 original_name text not null check(length(original_name) between 1 and 160),
 mime_type text not null check(mime_type in ('application/pdf','image/jpeg','image/png','image/webp')),
 size_bytes integer not null check(size_bytes between 64 and 5242880),
 sha256_hex text not null check(sha256_hex ~ '^[0-9a-f]{64}$'),
 uploaded_at timestamptz not null default now(),
 revision integer not null default 1 check(revision between 1 and 100)
);
alter table public.physics9_ff_evidence_v1 enable row level security;
revoke all on public.physics9_ff_evidence_v1 from anon, authenticated;
comment on table public.physics9_ff_evidence_v1 is 'One private PDF or raster image per attempt, server-only metadata; teacher MFA needed to get short-lived signed review link.';

-- Only a server-side service-role client may write the file. Do not add storage.objects browser policies
-- for bucket physics9-freefall-procedures. Its private setting prevents unauthenticated downloads.
