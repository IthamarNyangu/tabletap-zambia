-- Phase 3 auth/profile setup
-- 1. Create these users first in Supabase Dashboard > Authentication > Users:
--    - grandaddies-admin@example.com
--    - grandaddies-staff@example.com
-- 2. Confirm both users if email confirmation is enabled.
-- 3. Run the statements below after the users exist in auth.users.

insert into public.profiles (id, venue_id, full_name, role, is_active)
select
  users.id,
  venues.id,
  'Grandaddies Admin',
  'admin',
  true
from auth.users as users
join public.venues as venues
  on venues.slug = 'grandaddies'
where users.email = 'grandaddies-admin@example.com'
on conflict (id) do update
set
  venue_id = excluded.venue_id,
  full_name = excluded.full_name,
  role = excluded.role,
  is_active = excluded.is_active;

insert into public.profiles (id, venue_id, full_name, role, is_active)
select
  users.id,
  venues.id,
  'Grandaddies Staff',
  'staff',
  true
from auth.users as users
join public.venues as venues
  on venues.slug = 'grandaddies'
where users.email = 'grandaddies-staff@example.com'
on conflict (id) do update
set
  venue_id = excluded.venue_id,
  full_name = excluded.full_name,
  role = excluded.role,
  is_active = excluded.is_active;
