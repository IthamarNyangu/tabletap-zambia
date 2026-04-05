alter table public.tables
  add column if not exists is_active boolean not null default true;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  venue_id uuid not null references public.venues(id) on delete cascade,
  full_name text,
  role text not null check (role in ('admin', 'staff')),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_profiles_venue_id_role_active
  on public.profiles (venue_id, role, is_active);

create index if not exists idx_tables_venue_id_is_active
  on public.tables (venue_id, is_active);
