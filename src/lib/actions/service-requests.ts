"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type {
  ServiceActionType,
  ServiceRequestActionResult,
  ServiceRequestStatusActionResult,
  VenueActionsRow,
  VenueRow,
  VenueTableRow,
} from "@/lib/types";
import { serviceActionDefinitions } from "@/lib/types";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import {
  createServiceRequestSchema,
  customerViewSchema,
  staffRequestFilterSchema,
  staffPageSchema,
  updateServiceRequestStatusSchema,
} from "@/lib/validations/service-request";

function isRequestTypeEnabled(
  settings: VenueActionsRow,
  requestType: ServiceActionType
) {
  switch (requestType) {
    case "call_waiter":
      return settings.call_waiter_enabled;
    case "ready_to_order":
      return settings.ready_to_order_enabled;
    case "request_bill":
      return settings.request_bill_enabled;
    case "need_assistance":
      return settings.need_assistance_enabled;
  }
}

function resolveStaffRedirectPath(input: {
  filter?: string | null;
  page?: string | null;
  error?: string | null;
}) {
  const searchParams = new URLSearchParams();
  const parsedFilter = staffRequestFilterSchema.safeParse(input.filter);
  const parsedPage = staffPageSchema.safeParse(input.page);

  if (parsedFilter.success && parsedFilter.data !== "all") {
    searchParams.set("status", parsedFilter.data);
  }

  if (parsedPage.success && parsedPage.data > 1) {
    searchParams.set("page", String(parsedPage.data));
  }

  if (input.error) {
    searchParams.set("error", input.error);
  }

  const query = searchParams.toString();

  return `/staff${query ? `?${query}` : ""}`;
}

function resolveCustomerRedirectPath(input: {
  venueSlug: string;
  tableNumber: number;
  view?: string | null;
  notice?: string | null;
  sent?: string | null;
  error?: string | null;
}) {
  const searchParams = new URLSearchParams();
  const parsedView = customerViewSchema.safeParse(input.view);

  if (parsedView.success && parsedView.data === "menu") {
    searchParams.set("view", "menu");
  }

  if (input.notice) {
    searchParams.set("notice", input.notice);
  }

  if (input.sent) {
    searchParams.set("sent", input.sent);
  }

  if (input.error) {
    searchParams.set("error", input.error);
  }

  const query = searchParams.toString();

  return `/v/${input.venueSlug}/t/${input.tableNumber}${query ? `?${query}` : ""}`;
}

export async function createServiceRequestAction(
  input: unknown
): Promise<ServiceRequestActionResult> {
  const parsedInput = createServiceRequestSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      success: false,
      error:
        parsedInput.error.issues[0]?.message ??
        "We could not validate that request.",
    };
  }

  const supabase = createSupabaseServiceRoleClient();
  const { venueSlug, tableNumber, requestType, note } = parsedInput.data;

  const { data: venueData, error: venueError } = await supabase
    .from("venues")
    .select("id, slug")
    .eq("slug", venueSlug)
    .maybeSingle();

  if (venueError) {
    return {
      success: false,
      error: "We could not load this venue right now.",
    };
  }

  const venue = (venueData as Pick<VenueRow, "id" | "slug"> | null) ?? null;

  if (!venue) {
    return {
      success: false,
      error: "This venue could not be found.",
    };
  }

  const { data: tableData, error: tableError } = await supabase
    .from("tables")
    .select("id, table_number")
    .eq("venue_id", venue.id)
    .eq("table_number", tableNumber)
    .maybeSingle();

  if (tableError) {
    return {
      success: false,
      error: "We could not verify this table right now.",
    };
  }

  const table =
    (tableData as Pick<VenueTableRow, "id" | "table_number"> | null) ?? null;

  if (!table) {
    return {
      success: false,
      error: "That table does not belong to this venue.",
    };
  }

  const { data: actionsData, error: actionsError } = await supabase
    .from("venue_actions")
    .select("*")
    .eq("venue_id", venue.id)
    .maybeSingle();

  if (actionsError) {
    return {
      success: false,
      error: "We could not load venue service settings right now.",
    };
  }

  const venueActions = (actionsData as VenueActionsRow | null) ?? null;

  if (!venueActions || !isRequestTypeEnabled(venueActions, requestType)) {
    return {
      success: false,
      error: "That service action is not currently available for this venue.",
    };
  }

  const { data: insertedRequest, error: insertError } = await supabase
    .from("service_requests")
    .insert({
      venue_id: venue.id,
      table_id: table.id,
      request_type: requestType,
      status: "pending",
      note: note ?? null,
    })
    .select("id")
    .maybeSingle();

  if (insertError) {
    return {
      success: false,
      error: "We could not send your request. Please try again.",
    };
  }

  revalidatePath(`/v/${venue.slug}/t/${table.table_number}`);
  revalidatePath("/staff");
  revalidatePath("/admin");

  return {
    success: true,
    message: serviceActionDefinitions[requestType].successMessage,
    requestId: insertedRequest?.id,
  };
}

