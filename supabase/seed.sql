truncate table
  public.service_requests,
  public.menu_items,
  public.menu_categories,
  public.tables,
  public.venue_actions,
  public.venues
restart identity cascade;

insert into public.venues (
  name,
  slug,
  tagline,
  location,
  description,
  ambience_note
)
values (
  'Grandaddies',
  'grandaddies',
  'Relaxed table service for food, drinks, and social nights out in Lusaka',
  'Roma, Lusaka',
  'Grandaddies is a warm, social venue designed for casual meals, easy drinks, and fast table service without losing the hospitality feel.',
  'Built to stay comfortable on phones in bright outdoor light, evening patio settings, and busy indoor service periods.'
);

insert into public.tables (
  venue_id,
  table_number,
  label,
  zone,
  seats,
  status,
  qr_code_value
)
select
  venue.id,
  seeded.table_number,
  'Table ' || seeded.table_number,
  seeded.zone,
  seeded.seats,
  seeded.status::public.table_status,
  seeded.qr_code_value
from public.venues as venue
cross join (
  values
    (1, 'Front Patio', 2, 'ready', 'TT-GRAND-001'),
    (2, 'Front Patio', 2, 'occupied', 'TT-GRAND-002'),
    (3, 'Front Patio', 4, 'ready', 'TT-GRAND-003'),
    (4, 'Main Hall', 4, 'occupied', 'TT-GRAND-004'),
    (5, 'Main Hall', 4, 'ready', 'TT-GRAND-005'),
    (6, 'Main Hall', 6, 'reserved', 'TT-GRAND-006'),
    (7, 'Garden Deck', 4, 'occupied', 'TT-GRAND-007'),
    (8, 'Garden Deck', 4, 'ready', 'TT-GRAND-008'),
    (9, 'Garden Deck', 6, 'ready', 'TT-GRAND-009'),
    (10, 'Garden Deck', 6, 'occupied', 'TT-GRAND-010'),
    (11, 'Sports Corner', 2, 'ready', 'TT-GRAND-011'),
    (12, 'Sports Corner', 4, 'occupied', 'TT-GRAND-012'),
    (13, 'Sports Corner', 4, 'ready', 'TT-GRAND-013'),
    (14, 'Private Nook', 6, 'reserved', 'TT-GRAND-014'),
    (15, 'Private Nook', 8, 'ready', 'TT-GRAND-015')
) as seeded (table_number, zone, seats, status, qr_code_value)
where venue.slug = 'grandaddies';

insert into public.menu_categories (
  venue_id,
  name,
  description,
  sort_order
)
select
  venue.id,
  seeded.name,
  seeded.description,
  seeded.sort_order
from public.venues as venue
cross join (
  values
    ('Food', 'Grandaddies kitchen favourites for casual dining and sharing.', 1),
    ('Drinks', 'Cold pours, mocktails, and easy sippers for long sessions.', 2),
    ('Specials', 'Limited features pushed to the top of the customer experience.', 3)
) as seeded (name, description, sort_order)
where venue.slug = 'grandaddies';

insert into public.menu_items (
  category_id,
  name,
  description,
  price,
  highlight,
  tags,
  is_available,
  sort_order
)
select
  category.id,
  seeded.name,
  seeded.description,
  seeded.price,
  seeded.highlight,
  seeded.tags,
  seeded.is_available,
  seeded.sort_order
from public.menu_categories as category
join public.venues as venue
  on venue.id = category.venue_id
