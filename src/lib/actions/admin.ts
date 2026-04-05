"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type {
  MenuCategoryRow,
  ServiceActionType,
  VenueRow,
  VenueTableRow,
} from "@/lib/types";
import { requireAuthContext } from "@/lib/auth/guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  toggleTableActiveSchema,
  toggleVenueActionSchema,
  upsertMenuItemSchema,
  upsertTableSchema,
} from "@/lib/validations/admin";

function buildAdminRedirectPath(input?: {
  notice?: string | null;
  error?: string | null;
  editTableId?: string | null;
  editItemId?: string | null;
}) {
  const searchParams = new URLSearchParams();

  if (input?.notice) {
    searchParams.set("notice", input.notice);
  }

  if (input?.error) {
    searchParams.set("error", input.error);
  }

  if (input?.editTableId) {
    searchParams.set("editTable", input.editTableId);
  }

  if (input?.editItemId) {
    searchParams.set("editItem", input.editItemId);
  }

  const query = searchParams.toString();

  return `/admin${query ? `?${query}` : ""}`;
}

function buildQrCodeValue(venueSlug: string, tableNumber: number) {
  const venueCode = venueSlug
    .replace(/[^a-z0-9]/gi, "")
    .toUpperCase()
    .slice(0, 8);

  return `TT-${venueCode}-${String(tableNumber).padStart(3, "0")}`;
}

function resolveVenueActionColumn(actionType: ServiceActionType) {
  switch (actionType) {
    case "call_waiter":
      return "call_waiter_enabled";
    case "ready_to_order":
      return "ready_to_order_enabled";
    case "request_bill":
      return "request_bill_enabled";
    case "need_assistance":
      return "need_assistance_enabled";
  }
}

async function requireAdminVenue() {
  const authContext = await requireAuthContext({
    allowedRoles: ["admin"],
    nextPath: "/admin",
  });
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("venues")
    .select("*")
    .eq("id", authContext.profile.venueId)
    .maybeSingle();

  if (error || !data) {
    redirect(
      buildAdminRedirectPath({
        error: "We could not load your venue right now.",
      })
    );
  }

  return {
    supabase,
    venue: data as VenueRow,
  };
}

function finalizeAdminMutation() {
  revalidatePath("/admin");
  revalidatePath("/staff");
  revalidatePath("/v/[venueSlug]/t/[tableNumber]", "page");
}

