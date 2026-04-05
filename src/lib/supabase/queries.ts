import "server-only";

import type {
  AdminDashboardData,
  CustomerTablePageData,
  MenuCategory,
  MenuCategoryWithItemsRow,
  MenuItem,
  MenuItemRow,
  ServiceAction,
  ServiceActionType,
  ServiceRequest,
  ServiceRequestWithTableRow,
  StaffDashboardData,
  Venue,
  VenueActions,
  VenueActionsRow,
  VenueRow,
  VenueTable,
  VenueTableRow,
} from "@/lib/types";
import {
  serviceActionDefinitions,
  serviceRequestTypes,
} from "@/lib/types";
import {
  createSupabasePublicServerClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";

function mapVenue(row: VenueRow): Venue {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    tagline: row.tagline,
    location: row.location,
    description: row.description,
    ambienceNote: row.ambience_note,
    createdAt: row.created_at,
  };
}

function mapVenueTable(row: VenueTableRow): VenueTable {
  return {
    id: row.id,
    venueId: row.venue_id,
    tableNumber: row.table_number,
    label: row.label,
    zone: row.zone,
    seats: row.seats,
    status: row.status,
    isActive: row.is_active,
    qrCodeValue: row.qr_code_value,
    createdAt: row.created_at,
  };
}

function mapMenuItem(row: MenuItemRow): MenuItem {
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    highlight: row.highlight,
    tags: row.tags ?? [],
    isAvailable: row.is_available,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

function mapMenuCategory(
  row: MenuCategoryWithItemsRow,
  options?: { includeUnavailable?: boolean }
): MenuCategory {
  const includeUnavailable = options?.includeUnavailable ?? false;
  const items = (row.menu_items ?? [])
    .map(mapMenuItem)
    .filter((item) => includeUnavailable || item.isAvailable)
    .sort((left, right) => left.sortOrder - right.sortOrder);

  return {
    id: row.id,
    venueId: row.venue_id,
    name: row.name,
    description: row.description,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    items,
  };
}

function mapVenueActions(row: VenueActionsRow): VenueActions {
  return {
    id: row.id,
    venueId: row.venue_id,
    callWaiterEnabled: row.call_waiter_enabled,
    readyToOrderEnabled: row.ready_to_order_enabled,
    requestBillEnabled: row.request_bill_enabled,
    needAssistanceEnabled: row.need_assistance_enabled,
    createdAt: row.created_at,
  };
}

function mapServiceRequest(row: ServiceRequestWithTableRow): ServiceRequest {
  const tableRelation = Array.isArray(row.tables) ? row.tables[0] : row.tables;

  return {
    id: row.id,
    venueId: row.venue_id,
    tableId: row.table_id,
    tableNumber: tableRelation?.table_number ?? 0,
    requestType: row.request_type,
    status: row.status,
    note: row.note,
    createdAt: row.created_at,
    attendedAt: row.attended_at,
    closedAt: row.closed_at,
  };
}

function isActionEnabled(
  settings: VenueActions,
  requestType: ServiceActionType
) {
  switch (requestType) {
    case "call_waiter":
      return settings.callWaiterEnabled;
    case "ready_to_order":
      return settings.readyToOrderEnabled;
    case "request_bill":
      return settings.requestBillEnabled;
    case "need_assistance":
      return settings.needAssistanceEnabled;
  }
}

export function resolveServiceActions(settings: VenueActions): ServiceAction[] {
  return serviceRequestTypes.map((requestType) => ({
    ...serviceActionDefinitions[requestType],
    enabled: isActionEnabled(settings, requestType),
  }));
}

export async function getCustomerTablePageData(input: {
  venueSlug: string;
  tableNumber: number;
}): Promise<CustomerTablePageData | null> {
  const supabase = createSupabasePublicServerClient();

  const { data: venueData, error: venueError } = await supabase
    .from("venues")
    .select("*")
    .eq("slug", input.venueSlug)
    .maybeSingle();

  if (venueError) {
    throw new Error(`Failed to load venue: ${venueError.message}`);
  }

  const venueRow = (venueData as VenueRow | null) ?? null;

  if (!venueRow) {
    return null;
  }

  const [{ data: tableData, error: tableError }, { data: actionsData, error: actionsError }, { data: categoriesData, error: categoriesError }] =
    await Promise.all([
      supabase
        .from("tables")
        .select("*")
        .eq("venue_id", venueRow.id)
        .eq("is_active", true)
        .eq("table_number", input.tableNumber)
        .maybeSingle(),
      supabase
        .from("venue_actions")
        .select("*")
        .eq("venue_id", venueRow.id)
        .maybeSingle(),
      supabase
        .from("menu_categories")
        .select("*, menu_items(*)")
        .eq("venue_id", venueRow.id),
    ]);

  if (tableError) {
    throw new Error(`Failed to load table: ${tableError.message}`);
  }

  if (actionsError) {
    throw new Error(`Failed to load venue actions: ${actionsError.message}`);
  }

  if (categoriesError) {
    throw new Error(`Failed to load menu categories: ${categoriesError.message}`);
  }

  if (!tableData || !actionsData) {
    return null;
  }

  const menuCategories = ((categoriesData ?? []) as MenuCategoryWithItemsRow[])
    .map((row) => mapMenuCategory(row))
    .sort((left, right) => left.sortOrder - right.sortOrder);

  const venueActions = mapVenueActions(actionsData as VenueActionsRow);
  const serviceActions = resolveServiceActions(venueActions).filter(
    (action) => action.enabled
  );
  const specials =
    menuCategories.find((category) => category.name.toLowerCase() === "specials")
      ?.items ?? [];

  return {
    venue: mapVenue(venueRow),
    table: mapVenueTable(tableData as VenueTableRow),
    menuCategories,
    specials,
    venueActions,
    serviceActions,
  };
}

async function getVenueById(
  venueId: string,
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>
) {
  const { data, error } = await supabase
    .from("venues")
    .select("*")
    .eq("id", venueId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load venue: ${error.message}`);
  }

  return (data as VenueRow | null) ?? null;
}

export async function getStaffDashboardData(
  venueId: string
): Promise<StaffDashboardData | null> {
  const supabase = await createSupabaseServerClient();
  const venueRow = await getVenueById(venueId, supabase);

  if (!venueRow) {
    return null;
  }

  const { data, error } = await supabase
    .from("service_requests")
    .select(
      "id, venue_id, table_id, request_type, status, note, created_at, attended_at, closed_at, tables!service_requests_table_id_fkey(table_number)"
    )
    .eq("venue_id", venueRow.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load service requests: ${error.message}`);
  }

  return {
    venue: mapVenue(venueRow),
    requests: ((data ?? []) as ServiceRequestWithTableRow[]).map(
      mapServiceRequest
    ),
  };
}