join (
  values
    ('Food', 'Signature Beef Burger', 'Flame-grilled beef patty, cheddar, caramelized onions, fries.', 145.00, 'Best seller', array['Popular', 'Lunch'], true, 1),
    ('Food', 'Crispy Chicken Wrap', 'Spiced chicken strips, slaw, chipotle mayo, and hand-cut fries.', 118.00, null, array['Casual'], true, 2),
    ('Food', 'Braai Platter', 'Village chicken, beef strips, grilled sausage, and cassava wedges.', 265.00, 'Shareable', array['Braai', 'Sharing'], true, 3),
    ('Food', 'Tilapia Fillet Bowl', 'Pan-seared tilapia, coconut rice, tomato salsa, and greens.', 176.00, null, array['Seafood'], true, 4),
    ('Food', 'Pepper Steak and Chips', 'Tender beef strips in pepper sauce with crispy chips.', 198.00, null, array['Dinner'], true, 5),
    ('Drinks', 'Passion Fruit Cooler', 'Fresh passion fruit, citrus, soda, and mint over ice.', 46.00, null, array['Alcohol-free', 'Refreshing'], true, 1),
    ('Drinks', 'Sunset Mule', 'Vodka, ginger beer, lime, and aromatic bitters.', 84.00, 'House pour', array['Cocktail'], true, 2),
    ('Drinks', 'Cold Brew Tonic', 'Local cold brew topped with tonic and orange peel.', 52.00, null, array['Coffee'], true, 3),
    ('Drinks', 'Berry Mojito Mocktail', 'Mint, lime, berries, and soda with crushed ice.', 48.00, null, array['Alcohol-free'], true, 4),
    ('Drinks', 'Premium Lager Bucket', 'Five ice-cold lagers served for the table.', 180.00, 'Group pick', array['Bucket', 'Sharing'], true, 5),
    ('Specials', 'Friday Grill Board', 'Beef skewers, peri-peri wings, sausage, and garden salad.', 285.00, 'Today only', array['Special'], true, 1),
    ('Specials', 'Hibiscus Spritz', 'A chilled hibiscus and citrus long drink for warm evenings.', 72.00, 'Limited run', array['Special', 'Cocktail'], true, 2),
    ('Specials', 'Chef''s Loaded Nachos', 'Beef mince, salsa, jalapenos, cheese sauce, and sour cream.', 132.00, 'Game night pick', array['Special', 'Sharing'], true, 3)
) as seeded (category_name, name, description, price, highlight, tags, is_available, sort_order)
  on seeded.category_name = category.name
where venue.slug = 'grandaddies';

insert into public.venue_actions (
  venue_id,
  call_waiter_enabled,
  ready_to_order_enabled,
  request_bill_enabled,
  need_assistance_enabled
)
select
  id,
  true,
  true,
  true,
  true
from public.venues
where slug = 'grandaddies';

insert into public.service_requests (
  venue_id,
  table_id,
  request_type,
  status,
  note,
  created_at,
  attended_at,
  closed_at
)
select
  venue.id,
  table_row.id,
  seeded.request_type::public.service_request_type,
  seeded.status::public.service_request_status,
  seeded.note,
  timezone('utc', now()) - seeded.created_offset,
  case
    when seeded.status in ('attended', 'closed')
      then timezone('utc', now()) - seeded.attended_offset
    else null
  end,
  case
    when seeded.status = 'closed'
      then timezone('utc', now()) - seeded.closed_offset
    else null
  end
from public.venues as venue
join public.tables as table_row
  on table_row.venue_id = venue.id
join (
  values
    (2, 'call_waiter', 'pending', 'Ready to order mains.', interval '6 minutes', interval '0 minutes', interval '0 minutes'),
    (3, 'ready_to_order', 'pending', 'Guests are settled and ready to place their first round.', interval '4 minutes', interval '0 minutes', interval '0 minutes'),
    (4, 'request_bill', 'attended', 'Need a split bill for two cards.', interval '12 minutes', interval '4 minutes', interval '0 minutes'),
    (7, 'need_assistance', 'pending', 'Guest wants to confirm allergens.', interval '9 minutes', interval '0 minutes', interval '0 minutes'),
    (10, 'call_waiter', 'closed', 'Dessert menu already delivered.', interval '24 minutes', interval '18 minutes', interval '8 minutes'),
    (12, 'request_bill', 'closed', null, interval '30 minutes', interval '20 minutes', interval '10 minutes')
) as seeded (table_number, request_type, status, note, created_offset, attended_offset, closed_offset)
  on seeded.table_number = table_row.table_number
where venue.slug = 'grandaddies';
