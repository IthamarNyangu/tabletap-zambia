alter type public.service_request_type
  add value if not exists 'ready_to_order';

alter table public.venue_actions
  add column if not exists ready_to_order_enabled boolean not null default true;