export async function getAdminDashboardData(
  venueId: string
): Promise<AdminDashboardData | null> {
  const supabase = await createSupabaseServerClient();
  const venueRow = await getVenueById(venueId, supabase);

  if (!venueRow) {
    return null;
  }

  const [
    { data: tablesData, error: tablesError },
    { data: categoriesData, error: categoriesError },
    { data: actionsData, error: actionsError },
    { data: requestsData, error: requestsError },
  ] = await Promise.all([
    supabase
      .from("tables")
      .select("*")
      .eq("venue_id", venueRow.id)
      .order("table_number", { ascending: true }),
    supabase
      .from("menu_categories")
      .select("*, menu_items(*)")
      .eq("venue_id", venueRow.id),
    supabase
      .from("venue_actions")
      .select("*")
      .eq("venue_id", venueRow.id)
      .maybeSingle(),
    supabase
      .from("service_requests")
      .select("id, status")
      .eq("venue_id", venueRow.id),
  ]);

  if (tablesError) {
    throw new Error(`Failed to load tables: ${tablesError.message}`);
  }

  if (categoriesError) {
    throw new Error(`Failed to load menu categories: ${categoriesError.message}`);
  }

  if (actionsError) {
    throw new Error(`Failed to load venue actions: ${actionsError.message}`);
  }

  if (requestsError) {
    throw new Error(`Failed to load request summary: ${requestsError.message}`);
  }

  if (!actionsData) {
    return null;
  }

  const tables = ((tablesData ?? []) as VenueTableRow[])
    .map(mapVenueTable)
    .sort((left, right) => left.tableNumber - right.tableNumber);

  const menuCategories = ((categoriesData ?? []) as MenuCategoryWithItemsRow[])
    .map((row) => mapMenuCategory(row, { includeUnavailable: true }))
    .sort((left, right) => left.sortOrder - right.sortOrder);

  const venueActions = mapVenueActions(actionsData as VenueActionsRow);
  const serviceActions = resolveServiceActions(venueActions);
  const requestSummary = (requestsData ?? []) as { id: string; status: string }[];

  return {
    venue: mapVenue(venueRow),
    tables,
    menuCategories,
    venueActions,
    serviceActions,
    requestCount: requestSummary.length,
    activeRequestCount: requestSummary.filter(
      (request) => request.status !== "closed"
    ).length,
  };
}
