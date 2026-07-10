create extension if not exists pgcrypto;

create table if not exists public.user_accounts (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'admin')),
  display_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_accounts enable row level security;

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  author_account_id uuid references public.user_accounts(id) on delete set null,
  author_name_snapshot text not null,
  content text not null check (char_length(content) between 1 and 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.notes enable row level security;

create index if not exists notes_created_at_id_idx
  on public.notes (created_at desc, id desc);

create index if not exists notes_author_account_id_idx
  on public.notes (author_account_id);

create table if not exists public.wallpapers (
  id text primary key,
  name text not null,
  url text not null,
  sort_order integer not null default 0,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.wallpapers enable row level security;

create index if not exists wallpapers_enabled_order_idx
  on public.wallpapers (is_enabled, sort_order, id);

insert into public.wallpapers (id, name, url, sort_order, is_enabled)
values
  ('golden_gate_light', 'Golden Gate Light', '/wallpapers/golden_gate_light.jpg', 10, true),
  ('golden_gate_dark', 'Golden Gate Dark', '/wallpapers/golden_gate_dark.jpg', 20, true),
  ('tahoe_light', 'Tahoe Light', '/wallpapers/tahoe_light.jpg', 30, true),
  ('tahoe_dark', 'Tahoe Dark', '/wallpapers/tahoe_dark.jpg', 40, true),
  ('tahoe_beach_dawn', 'Tahoe Beach - Dawn', '/wallpapers/tahoe_beach_dawn.jpg', 50, true),
  ('tahoe_beach_day', 'Tahoe Beach - Day', '/wallpapers/tahoe_beach_day.jpg', 60, true),
  ('tahoe_beach_dusk', 'Tahoe Beach - Dusk', '/wallpapers/tahoe_beach_dusk.jpg', 70, true),
  ('tahoe_beach_night', 'Tahoe Beach - Night', '/wallpapers/tahoe_beach_night.jpg', 80, true)
on conflict (id) do update
set
  name = excluded.name,
  url = excluded.url,
  sort_order = excluded.sort_order,
  is_enabled = excluded.is_enabled,
  updated_at = now();

create table if not exists public.user_preferences (
  account_id uuid primary key references public.user_accounts(id) on delete cascade,
  language text not null default 'ko' check (language in ('ko', 'en')),
  theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
  dock_auto_hide boolean not null default false,
  wallpaper_id text not null references public.wallpapers(id),
  updated_at timestamptz not null default now()
);

alter table public.user_preferences enable row level security;

create or replace function public.anonymize_notes_before_account_delete()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.notes
  set
    author_name_snapshot = '[DELETED]',
    updated_at = now()
  where author_account_id = old.id;

  return old;
end;
$$;

drop trigger if exists anonymize_notes_before_account_delete
  on public.user_accounts;

create trigger anonymize_notes_before_account_delete
before delete on public.user_accounts
for each row
execute function public.anonymize_notes_before_account_delete();

revoke all on table public.user_accounts from public, anon, authenticated;
revoke all on table public.notes from public, anon, authenticated;
revoke all on table public.user_preferences from public, anon, authenticated;
revoke all on table public.wallpapers from public, anon, authenticated;
