import { z } from "zod";

import {
  serviceRequestStatuses,
  serviceRequestTypes,
} from "@/lib/types";

const updatableServiceRequestStatuses = ["attended", "closed"] as const;
const customerViewModes = ["home", "menu"] as const;
const staffRequestFilters = [
  "all",
  ...serviceRequestStatuses,
] as const;

export const venueSlugSchema = z
  .string()
  .trim()
  .min(1, "Venue slug is required.")
  .max(120, "Venue slug is too long.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Venue slug must use lowercase letters, numbers, and hyphens only."
  );

const rawTableNumberSchema = z.union([
  z
    .string()
    .trim()
    .regex(/^\d+$/, "Table number must be numeric."),
  z.number().int().positive(),
]);

export const tableNumberSchema = rawTableNumberSchema
  .transform((value) =>
    typeof value === "string" ? Number.parseInt(value, 10) : value
  )
  .refine(
    (value) => Number.isInteger(value) && value > 0 && value <= 9999,
    "Table number must be between 1 and 9999."
  );

export const requestTypeSchema = z.enum(serviceRequestTypes, {
  error: "Request type is invalid.",
});

export const optionalNoteSchema = z
  .string()
  .trim()
  .max(240, "Note must be 240 characters or fewer.")
  .optional()
  .transform((value) => (value && value.length > 0 ? value : undefined));

export const customerRouteParamsSchema = z.object({
  venueSlug: venueSlugSchema,
  tableNumber: tableNumberSchema,
});

export const customerViewSchema = z
  .enum(customerViewModes)
  .optional()
  .transform((value) => value ?? "home");

export const staffRequestFilterSchema = z
  .enum(staffRequestFilters)
  .optional()
  .transform((value) => value ?? "all");

export const createServiceRequestSchema = z.object({
  venueSlug: venueSlugSchema,
  tableNumber: tableNumberSchema,
  requestType: requestTypeSchema,
  note: optionalNoteSchema,
});

export const serviceRequestIdSchema = z.string().uuid("Request ID is invalid.");

export const updateServiceRequestStatusSchema = z.object({
  requestId: serviceRequestIdSchema,
  nextStatus: z.enum(updatableServiceRequestStatuses, {
    error: "Status transition is invalid.",
  }),
});

export type CustomerRouteParams = z.infer<typeof customerRouteParamsSchema>;
export type CustomerView = z.infer<typeof customerViewSchema>;
export type CreateServiceRequestInput = z.infer<
  typeof createServiceRequestSchema
>;
export type StaffRequestFilter = z.infer<typeof staffRequestFilterSchema>;
export type UpdateServiceRequestStatusInput = z.infer<
  typeof updateServiceRequestStatusSchema
>;
