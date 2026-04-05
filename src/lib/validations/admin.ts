import { z } from "zod";

import { serviceRequestTypes, tableStatuses } from "@/lib/types";
import { tableNumberSchema } from "@/lib/validations/service-request";

const checkboxBooleanSchema = z
  .union([z.string(), z.boolean(), z.undefined(), z.null()])
  .transform((value) => {
    if (typeof value === "boolean") {
      return value;
    }

    if (!value) {
      return false;
    }

    const normalizedValue = value.trim().toLowerCase();

    return ["1", "true", "on", "yes"].includes(normalizedValue);
  });

const optionalShortTextSchema = z
  .string()
  .trim()
  .max(80, "Keep this field under 80 characters.")
  .optional()
  .transform((value) => (value && value.length > 0 ? value : undefined));

const noticeSchema = z
  .string()
  .trim()
  .min(1)
  .max(180)
  .optional()
  .transform((value) => value ?? undefined);

const entityIdSchema = z
  .string()
  .uuid("The selected record is invalid.")
  .optional()
  .transform((value) => value ?? undefined);

const requiredEntityIdSchema = z.string().uuid("The selected record is invalid.");

const adminRoutePaths = [
  "/admin",
  "/admin/tables",
  "/admin/menu",
  "/admin/actions",
] as const;

const rawPageNumberSchema = z.union([
  z
    .string()
    .trim()
    .regex(/^\d+$/, "Page must be numeric."),
  z.number().int().positive(),
]);

const seatsSchema = z
  .union([
    z
      .string()
      .trim()
      .regex(/^\d+$/, "Seats must be numeric."),
    z.number().int().positive(),
  ])
  .transform((value) =>
    typeof value === "string" ? Number.parseInt(value, 10) : value
  )
  .refine(
    (value) => Number.isInteger(value) && value > 0 && value <= 24,
    "Seats must be between 1 and 24."
  );

const priceSchema = z
  .union([
    z
      .string()
      .trim()
      .regex(/^\d+(?:\.\d{1,2})?$/, "Price must be a valid amount."),
    z.number(),
  ])
  .transform((value) =>
    typeof value === "string" ? Number.parseFloat(value) : value
  )
  .refine(
    (value) => Number.isFinite(value) && value >= 0 && value <= 99999,
    "Price must be between 0 and 99,999."
  );

const menuItemTagsSchema = z
  .string()
  .trim()
  .max(180, "Tags are too long.")
  .optional()
  .transform((value) => {
    if (!value) {
      return [];
    }

    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 8);

    return Array.from(new Set(tags));
  })
  .refine(
    (tags) => tags.every((tag) => tag.length <= 24),
    "Each tag must be 24 characters or fewer."
  );

export const adminFeedbackSchema = noticeSchema;
export const adminTableEditSchema = entityIdSchema;
export const adminMenuItemEditSchema = entityIdSchema;
export const adminEntityIdSchema = requiredEntityIdSchema;
export const adminRoutePathSchema = z.enum(adminRoutePaths);
export const qrDownloadFormatSchema = z.enum(["png", "pdf"], {
  error: "QR format is invalid.",
});
export const adminPageSchema = rawPageNumberSchema
  .optional()
  .transform((value) => {
    if (value === undefined) {
      return 1;
    }

    return typeof value === "string" ? Number.parseInt(value, 10) : value;
  })
  .refine(
    (value) => Number.isInteger(value) && value > 0 && value <= 999,
    "Page must be between 1 and 999."
  );

export const upsertTableSchema = z
  .object({
    tableId: entityIdSchema,
    tableNumber: tableNumberSchema,
    label: optionalShortTextSchema,
    zone: z
      .string()
      .trim()
      .min(1, "Zone is required.")
      .max(80, "Zone must be 80 characters or fewer."),
    seats: seatsSchema,
    status: z.enum(tableStatuses, {
      error: "Table status is invalid.",
    }),
    isActive: checkboxBooleanSchema,
  })
  .transform((value) => ({
    ...value,
    label: value.label ?? `Table ${value.tableNumber}`,
  }));

export const toggleTableActiveSchema = z.object({
  tableId: z.string().uuid("The selected table is invalid."),
  nextActive: checkboxBooleanSchema,
});

export const upsertMenuItemSchema = z.object({
  itemId: entityIdSchema,
  categoryId: z.string().uuid("Choose a valid menu category."),
  name: z
    .string()
    .trim()
    .min(1, "Item name is required.")
    .max(120, "Item name must be 120 characters or fewer."),
  description: z
    .string()
    .trim()
    .min(1, "Description is required.")
    .max(320, "Description must be 320 characters or fewer."),
  price: priceSchema,
  highlight: z
    .string()
    .trim()
    .max(60, "Highlight must be 60 characters or fewer.")
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined)),
  tags: menuItemTagsSchema,
  isAvailable: checkboxBooleanSchema,
});

export const toggleVenueActionSchema = z.object({
  actionType: z.enum(serviceRequestTypes, {
    error: "Service action is invalid.",
  }),
  enabled: checkboxBooleanSchema,
});

export type UpsertTableInput = z.infer<typeof upsertTableSchema>;
export type UpsertMenuItemInput = z.infer<typeof upsertMenuItemSchema>;
