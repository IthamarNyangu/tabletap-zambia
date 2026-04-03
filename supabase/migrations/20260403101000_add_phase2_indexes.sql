create index if not exists idx_tables_venue_id
  on public.tables (venue_id);

create index if not exists idx_tables_venue_id_table_number
  on public.tables (venue_id, table_number);

create index if not exists idx_menu_categories_venue_id_sort_order
  on public.menu_categories (venue_id, sort_order);

create index if not exists idx_menu_items_category_id_sort_order
  on public.menu_items (category_id, sort_order);

create index if not exists idx_service_requests_venue_id_created_at
  on public.service_requests (venue_id, created_at desc);

create index if not exists idx_service_requests_venue_id_status_created_at
  on public.service_requests (venue_id, status, created_at desc);