export async function upsertTableAction(formData: FormData) {
  const parsedInput = upsertTableSchema.safeParse({
    tableId: formData.get("tableId") || undefined,
    tableNumber: formData.get("tableNumber"),
    label: formData.get("label") || undefined,
    zone: formData.get("zone"),
    seats: formData.get("seats"),
    status: formData.get("status"),
    isActive: formData.get("isActive") ?? false,
  });

  if (!parsedInput.success) {
    redirect(
      buildAdminRedirectPath({
        error:
          parsedInput.error.issues[0]?.message ??
          "We could not validate that table.",
        editTableId:
          typeof formData.get("tableId") === "string"
            ? String(formData.get("tableId"))
            : null,
      })
    );
  }

  const { supabase, venue } = await requireAdminVenue();
  const input = parsedInput.data;

  const duplicateTableQuery = supabase
    .from("tables")
    .select("id")
    .eq("venue_id", venue.id)
    .eq("table_number", input.tableNumber);

  const { data: duplicateTableData, error: duplicateTableError } = input.tableId
    ? await duplicateTableQuery.neq("id", input.tableId).maybeSingle()
    : await duplicateTableQuery.maybeSingle();

  if (duplicateTableError) {
    redirect(
      buildAdminRedirectPath({
        error: "We could not check that table number right now.",
        editTableId: input.tableId ?? null,
      })
    );
  }

  if (duplicateTableData) {
    redirect(
      buildAdminRedirectPath({
        error: "That table number already exists for this venue.",
        editTableId: input.tableId ?? null,
      })
    );
  }

  const qrCodeValue = buildQrCodeValue(venue.slug, input.tableNumber);

  if (input.tableId) {
    const { data: existingTableData, error: existingTableError } = await supabase
      .from("tables")
      .select("id, table_number")
      .eq("id", input.tableId)
      .eq("venue_id", venue.id)
      .maybeSingle();

    if (existingTableError || !existingTableData) {
      redirect(
        buildAdminRedirectPath({
          error: "That table could not be found for this venue.",
        })
      );
    }

    const existingTable = existingTableData as Pick<
      VenueTableRow,
      "id" | "table_number"
    >;
    const updatePayload = {
      table_number: input.tableNumber,
      label: input.label,
      zone: input.zone,
      seats: input.seats,
      status: input.status,
      is_active: input.isActive,
      ...(existingTable.table_number !== input.tableNumber
        ? {
            qr_code_value: qrCodeValue,
          }
        : {}),
    };
    const { error: updateError } = await supabase
      .from("tables")
      .update(updatePayload)
      .eq("id", existingTable.id)
      .eq("venue_id", venue.id);

    if (updateError) {
      redirect(
        buildAdminRedirectPath({
          error: "We could not save that table right now.",
          editTableId: input.tableId,
        })
      );
    }

    finalizeAdminMutation();

    redirect(
      buildAdminRedirectPath({
        notice: `Saved ${input.label}.`,
      })
    );
  }

  const { error: insertError } = await supabase.from("tables").insert({
    venue_id: venue.id,
    table_number: input.tableNumber,
    label: input.label,
    zone: input.zone,
    seats: input.seats,
    status: input.status,
    is_active: input.isActive,
    qr_code_value: qrCodeValue,
  });

  if (insertError) {
    redirect(
      buildAdminRedirectPath({
        error: "We could not create that table right now.",
      })
    );
  }

  finalizeAdminMutation();

  redirect(
    buildAdminRedirectPath({
      notice: `${input.label} was created.`,
    })
  );
}

export async function toggleTableActiveAction(formData: FormData) {
  const parsedInput = toggleTableActiveSchema.safeParse({
    tableId: formData.get("tableId"),
    nextActive: formData.get("nextActive"),
  });

  if (!parsedInput.success) {
    redirect(
      buildAdminRedirectPath({
        error:
          parsedInput.error.issues[0]?.message ??
          "We could not update that table.",
      })
    );
  }

  const { supabase, venue } = await requireAdminVenue();
  const { data: tableData, error: tableError } = await supabase
    .from("tables")
    .select("id, label")
    .eq("id", parsedInput.data.tableId)
    .eq("venue_id", venue.id)
    .maybeSingle();

  if (tableError || !tableData) {
    redirect(
      buildAdminRedirectPath({
        error: "That table could not be found for this venue.",
      })
    );
  }

  const table = tableData as Pick<VenueTableRow, "id" | "label">;
  const { error: updateError } = await supabase
    .from("tables")
    .update({
      is_active: parsedInput.data.nextActive,
    })
    .eq("id", table.id)
    .eq("venue_id", venue.id);

  if (updateError) {
    redirect(
      buildAdminRedirectPath({
        error: "We could not update that table right now.",
      })
    );
  }

  finalizeAdminMutation();

  redirect(
    buildAdminRedirectPath({
      notice: parsedInput.data.nextActive
        ? `${table.label} is active again.`
        : `${table.label} was deactivated.`,
    })
  );
}

