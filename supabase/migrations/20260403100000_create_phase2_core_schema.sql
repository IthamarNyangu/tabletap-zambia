create extension if not exists "pgcrypto";

do $$
begin
  create type public.table_status as enum ('ready', 'occupied', 'reserved');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.service_request_type as enum (
    'call_waiter',
    'request_bill',
    'need_assistance'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.service_request_status as enum (
    'pending',
    'attended',
    'closed'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  tagline text not null,
  location text not null,
  description text not null,
  ambience_note text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.tables (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues(id) on delete cascade,
  table_number integer not null check (table_number > 0),
  label text not null,
  zone text not null,
  seats integer not null check (seats > 0),
  status public.table_status not null default 'ready',
  qr_code_value text not null unique,
  created_at timestamptz not null default timezone('utc', now()),
  unique (venue_id, table_number),
  unique (id, venue_id)
);

create table if not exists public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues(id) on delete cascade,
  name text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.menu_categories(id) on delete cascade,
  name text not null,
  description text not null,
  price numeric(10, 2) not null check (price >= 0),
  highlight text,
  tags text[] not null default '{}'::text[],
  is_available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.venue_actions (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null unique references public.venues(id) on delete cascade,
  call_waiter_enabled boolean not null default true,
  request_bill_enabled boolean not null default true,
  need_assistance_enabled boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues(id) on delete cascade,
  table_id uuid not null,
  request_type public.service_request_type not null,
  status public.service_request_status not null default 'pending',
  note text,
  created_at timestamptz not null default timezone('utc', now()),
  attended_at timestamptz,
  closed_at timestamptz,
  constraint service_requests_note_length check (
    note is null or char_length(note) <= 240
  ),
  constraint service_requests_table_id_fkey foreign key (table_id)
    references public.tables(id)
    on delete cascade,
  constraint service_requests_table_matches_venue foreign key (table_id, venue_id)
    references public.tables(id, venue_id)
    on delete cascade,
  constraint service_requests_status_timestamps check (
    (status = 'pending' and attended_at is null and closed_at is null)
    or (status = 'attended' and attended_at is not null and closed_at is null)
    or (status = 'closed' and attended_at is not null and closed_at is not null)
  )
);
