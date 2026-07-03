begin;

create schema if not exists private;

create table private.user_accounts_deletion_spike (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete set null,
  github_user_id text,
  github_login_snapshot text,
  display_name_snapshot text,
  avatar_url_snapshot text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notes_deletion_spike (
  id uuid primary key default gen_random_uuid(),
  author_account_id uuid not null
    references private.user_accounts_deletion_spike(id) on delete restrict,
  author_name_snapshot text,
  content text not null,
  created_at timestamptz not null default now()
);

create table public.gui_preferences_deletion_spike (
  account_id uuid primary key
    references private.user_accounts_deletion_spike(id) on delete cascade,
  language text not null,
  wallpaper text not null,
  dock_auto_hide boolean not null,
  updated_at timestamptz not null default now()
);

insert into private.user_accounts_deletion_spike (
  auth_user_id,
  github_user_id,
  github_login_snapshot,
  display_name_snapshot,
  avatar_url_snapshot
)
select
  identity.user_id,
  identity.provider_id,
  left(identity.identity_data ->> 'user_name', 39),
  left(
    coalesce(
      nullif(btrim(identity.identity_data ->> 'full_name'), ''),
      nullif(btrim(identity.identity_data ->> 'user_name'), ''),
      'GitHub user'
    ),
    80
  ),
  left(identity.identity_data ->> 'avatar_url', 2048)
from auth.identities as identity
where identity.provider = 'github'
order by identity.created_at desc
limit 1;

insert into public.notes_deletion_spike (
  author_account_id,
  author_name_snapshot,
  content
)
select id, display_name_snapshot, 'account deletion spike note'
from private.user_accounts_deletion_spike;

insert into public.gui_preferences_deletion_spike (
  account_id,
  language,
  wallpaper,
  dock_auto_hide
)
select id, 'ko', 'tahoe-light', true
from private.user_accounts_deletion_spike;

create function private.anonymize_account_before_auth_delete_spike()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  account_id_to_delete uuid;
begin
  update private.user_accounts_deletion_spike
  set
    auth_user_id = null,
    github_user_id = null,
    github_login_snapshot = null,
    display_name_snapshot = null,
    avatar_url_snapshot = null,
    deleted_at = now(),
    updated_at = now()
  where auth_user_id = old.id
  returning id into account_id_to_delete;

  if account_id_to_delete is not null then
    update public.notes_deletion_spike
    set author_name_snapshot = null
    where author_account_id = account_id_to_delete;

    delete from public.gui_preferences_deletion_spike
    where account_id = account_id_to_delete;
  end if;

  return old;
end;
$$;

revoke all on function private.anonymize_account_before_auth_delete_spike()
  from public, anon, authenticated, service_role;

create trigger portfolio_spike_anonymize_account_before_auth_delete
before delete on auth.users
for each row
execute function private.anonymize_account_before_auth_delete_spike();

create function private.fail_auth_delete_spike()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  raise exception 'intentional account deletion spike failure';
end;
$$;

revoke all on function private.fail_auth_delete_spike()
  from public, anon, authenticated, service_role;

create trigger aaa_portfolio_spike_fail_auth_delete
before delete on auth.users
for each row
execute function private.fail_auth_delete_spike();

do $$
declare
  target_auth_user_id uuid;
begin
  select auth_user_id
    into target_auth_user_id
    from private.user_accounts_deletion_spike
    limit 1;

  if target_auth_user_id is null then
    raise exception 'GitHub auth user fixture required';
  end if;

  begin
    delete from auth.users where id = target_auth_user_id;
    raise exception 'account deletion unexpectedly succeeded';
  exception
    when others then
      if sqlerrm = 'account deletion unexpectedly succeeded' then
        raise;
      end if;
  end;

  if not exists (
    select 1 from auth.users where id = target_auth_user_id
  ) then
    raise exception 'failed deletion must retain auth user';
  end if;

  if exists (
    select 1
    from private.user_accounts_deletion_spike
    where auth_user_id = target_auth_user_id
      and github_user_id is not null
      and display_name_snapshot is not null
      and deleted_at is null
  ) is not true then
    raise exception 'failed deletion must rollback account anonymization';
  end if;

  if not exists (
    select 1
    from public.notes_deletion_spike
    where author_name_snapshot is not null
  ) then
    raise exception 'failed deletion must rollback note anonymization';
  end if;

  if not exists (
    select 1 from public.gui_preferences_deletion_spike
  ) then
    raise exception 'failed deletion must rollback preference deletion';
  end if;
end;
$$;

drop trigger aaa_portfolio_spike_fail_auth_delete on auth.users;
drop function private.fail_auth_delete_spike();

delete from auth.users
where id = (
  select auth_user_id
  from private.user_accounts_deletion_spike
  limit 1
);

do $$
declare
  retained_account_id uuid;
begin
  select id
    into retained_account_id
    from private.user_accounts_deletion_spike
    limit 1;

  if exists (
    select 1
    from private.user_accounts_deletion_spike
    where id = retained_account_id
      and (
        auth_user_id is not null
        or github_user_id is not null
        or github_login_snapshot is not null
        or display_name_snapshot is not null
        or avatar_url_snapshot is not null
        or deleted_at is null
      )
  ) then
    raise exception 'successful deletion must scrub external identifiers';
  end if;

  if not exists (
    select 1
    from public.notes_deletion_spike
    where author_account_id = retained_account_id
      and author_name_snapshot is null
      and content = 'account deletion spike note'
  ) then
    raise exception 'successful deletion must retain anonymized note';
  end if;

  if exists (
    select 1
    from public.gui_preferences_deletion_spike
    where account_id = retained_account_id
  ) then
    raise exception 'successful deletion must remove preferences';
  end if;
end;
$$;

rollback;