export async function submitCustomerServiceRequestAction(formData: FormData) {
  const venueSlug = String(formData.get("venueSlug") ?? "");
  const tableNumber = String(formData.get("tableNumber") ?? "");
  const requestType = String(formData.get("requestType") ?? "");
  const view = formData.get("view");
  const note = formData.get("note");

  const result = await createServiceRequestAction({
    venueSlug,
    tableNumber,
    requestType,
    note: typeof note === "string" ? note : undefined,
  });

  const parsedInput = createServiceRequestSchema.safeParse({
    venueSlug,
    tableNumber,
    requestType,
    note: typeof note === "string" ? note : undefined,
  });

  if (!parsedInput.success) {
    redirect(
      resolveCustomerRedirectPath({
        venueSlug,
        tableNumber: Number.parseInt(tableNumber || "0", 10) || 0,
        view: typeof view === "string" ? view : null,
        error: result.error ?? "We could not send your request.",
      })
    );
  }

  redirect(
    resolveCustomerRedirectPath({
      venueSlug: parsedInput.data.venueSlug,
      tableNumber: parsedInput.data.tableNumber,
      view: typeof view === "string" ? view : null,
      notice: result.success ? parsedInput.data.requestType : null,
      error: result.success
        ? null
        : result.error ?? "We could not send your request.",
    })
  );
}

export async function updateServiceRequestStatusAction(
  input: unknown
): Promise<ServiceRequestStatusActionResult> {
  const parsedInput = updateServiceRequestStatusSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      success: false,
      error:
        parsedInput.error.issues[0]?.message ??
        "We could not validate that status update.",
    };
  }

  const supabase = createSupabaseServiceRoleClient();
  const { requestIds, nextStatus } = parsedInput.data;

  const { data: requestData, error: requestError } = await supabase
    .from("service_requests")
    .select(
      "id, status, request_type, table_id, attended_at, venue_id, tables!service_requests_table_id_fkey(table_number), venues(slug)"
    )
    .in("id", requestIds);

  if (requestError) {
    return {
      success: false,
      error: "We could not load that request right now.",
    };
  }

  const currentRequests = ((requestData ?? []) as {
    id: string;
    status: "pending" | "attended" | "closed";
    request_type: ServiceActionType;
    table_id: string;
    attended_at: string | null;
    venue_id: string;
    tables: { table_number: number }[] | { table_number: number } | null;
    venues: { slug: string }[] | { slug: string } | null;
  }[]).filter(Boolean);

  if (!currentRequests.length || currentRequests.length !== requestIds.length) {
    return {
      success: false,
      error: "One or more requests could not be found.",
    };
  }

  const currentStatus = currentRequests[0]?.status;

  if (
    currentRequests.some(
      (request) =>
        request.status !== currentStatus ||
        request.venue_id !== currentRequests[0]?.venue_id ||
        request.table_id !== currentRequests[0]?.table_id ||
        request.request_type !== currentRequests[0]?.request_type
    )
  ) {
    return {
      success: false,
      error: "Those requests could not be updated as a single group.",
    };
  }

  if (nextStatus === "attended" && currentStatus !== "pending") {
    return {
      success: false,
      error: "Only pending requests can be marked as attended.",
    };
  }

  if (nextStatus === "closed" && currentStatus !== "attended") {
    return {
      success: false,
      error: "Only attended requests can be closed.",
    };
  }

  const now = new Date().toISOString();
  const updatePayload =
    nextStatus === "attended"
      ? {
          status: "attended" as const,
          attended_at: now,
          closed_at: null,
        }
      : {
          status: "closed" as const,
          attended_at:
            currentRequests.find((request) => request.attended_at)?.attended_at ??
            now,
          closed_at: now,
        };

  const { error: updateError } = await supabase
    .from("service_requests")
    .update(updatePayload)
    .in("id", requestIds);

  if (updateError) {
    return {
      success: false,
      error: "We could not update that request status.",
    };
  }

  revalidatePath("/staff");
  revalidatePath("/admin");

  const primaryRequest = currentRequests[0];
  const requestVenue = Array.isArray(primaryRequest?.venues)
    ? primaryRequest.venues[0]
    : primaryRequest?.venues;
  const requestTable = Array.isArray(primaryRequest?.tables)
    ? primaryRequest.tables[0]
    : primaryRequest?.tables;

  if (requestVenue?.slug && requestTable?.table_number) {
    revalidatePath(
      `/v/${requestVenue.slug}/t/${requestTable.table_number}`
    );
  }

  return {
    success: true,
  };
}

export async function submitStaffStatusUpdateFormAction(formData: FormData) {
  const requestIds = formData
    .getAll("requestIds")
    .map((value) => String(value))
    .filter(Boolean);
  const nextStatus = String(formData.get("nextStatus") ?? "");
  const filter = formData.get("filter");
  const page = formData.get("page");

  const result = await updateServiceRequestStatusAction({
    requestIds,
    nextStatus,
  });

  redirect(
    resolveStaffRedirectPath({
      filter: typeof filter === "string" ? filter : null,
      page: typeof page === "string" ? page : null,
      error: result.success
        ? null
        : result.error ?? "We could not update that request right now.",
    })
  );
}
