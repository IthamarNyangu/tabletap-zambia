export type VenueType =
  | "restaurant"
  | "bar"
  | "lounge"
  | "lodge"
  | "outdoor";

export type ServiceActionType =
  | "call_waiter"
  | "request_bill"
  | "need_assistance"
  | "water_refill"
  | "manager_visit";

export type ServiceRequestStatus = "pending" | "attended" | "closed";

export type TableStatus = "ready" | "occupied" | "reserved";

export interface MarketingFeature {
  id: string;
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

export interface ServiceAction {
  type: ServiceActionType;
  label: string;
  shortLabel: string;
  description: string;
  estimatedResponse: string;
  enabled: boolean;
}

export interface DailySpecial {
  id: string;
  title: string;
  description: string;
  price: number;
  note: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  highlight?: string;
  tags?: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  items: MenuItem[];
}

export interface TableInfo {
  number: string;
  label: string;
  zone: string;
  seats: number;
  status: TableStatus;
  qrLabel: string;
}

export interface Venue {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  type: VenueType;
  location: string;
  description: string;
  ambienceNote: string;
  serviceActions: ServiceAction[];
  specials: DailySpecial[];
  menuCategories: MenuCategory[];
  tables: TableInfo[];
  demoTableNumber: string;
}

export interface ServiceRequest {
  id: string;
  venueSlug: string;
  tableNumber: string;
  requestType: ServiceActionType;
  timestamp: string;
  status: ServiceRequestStatus;
  note?: string;
  partySize?: number;
}
