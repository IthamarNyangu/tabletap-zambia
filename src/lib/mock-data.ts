import type {
  AudienceSegment,
  LandingPreviewVenue,
  MarketingFeature,
} from "@/lib/types";

export const customerDemoHref = "/v/grandaddies/t/1";

export const marketingFeatures: MarketingFeature[] = [
  {
    id: "scan-menu",
    eyebrow: "QR-first menu",
    title: "Scan to browse a polished menu in seconds",
    description:
      "Guests land on a table-ready page with specials, categories, and clear actions that feel premium on mobile.",
  },
  {
    id: "service-actions",
    eyebrow: "Fast service",
    title: "Simple service requests without waving someone down",
    description:
      "Call waiter, request bill, or ask for assistance with a single tap while the real request is created server-side.",
  },
  {
    id: "light-ops",
    eyebrow: "MVP operations",
    title: "A lightweight dashboard staff can read at a glance",
    description:
      "Requests stay organized by status so teams can move quickly during busy lunch, sundowner, or late-night service.",
  },
];

export const audienceSegments: AudienceSegment[] = [
  {
    id: "restaurants",
    title: "Restaurants and casual dining rooms",
    description:
      "Give guests faster service touchpoints while keeping floor teams focused on hospitality instead of table checks.",
    venueExamples: ["Bistros", "Casual dining", "Family restaurants"],
  },
  {
    id: "bars-lounges",
    title: "Bars, lounges, and rooftop spots",
    description:
      "Perfect for dim lighting, outdoor seating, and high-energy spaces where a quick signal matters.",
    venueExamples: ["Cocktail lounges", "Sports bars", "Rooftop venues"],
  },
  {
    id: "lodges-outdoor",
    title: "Lodges and outdoor venues",
    description:
      "Bring structure to service across gardens, decks, pool areas, and spread-out guest seating.",
    venueExamples: ["Safari lodges", "Beer gardens", "Event patios"],
  },
];

export const landingPreviewVenue: LandingPreviewVenue = {
  name: "Grandaddies",
  description:
    "A warm, social venue that works equally well for a casual meal, an easy round of drinks, or a lively night service rush.",
  location: "Roma, Lusaka",
  ambienceNote:
    "Optimized for patios, open-air seating, and guests checking the menu on their phones in bright outdoor light.",
  actionLabels: ["Call Waiter", "Request Bill", "Need Assistance"],
  previewHref: customerDemoHref,
};
