begin;

create schema if not exists private;
create schema if not exists api;

create table private.pending_account_deletions_spike (
  id uuid primary key default gen_random_uuid(),
  source_auth_user_id uuid not null references auth.users(id) on delete cascade,
  initiating_session_id uuid not null,
  authorized_session_id uuid,
  nonce_hash bytea not null check (octet_length(nonce_hash) = 32),
  expires_at timestamptz not null,
  created_at timestamptz not null
);

create function private.session_belongs_to_user_spike(
  p_auth_user_id uuid,
  p_session_id uuid,
  p_created_after timestamptz
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from auth.sessions as session
    where session.id = p_session_id
      and session.user_id = p_auth_user_id
      and session.created_at > p_created_after
  )
$$;

create function api.authorize_account_deletion_spike(
  p_intent_id uuid,
  p_callback_user_id uuid,
  p_callback_session_id uuid
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  intent private.pending_account_deletions_spike%rowtype;
begin
  select *
    into intent
    from private.pending_account_deletions_spike
    where id = p_intent_id
    for update;

  if intent.id is null
    or intent.expires_at <= now()
    or intent.authorized_session_id is not null
    or intent.source_auth_user_id <> p_callback_user_id
    or intent.initiating_session_id = p_callback_session_id
    or not private.session_belongs_to_user_spike(
      p_callback_user_id,
      p_callback_session_id,
      intent.created_at
    )
  then
    return false;
  end if;

  update private.pending_account_deletions_spike
  set authorized_session_id = p_callback_session_id
  where id = p_intent_id;

  return true;
end;
$$;

create function api.claim_account_deletion_spike(
  p_intent_id uuid,
  p_current_user_id uuid,
  p_current_session_id uuid,
  p_nonce_hash bytea
)
returns table (
  source_auth_user_id uuid
)
language sql
security invoker
set search_path = ''
as $$
  delete from private.pending_account_deletions_spike
  where id = p_intent_id
    and source_auth_user_id = p_current_user_id
    and authorized_session_id = p_current_session_id
    and nonce_hash = p_nonce_hash
    and expires_at > now()
  returning source_auth_user_id
$$;

revoke all on schema private
  from public, anon, authenticated, service_role;
revoke all on schema api
  from public, anon, authenticated, service_role;
revoke all on table private.pending_account_deletions_spike
  from public, anon, authenticated, service_role;
revoke execute on function private.session_belongs_to_user_spike(
  uuid,
  uuid,
  timestamptz
) from public, anon, authenticated, service_role;
revoke execute on function api.authorize_account_deletion_spike(
  uuid,
  uuid,
  uuid
) from public, anon, authenticated, service_role;
revoke execute on function api.claim_account_deletion_spike(
  uuid,
  uuid,
  uuid,
  bytea
) from public, anon, authenticated, service_role;

grant usage on schema private, api to service_role;
grant select, insert, update, delete
  on table private.pending_account_deletions_spike
  to service_role;
grant execute on function private.session_belongs_to_user_spike(
  uuid,
  uuid,
  timestamptz
) to service_role;
grant execute on function api.authorize_account_deletion_spike(
  uuid,
  uuid,
  uuid
) to service_role;
grant execute on function api.claim_account_deletion_spike(
  uuid,
  uuid,
  uuid,
  bytea
) to service_role;

select set_config(
  'app.spike_auth_user_id',
  (
    select identity.user_id::text
    from auth.identities as identity
    where identity.provider = 'github'
    order by identity.created_at desc
    limit 1
  ),
  true
);

select set_config(
  'app.spike_initiating_session_id',
  (
    select session.id::text
    from auth.sessions as session
    where session.user_id =
      current_setting('app.spike_auth_user_id')::uuid
    order by session.created_at asc
    limit 1
  ),
  true
);

select set_config(
  'app.spike_authorized_session_id',
  (
    select session.id::text
    from auth.sessions as session
    where session.user_id =
      current_setting('app.spike_auth_user_id')::uuid
    order by session.created_at desc
    limit 1
  ),
  true
);

do $$
begin
  if current_setting('app.spike_initiating_session_id', true) is null
    or current_setting('app.spike_authorized_session_id', true) is null
    or current_setting('app.spike_initiating_session_id')
      = current_setting('app.spike_authorized_session_id')
  then
    raise exception 'at least two sessions for one GitHub user are required';
  end if;
end
$$;

insert into private.pending_account_deletions_spike (
  source_auth_user_id,
  initiating_session_id,
  nonce_hash,
  expires_at,
  created_at
)
select
  current_setting('app.spike_auth_user_id')::uuid,
  current_setting('app.spike_initiating_session_id')::uuid,
  digest('phase-0-deletion-nonce', 'sha256'),
  now() + interval '10 minutes',
  authorized_session.created_at - interval '1 millisecond'
from auth.sessions as authorized_session
where authorized_session.id =
  current_setting('app.spike_authorized_session_id')::uuid
returning id;

select set_config(
  'app.spike_intent_id',
  (
    select id::text
    from private.pending_account_deletions_spike
    limit 1
  ),
  true
);

set local role service_role;

do $$
declare
  authorized boolean;
begin
  select api.authorize_account_deletion_spike(
    current_setting('app.spike_intent_id')::uuid,
    gen_random_uuid(),
    current_setting('app.spike_authorized_session_id')::uuid
  ) into authorized;

  if authorized then
    raise exception 'different callback user must be rejected';
  end if;

  select api.authorize_account_deletion_spike(
    current_setting('app.spike_intent_id')::uuid,
    current_setting('app.spike_auth_user_id')::uuid,
    current_setting('app.spike_initiating_session_id')::uuid
  ) into authorized;

  if authorized then
    raise exception 'initiating session must not authorize deletion';
  end if;

  select api.authorize_account_deletion_spike(
    current_setting('app.spike_intent_id')::uuid,
    current_setting('app.spike_auth_user_id')::uuid,
    current_setting('app.spike_authorized_session_id')::uuid
  ) into authorized;

  if not authorized then
    raise exception 'same user with a new session must authorize deletion';
  end if;
end;
$$;

do $$
declare
  claimed_user_id uuid;
begin
  select claim.source_auth_user_id
    into claimed_user_id
    from api.claim_account_deletion_spike(
      current_setting('app.spike_intent_id')::uuid,
      current_setting('app.spike_auth_user_id')::uuid,
      current_setting('app.spike_authorized_session_id')::uuid,
      digest('wrong-nonce', 'sha256')
    ) as claim;

  if claimed_user_id is not null then
    raise exception 'wrong nonce must not claim deletion';
  end if;

  select claim.source_auth_user_id
    into claimed_user_id
    from api.claim_account_deletion_spike(
      current_setting('app.spike_intent_id')::uuid,
      current_setting('app.spike_auth_user_id')::uuid,
      current_setting('app.spike_authorized_session_id')::uuid,
      digest('phase-0-deletion-nonce', 'sha256')
    ) as claim;

  if claimed_user_id
    is distinct from current_setting('app.spike_auth_user_id')::uuid
  then
    raise exception 'authorized deletion intent must be claimable once';
  end if;

  select claim.source_auth_user_id
    into claimed_user_id
    from api.claim_account_deletion_spike(
      current_setting('app.spike_intent_id')::uuid,
      current_setting('app.spike_auth_user_id')::uuid,
      current_setting('app.spike_authorized_session_id')::uuid,
      digest('phase-0-deletion-nonce', 'sha256')
    ) as claim;

  if claimed_user_id is not null then
    raise exception 'consumed deletion intent must not be replayed';
  end if;
end;
$$;

reset role;

do $$
begin
  if exists (
    select 1
    from private.pending_account_deletions_spike
  ) then
    raise exception 'claimed deletion intent must be consumed';
  end if;
end
$$;

rollback;
