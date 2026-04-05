create or replace function public.current_user_venue_id()
returns uuid
language sql
stable
as $$
  select venue_id
  from public.profiles
  where id = auth.uid()
    and is_active = true
  limit 1;
$$;

create or replace function public.current_user_role()
returns text
language sql
stable
as $$
  select role
  from public.profiles
  where id = auth.uid()
    and is_active = true
  limit 1;
$$;

revoke all on public.venues from anon, authenticated;
revoke all on public.tables from anon, authenticated;
revoke all on public.menu_categories from anon, authenticated;
revoke all on public.menu_items from anon, authenticated;
revoke all on public.venue_actions from anon, authenticated;
revoke all on public.service_requests from anon, authenticated;
revoke all on public.profiles from anon, authenticated;

grant usage on schema public to anon, authenticated;

grant select on public.venues, public.tables, public.menu_categories, public.menu_items, public.venue_actions
  to anon;

grant select on public.venues, public.tables, public.menu_categories, public.menu_items, public.venue_actions, public.service_requests, public.profiles
  to authenticated;

grant insert, update on public.tables to authenticated;
grant insert, update on public.menu_items to authenticated;
grant update (
  call_waiter_enabled,
  ready_to_order_enabled,
  request_bill_enabled,
  need_assistance_enabled
) on public.venue_actions to authenticated;
grant update (status, attended_at, closed_at) on public.service_requests to authenticated;

alter table public.venues enable row level security;
alter table public.tables enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.venue_actions enable row level security;
alter table public.service_requests enable row level security;
alter table public.profiles enable row level security;

drop policy if exists "public can read venues" on public.venues;
drop policy if exists "authenticated users can read their venue" on public.venues;
create policy "public can read venues"
  on public.venues
  for select
  to anon
  using (true);

create policy "authenticated users can read their venue"
  on public.venues
  for select
  to authenticated
  using (id = public.current_user_venue_id());

drop policy if exists "public can read active tables" on public.tables;
drop policy if exists "authenticated users can read venue tables" on public.tables;
drop policy if exists "admins can insert venue tables" on public.tables;
drop policy if exists "admins can update venue tables" on public.tables;
create policy "public can read active tables"
  on public.tables
  for select
  to anon
  using (is_active = true);

create policy "authenticated users can read venue tables"
  on public.tables
  for select
  to authenticated
  using (venue_id = public.current_user_venue_id());

create policy "admins can insert venue tables"
  on public.tables
  for insert
  to authenticated
  with check (
    public.current_user_role() = 'admin'
    and venue_id = public.current_user_venue_id()
  );

create policy "admins can update venue tables"
  on public.tables
  for update
  to authenticated
  using (
    public.current_user_role() = 'admin'
    and venue_id = public.current_user_venue_id()
  )
  with check (
    public.current_user_role() = 'admin'
    and venue_id = public.current_user_venue_id()
  );

drop policy if exists "public can read menu categories" on public.menu_categories;
drop policy if exists "authenticated users can read venue categories" on public.menu_categories;
create policy "public can read menu categories"
  on public.menu_categories
  for select
  to anon
  using (true);

create policy "authenticated users can read venue categories"
  on public.menu_categories
  for select
  to authenticated
  using (venue_id = public.current_user_venue_id());

drop policy if exists "public can read available menu items" on public.menu_items;
drop policy if exists "authenticated users can read venue menu items" on public.menu_items;
drop policy if exists "admins can insert venue menu items" on public.menu_items;
drop policy if exists "admins can update venue menu items" on public.menu_items;
create policy "public can read available menu items"
  on public.menu_items
  for select
  to anon
  using (is_available = true);

create policy "authenticated users can read venue menu items"
  on public.menu_items
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.menu_categories
      where menu_categories.id = menu_items.category_id
        and menu_categories.venue_id = public.current_user_venue_id()
    )
  );

create policy "admins can insert venue menu items"
  on public.menu_items
  for insert
  to authenticated
  with check (
    public.current_user_role() = 'admin'
    and exists (
      select 1
      from public.menu_categories
      where menu_categories.id = menu_items.category_id
        and menu_categories.venue_id = public.current_user_venue_id()
    )
  );

create policy "admins can update venue menu items"
  on public.menu_items
  for update
  to authenticated
  using (
    public.current_user_role() = 'admin'
    and exists (
      select 1
      from public.menu_categories
      where menu_categories.id = menu_items.category_id
        and menu_categories.venue_id = public.current_user_venue_id()
    )
  )
  with check (
    public.current_user_role() = 'admin'
    and exists (
      select 1
      from public.menu_categories
      where menu_categories.id = menu_items.category_id
        and menu_categories.venue_id = public.current_user_venue_id()
    )
  );

drop policy if exists "public can read venue actions" on public.venue_actions;
drop policy if exists "authenticated users can read venue actions" on public.venue_actions;
drop policy if exists "admins can update venue actions" on public.venue_actions;
create policy "public can read venue actions"
  on public.venue_actions
  for select
  to anon
  using (true);

create policy "authenticated users can read venue actions"
  on public.venue_actions
  for select
  to authenticated
  using (venue_id = public.current_user_venue_id());

create policy "admins can update venue actions"
  on public.venue_actions
  for update
  to authenticated
  using (
    public.current_user_role() = 'admin'
    and venue_id = public.current_user_venue_id()
  )
  with check (
    public.current_user_role() = 'admin'
    and venue_id = public.current_user_venue_id()
  );

drop policy if exists "authenticated users can read venue requests" on public.service_requests;
drop policy if exists "staff and admins can update venue requests" on public.service_requests;
create policy "authenticated users can read venue requests"
  on public.service_requests
  for select
  to authenticated
  using (venue_id = public.current_user_venue_id());

create policy "staff and admins can update venue requests"
  on public.service_requests
  for update
  to authenticated
  using (
    public.current_user_role() in ('staff', 'admin')
    and venue_id = public.current_user_venue_id()
  )
  with check (
    public.current_user_role() in ('staff', 'admin')
    and venue_id = public.current_user_venue_id()
  );

drop policy if exists "users can read their own profile" on public.profiles;
create policy "users can read their own profile"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());
