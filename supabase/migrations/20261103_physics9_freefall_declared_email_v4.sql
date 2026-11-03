-- Physics 9 v4: direct school-address entry, NO email possession verification.
-- Historical verified users and legacy invitations are preserved.
-- Unverified entries are a declared identity; NOT proof of school affiliation.
alter table public.physics9_ff_attempts_v1
 drop constraint if exists physics9_ff_legacy_or_email_identity_v3;
alter table public.physics9_ff_attempts_v1
 add constraint physics9_ff_identity_modes_v4 check (
   (invite_id is not null and auth_user_id is null and institutional_email is null)
   or
   (invite_id is null and auth_user_id is not null and institutional_email ~ '^[a-z0-9][a-z0-9._%+-]*@ijr[.]edu[.]co$')
   or
   (invite_id is null and auth_user_id is null and institutional_email ~ '^[a-z0-9][a-z0-9._%+-]*@ijr[.]edu[.]co$')
 );
comment on column public.physics9_ff_attempts_v1.institutional_email is
 'v4: declared school-domain email, NOT verified possession. Uniqueness avoids duplicate attempts; guest session token protects stored data.';
