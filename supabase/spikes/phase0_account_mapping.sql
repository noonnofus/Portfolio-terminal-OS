begin;

create schema if not exists private;
create schema if not exists api;

create table private.user_accounts_spike (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete set null,
  github_user_id text,
  github_login_snapshot text,
  display_name_snapshot text not null,
  avatar_url_snapshot text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index user_accounts_spike_active_auth_user_id_key
  on private.user_accounts_spike(auth_user_id)
  where deleted_at is null and auth_user_id is not null;

create unique index user_accounts_spike_active_github_user_id_key
  on private.user_accounts_spike(github_user_id)
  where deleted_at is null and github_user_id is not null;

create function private.get_github_identity_spike(p_auth_user_id uuid)
returns table (
  github_user_id text,
  github_login text,
  display_name text,
  avatar_url text
)
language sql
security definer
set search_path = ''
as $$
  select
    identity.provider_id,
    left(
      coalesce(
        nullif(btrim(identity.identity_data ->> 'user_name'), ''),
        nullif(btrim(identity.identity_data ->> 'preferred_username'), '')
      ),
      39
    ),
    left(
      coalesce(
        nullif(btrim(identity.identity_data ->> 'full_name'), ''),
        nullif(btrim(identity.identity_data ->> 'name'), ''),
        nullif(btrim(identity.identity_data ->> 'user_name'), ''),
        'GitHub user'
      ),
      80
    ),
    left(nullif(btrim(identity.identity_data ->> 'avatar_url'), ''), 2048)
  from auth.users as auth_user
  join auth.identities as identity
    on identity.user_id = auth_user.id
   and identity.provider = 'github'
  where auth_user.id = p_auth_user_id
    and coalesce(auth_user.is_anonymous, false) = false
  limit 1
$$;

create function api.resolve_user_account_spike(p_auth_user_id uuid)
returns table (
  account_id uuid,
  display_name text
)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  github_identity record;
begin
  select *
    into github_identity
    from private.get_github_identity_spike(p_auth_user_id);

  if github_identity.github_user_id is null then
    raise exception using
      errcode = '28000',
      message = 'verified GitHub identity required';
  end if;

  return query
    insert into private.user_accounts_spike (
      auth_user_id,
      github_user_id,
      github_login_snapshot,
      display_name_snapshot,
      avatar_url_snapshot,
      updated_at
    )
    values (
      p_auth_user_id,
      github_identity.github_user_id,
      github_identity.github_login,
      github_identity.display_name,
      github_identity.avatar_url,
      now()
    )
    on conflict (auth_user_id)
      where deleted_at is null and auth_user_id is not null
    do update set
      github_login_snapshot = excluded.github_login_snapshot,
      display_name_snapshot = excluded.display_name_snapshot,
      avatar_url_snapshot = excluded.avatar_url_snapshot,
      updated_at = now()
    returning
      private.user_accounts_spike.id,
      private.user_accounts_spike.display_name_snapshot;
end;
$$;

revoke all on schema private
  from public, anon, authenticated, service_role;
revoke all on schema api
  from public, anon, authenticated, service_role;
revoke all on table private.user_accounts_spike
  from public, anon, authenticated, service_role;
revoke execute on function private.get_github_identity_spike(uuid)
  from public, anon, authenticated, service_role;
revoke execute on function api.resolve_user_account_spike(uuid)
  from public, anon, authenticated, service_role;

grant usage on schema private to service_role;
grant usage on schema api to service_role;
grant select, insert, update on table private.user_accounts_spike
  to service_role;
grant execute on function private.get_github_identity_spike(uuid)
  to service_role;
grant execute on function api.resolve_user_account_spike(uuid)
  to service_role;

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

do $$
begin
  if current_setting('app.spike_auth_user_id', true) is null then
    raise exception 'GitHub identity fixture required';
  end if;

  if has_table_privilege('service_role', 'auth.users', 'select') then
    raise exception 'service_role must not have broad auth.users select';
  end if;

  if has_table_privilege('service_role', 'auth.identities', 'select') then
    raise exception 'service_role must not have broad auth.identities select';
  end if;

  if has_function_privilege(
    'anon',
    'api.resolve_user_account_spike(uuid)',
    'execute'
  ) then
    raise exception 'anon must not execute account resolver';
  end if;

  if has_function_privilege(
    'authenticated',
    'api.resolve_user_account_spike(uuid)',
    'execute'
  ) then
    raise exception 'authenticated must not execute account resolver';
  end if;
end
$$;

set local role service_role;

select *
from api.resolve_user_account_spike(
  current_setting('app.spike_auth_user_id')::uuid
);

select *
from api.resolve_user_account_spike(
  current_setting('app.spike_auth_user_id')::uuid
);

do $$
begin
  if (
    select count(*)
    from private.user_accounts_spike
    where auth_user_id = current_setting('app.spike_auth_user_id')::uuid
  ) <> 1 then
    raise exception 'account resolver must be idempotent';
  end if;
end
$$;

reset role;

do $$
declare
  api_is_definer boolean;
  private_is_definer boolean;
  private_config text[];
begin
  select procedure.prosecdef
    into api_is_definer
    from pg_proc as procedure
    join pg_namespace as namespace
      on namespace.oid = procedure.pronamespace
    where namespace.nspname = 'api'
      and procedure.proname = 'resolve_user_account_spike';

  select procedure.prosecdef, procedure.proconfig
    into private_is_definer, private_config
    from pg_proc as procedure
    join pg_namespace as namespace
      on namespace.oid = procedure.pronamespace
    where namespace.nspname = 'private'
      and procedure.proname = 'get_github_identity_spike';

  if api_is_definer then
    raise exception 'exposed api wrapper must be security invoker';
  end if;

  if not private_is_definer then
    raise exception 'private auth helper must be security definer';
  end if;

  if not coalesce('search_path=""' = any(private_config), false) then
    raise exception 'private auth helper must have an empty search path';
  end if;
end
$$;

rollback;
