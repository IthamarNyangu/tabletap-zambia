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
  staffRequestFilterSchema,
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
  error?: string | null;
}) {
  const searchParams = new URLSearchParams();
  const parsedFilter = staffRequestFilterSchema.safeParse(input.filter);

  if (parsedFilter.success && parsedFilter.data !== "all") {
    searchParams.set("status", parsedFilter.data);
  }

  if (input.error) {
    searchParams.set("error", input.error);
  }

  const query = searchParams.toString();

  return `/staff${query ? `?${query}` : ""}`;
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

export async function submitServiceRequestFormAction(
  _previousState: ServiceRequestActionResult,
  formData: FormData
): Promise<ServiceRequestActionResult> {
  const venueSlug = String(formData.get("venueSlug") ?? "");
  const tableNumber = String(formData.get("tableNumber") ?? "");
  const requestType = String(formData.get("requestType") ?? "");
  const note = formData.get("note");

  return createServiceRequestAction({
    venueSlug,
    tableNumber,
    requestType,
    note: typeof note === "string" ? note : undefined,
  });
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
  const { requestId, nextStatus } = parsedInput.data;

  const { data: requestData, error: requestError } = await supabase
    .from("service_requests")
    .select(
      "id, status, attended_at, venue_id, tables!service_requests_table_id_fkey(table_number), venues(slug)"
    )
    .eq("id", requestId)
    .maybeSingle();

  if (requestError) {
    return {
      success: false,
      error: "We could not load that request right now.",
    };
  }

  const currentRequest = (requestData as {
    id: string;
    status: "pending" | "attended" | "closed";
    attended_at: string | null;
    venue_id: string;
    tables: { table_number: number }[] | { table_number: number } | null;
    venues: { slug: string }[] | { slug: string } | null;
  } | null) ?? null;

  if (!currentRequest) {
    return {
      success: false,
      error: "That request could not be found.",
    };
  }

  const currentStatus = currentRequest.status;

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
          attended_at: currentRequest.attended_at ?? now,
          closed_at: now,
        };

  const { error: updateError } = await supabase
    .from("service_requests")
    .update(updatePayload)
    .eq("id", requestId);

  if (updateError) {
    return {
      success: false,
      error: "We could not update that request status.",
    };
  }

  revalidatePath("/staff");
  revalidatePath("/admin");

  const requestVenue = Array.isArray(currentRequest.venues)
    ? currentRequest.venues[0]
    : currentRequest.venues;
  const requestTable = Array.isArray(currentRequest.tables)
    ? currentRequest.tables[0]
    : currentRequest.tables;

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
  const requestId = String(formData.get("requestId") ?? "");
  const nextStatus = String(formData.get("nextStatus") ?? "");
  const filter = formData.get("filter");

  const result = await updateServiceRequestStatusAction({
    requestId,
    nextStatus,
  });

  redirect(
    resolveStaffRedirectPath({
      filter: typeof filter === "string" ? filter : null,
      error: result.success
        ? null
        : result.error ?? "We could not update that request right now.",
    })
  );
}
