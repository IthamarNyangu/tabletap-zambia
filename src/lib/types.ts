export const serviceRequestTypes = [
  "call_waiter",
  "ready_to_order",
  "request_bill",
  "need_assistance",
] as const;

export type ServiceActionType = (typeof serviceRequestTypes)[number];

export const serviceRequestStatuses = [
  "pending",
  "attended",
  "closed",
] as const;

export type ServiceRequestStatus = (typeof serviceRequestStatuses)[number];

export const tableStatuses = ["ready", "occupied", "reserved"] as const;

export type TableStatus = (typeof tableStatuses)[number];

export interface MarketingFeature {
  id: "scan-menu" | "service-actions" | "light-ops";
  eyebrow: string;
  title: string;
  description: string;
}

export interface AudienceSegment {
  id: string;
  title: string;
  description: string;
  venueExamples: string[];
}

export interface LandingPreviewVenue {
  name: string;
  description: string;
  location: string;
  ambienceNote: string;
  actionLabels: string[];
  previewHref: string;
}

export interface ServiceActionDefinition {
  type: ServiceActionType;
  label: string;
  shortLabel: string;
  description: string;
  estimatedResponse: string;
  pendingLabel: string;
  successMessage: string;
}

export interface ServiceAction extends ServiceActionDefinition {
  enabled: boolean;
}

export interface VenueRow {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  location: string;
  description: string;
  ambience_note: string;
  created_at: string;
}

export interface VenueTableRow {
  id: string;
  venue_id: string;
  table_number: number;
  label: string;
  zone: string;
  seats: number;
  status: TableStatus;
  qr_code_value: string;
  created_at: string;
}

export interface MenuCategoryRow {
  id: string;
  venue_id: string;
  name: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface MenuItemRow {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number | string;
  highlight: string | null;
  tags: string[];
  is_available: boolean;
  sort_order: number;
  created_at: string;
}

export interface MenuCategoryWithItemsRow extends MenuCategoryRow {
  menu_items: MenuItemRow[] | null;
}

export interface VenueActionsRow {
  id: string;
  venue_id: string;
  call_waiter_enabled: boolean;
  ready_to_order_enabled: boolean;
  request_bill_enabled: boolean;
  need_assistance_enabled: boolean;
  created_at: string;
}

export interface ServiceRequestRow {
  id: string;
  venue_id: string;
  table_id: string;
  request_type: ServiceActionType;
  status: ServiceRequestStatus;
  note: string | null;
  created_at: string;
  attended_at: string | null;
  closed_at: string | null;
}

export interface ServiceRequestWithTableRow extends ServiceRequestRow {
  tables:
    | Pick<VenueTableRow, "table_number">
    | Pick<VenueTableRow, "table_number">[]
    | null;
}

export interface Venue {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  location: string;
  description: string;
  ambienceNote: string;
  createdAt: string;
}

export interface VenueTable {
  id: string;
  venueId: string;
  tableNumber: number;
  label: string;
  zone: string;
  seats: number;
  status: TableStatus;
  qrCodeValue: string;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  highlight: string | null;
  tags: string[];
  isAvailable: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface MenuCategory {
  id: string;
  venueId: string;
  name: string;
  description: string | null;
  sortOrder: number;
  createdAt: string;
  items: MenuItem[];
}

export interface VenueActions {
  id: string;
  venueId: string;
  callWaiterEnabled: boolean;
  readyToOrderEnabled: boolean;
  requestBillEnabled: boolean;
  needAssistanceEnabled: boolean;
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  venueId: string;
  tableId: string;
  tableNumber: number;
  requestType: ServiceActionType;
  status: ServiceRequestStatus;
  note: string | null;
  createdAt: string;
  attendedAt: string | null;
  closedAt: string | null;
}

export interface CustomerTablePageData {
  venue: Venue;
  table: VenueTable;
  menuCategories: MenuCategory[];
  specials: MenuItem[];
  venueActions: VenueActions;
  serviceActions: ServiceAction[];
}

export interface StaffDashboardData {
  venue: Venue;
  requests: ServiceRequest[];
}

export interface AdminDashboardData {
  venue: Venue;
  tables: VenueTable[];
  menuCategories: MenuCategory[];
  venueActions: VenueActions;
  serviceActions: ServiceAction[];
  requestCount: number;
  activeRequestCount: number;
}

export interface ServiceRequestActionResult {
  success: boolean;
  message?: string;
  error?: string;
  requestId?: string;
}

export interface ServiceRequestStatusActionResult {
  success: boolean;
  error?: string;
}

export const serviceActionDefinitions: Record<
  ServiceActionType,
  ServiceActionDefinition
> = {
  call_waiter: {
    type: "call_waiter",
    label: "Call Waiter",
    shortLabel: "Waiter",
    description: "Let staff know you need someone at the table.",
    estimatedResponse: "Usually under 2 minutes",
    pendingLabel: "Calling waiter...",
    successMessage: "A waiter has been notified.",
  },
  ready_to_order: {
    type: "ready_to_order",
    label: "Ready to Order",
    shortLabel: "Order",
    description: "Tell staff your table is ready to place an order.",
    estimatedResponse: "A waiter will head your way",
    pendingLabel: "Notifying staff...",
    successMessage: "Staff knows you're ready to order.",
  },
  request_bill: {
    type: "request_bill",
    label: "Request Bill",
    shortLabel: "Bill",
    description: "Ask for the bill without losing the flow of the table.",
    estimatedResponse: "Prepared within 3 minutes",
    pendingLabel: "Requesting bill...",
    successMessage: "Your bill request has been sent.",
  },
  need_assistance: {
    type: "need_assistance",
    label: "Need Help",
    shortLabel: "Help",
    description: "Ask for help with the menu, table, or anything you need.",
    estimatedResponse: "A team member will stop by soon",
    pendingLabel: "Requesting help...",
    successMessage: "Help is on the way.",
  },
};