export async function upsertMenuItemAction(formData: FormData) {
  const parsedInput = upsertMenuItemSchema.safeParse({
    itemId: formData.get("itemId") || undefined,
    categoryId: formData.get("categoryId"),
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    highlight: formData.get("highlight") || undefined,
    tags: formData.get("tags") || undefined,
    isAvailable: formData.get("isAvailable") ?? false,
  });

  if (!parsedInput.success) {
    redirect(
      buildAdminRedirectPath({
        error:
          parsedInput.error.issues[0]?.message ??
          "We could not validate that menu item.",
        editItemId:
          typeof formData.get("itemId") === "string"
            ? String(formData.get("itemId"))
            : null,
      })
    );
  }

  const { supabase, venue } = await requireAdminVenue();
  const input = parsedInput.data;
  const { data: categoryData, error: categoryError } = await supabase
    .from("menu_categories")
    .select("id, name, venue_id")
    .eq("id", input.categoryId)
    .eq("venue_id", venue.id)
    .maybeSingle();

  if (categoryError || !categoryData) {
    redirect(
      buildAdminRedirectPath({
        error: "Choose a menu category from this venue.",
        editItemId: input.itemId ?? null,
      })
    );
  }

  const category = categoryData as Pick<MenuCategoryRow, "id" | "name" | "venue_id">;

  if (input.itemId) {
    const { data: existingItemData, error: existingItemError } = await supabase
      .from("menu_items")
      .select("id")
      .eq("id", input.itemId)
      .maybeSingle();

    if (existingItemError || !existingItemData) {
      redirect(
        buildAdminRedirectPath({
          error: "That menu item could not be found for this venue.",
        })
      );
    }

    const { error: updateError } = await supabase
      .from("menu_items")
      .update({
        category_id: category.id,
        name: input.name,
        description: input.description,
        price: input.price,
        highlight: input.highlight ?? null,
        tags: input.tags,
        is_available: input.isAvailable,
      })
      .eq("id", input.itemId);

    if (updateError) {
      redirect(
        buildAdminRedirectPath({
          error: "We could not save that menu item right now.",
          editItemId: input.itemId,
        })
      );
    }

    finalizeAdminMutation();

    redirect(
      buildAdminRedirectPath({
        notice: `${input.name} was updated.`,
      })
    );
  }

  const { data: existingCategoryItems, error: sortOrderError } = await supabase
    .from("menu_items")
    .select("id")
    .eq("category_id", category.id);

  if (sortOrderError) {
    redirect(
      buildAdminRedirectPath({
        error: "We could not prepare that menu item right now.",
      })
    );
  }

  const sortOrder = (existingCategoryItems?.length ?? 0) + 1;
  const { error: insertError } = await supabase.from("menu_items").insert({
    category_id: category.id,
    name: input.name,
    description: input.description,
    price: input.price,
    highlight: input.highlight ?? null,
    tags: input.tags,
    is_available: input.isAvailable,
    sort_order: sortOrder,
  });

  if (insertError) {
    redirect(
      buildAdminRedirectPath({
        error: "We could not create that menu item right now.",
      })
    );
  }

  finalizeAdminMutation();

  redirect(
    buildAdminRedirectPath({
      notice: `${input.name} was added to ${category.name}.`,
    })
  );
}

export async function toggleVenueActionAction(formData: FormData) {
  const parsedInput = toggleVenueActionSchema.safeParse({
    actionType: formData.get("actionType"),
    enabled: formData.get("enabled"),
  });

  if (!parsedInput.success) {
    redirect(
      buildAdminRedirectPath({
        error:
          parsedInput.error.issues[0]?.message ??
          "We could not update that venue action.",
      })
    );
  }

  const { supabase, venue } = await requireAdminVenue();
  const { data: actionSettingsData, error: actionSettingsError } = await supabase
    .from("venue_actions")
    .select("id")
    .eq("venue_id", venue.id)
    .maybeSingle();

  if (actionSettingsError || !actionSettingsData) {
    redirect(
      buildAdminRedirectPath({
        error: "This venue does not have action settings yet.",
      })
    );
  }

  const columnName = resolveVenueActionColumn(parsedInput.data.actionType);
  const updatePayload = {
    [columnName]: parsedInput.data.enabled,
  };

  const { error: updateError } = await supabase
    .from("venue_actions")
    .update(updatePayload)
    .eq("venue_id", venue.id);

  if (updateError) {
    redirect(
      buildAdminRedirectPath({
        error: "We could not update that venue action right now.",
      })
    );
  }

  finalizeAdminMutation();

  redirect(
    buildAdminRedirectPath({
      notice: parsedInput.data.enabled
        ? "That service action is now enabled."
        : "That service action is now disabled.",
    })
  );
}
