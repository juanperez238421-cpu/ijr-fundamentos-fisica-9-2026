-- Free Fall Lab v3: each student is identified by a verified Supabase Auth email
-- from the precise institution domain ijr.edu.co; one unique attempt per mailbox.
-- Keep existing code-based attempts for audit/history, but the v3 API no longer accepts codes.
alter table public.physics9_ff_attempts_v1
  alter column invite_id drop not null;

alter table public.physics9_ff_attempts_v1
  add column if not exists auth_user_id uuid,
  add column if not exists institutional_email text;

create unique index if not exists physics9_ff_unique_auth_user_v3
  on public.physics9_ff_attempts_v1(auth_user_id)
  where auth_user_id is not null;
create unique index if not exists physics9_ff_unique_email_v3
  on public.physics9_ff_attempts_v1(lower(institutional_email))
  where institutional_email is not null;

alter table public.physics9_ff_attempts_v1
  add constraint physics9_ff_legacy_or_email_identity_v3 check (
    (invite_id is not null and auth_user_id is null and institutional_email is null)
    or
    (invite_id is null and auth_user_id is not null
     and institutional_email ~ '^[a-z0-9][a-z0-9._%+-]*@ijr[.]edu[.]co$')
  );

comment on column public.physics9_ff_attempts_v1.auth_user_id
  is 'Verified Supabase Auth user identity; never derive from user-supplied JSON or JWT metadata.';
comment on column public.physics9_ff_attempts_v1.institutional_email
  is 'Canonical lowercase authenticated mailbox; exact @ijr.edu.co suffix, one attempt per email.';
-- Existing RLS/revoked client permissions and evidence storage remain unchanged.
