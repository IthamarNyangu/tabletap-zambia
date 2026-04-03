import type {
  AudienceSegment,
  MarketingFeature,
  ServiceRequest,
  Venue,
} from "@/lib/types";

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
      "Call waiter, request bill, or ask for assistance with a single tap and immediate local confirmation.",
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

export const venues: Venue[] = [
  {
    id: "kalimba-lounge",
    slug: "kalimba-lounge",
    name: "Kalimba Lounge",
    tagline: "Premium table service for Lusaka afternoons and late evenings",
    type: "lounge",
    location: "Leopards Hill Road, Lusaka",
    description:
      "A leafy indoor-outdoor lounge with grilled plates, thoughtful cocktails, and smooth table service built for long stays.",
    ambienceNote:
      "Designed for bright patios, sunset braai sessions, and guests using one hand on a phone outdoors.",
    demoTableNumber: "12",
    serviceActions: [
      {
        type: "call_waiter",
        label: "Call Waiter",
        shortLabel: "Waiter",
        description: "Let staff know your table is ready for service.",
        estimatedResponse: "Usually under 2 minutes",
        enabled: true,
      },
      {
        type: "request_bill",
        label: "Request Bill",
        shortLabel: "Bill",
        description: "Ask for the bill without losing the flow of the table.",
        estimatedResponse: "Prepared within 3 minutes",
        enabled: true,
      },
      {
        type: "need_assistance",
        label: "Need Assistance",
        shortLabel: "Assistance",
        description: "Use this for menu questions or a quick check-in.",
        estimatedResponse: "A team member will stop by soon",
        enabled: true,
      },
      {
        type: "water_refill",
        label: "Water Refill",
        shortLabel: "Water",
        description: "Optional service action reserved for later rollout.",
        estimatedResponse: "Coming in a later phase",
        enabled: false,
      },
      {
        type: "manager_visit",
        label: "Manager Visit",
        shortLabel: "Manager",
        description: "Reserved for future escalation workflows.",
        estimatedResponse: "Coming in a later phase",
        enabled: false,
      },
    ],
    specials: [
      {
        id: "sunset-braai-board",
        title: "Sunset Braai Board",
        description:
          "Char-grilled beef strips, village chicken skewers, chakalaka, and cassava wedges built for sharing.",
        price: 265,
        note: "Best before 19:00 for golden-hour tables",
      },
      {
        id: "hibiscus-spritz",
        title: "Hibiscus Citrus Spritz",
        description:
          "A chilled hibiscus, orange, and tonic cooler served over crushed ice for the patio heat.",
        price: 78,
        note: "Most requested on the garden deck",
      },
    ],
    menuCategories: [
      {
        id: "chef-picks",
        name: "Chef Picks",
        description: "The dishes most often ordered for a relaxed long table.",
        items: [
          {
            id: "kapenta-arancini",
            name: "Kapenta Arancini",
            description:
              "Crisp rice bites with smoked kapenta, lemon aioli, and a light herb finish.",
            price: 92,
            highlight: "House favourite",
            tags: ["Shareable", "Seafood"],
          },
          {
            id: "charred-chicken",
            name: "Charred Village Chicken",
            description:
              "Half chicken with smoked paprika butter, garden slaw, and cassava chips.",
            price: 168,
            tags: ["Braai", "Popular"],
          },
          {
            id: "braised-oxtail",
            name: "Braised Oxtail Pot",
            description:
              "Slow-cooked oxtail, creamy nshima mash, and roasted root vegetables.",
            price: 228,
            highlight: "Evening signature",
            tags: ["Slow cooked"],
          },
        ],
      },
      {
        id: "small-plates",
        name: "Small Plates",
        description: "Easy snacks for drinks, stories, and another round.",
        items: [
          {
            id: "spiced-groundnuts",
            name: "Spiced Groundnut Mix",
            description:
              "Warm groundnuts tossed with chili salt, curry leaves, and lime zest.",
            price: 38,
            tags: ["Snack", "Vegetarian"],
          },
          {
            id: "tilapia-tacos",
            name: "Lake Tilapia Tacos",
            description:
              "Soft tacos with citrus slaw, tamarind glaze, and charred green chili.",
            price: 96,
            tags: ["Seafood", "Fresh"],
          },
          {
            id: "beef-skewers",
            name: "Pepper Crusted Beef Skewers",
            description:
              "Skewers glazed with garlic butter and served with tomato-onion relish.",
            price: 104,
            tags: ["Braai", "Shareable"],
          },
        ],
      },
      {
        id: "drinks",
        name: "Cocktails and Coolers",
        description: "Balanced pours designed for warm weather and slower evenings.",
        items: [
          {
            id: "baobab-sour",
            name: "Baobab Sour",
            description:
              "Baobab cordial, bourbon, citrus, and egg white with a silky finish.",
            price: 92,
            highlight: "Signature pour",
            tags: ["Cocktail"],
          },
          {
            id: "ginger-citrus-fizz",
            name: "Ginger Citrus Fizz",
            description:
              "Fresh ginger, lime, and tonic with mint for a clean all-day cooler.",
            price: 52,
            tags: ["Alcohol-free", "Refreshing"],
          },
          {
            id: "cold-brew-tonic",
            name: "Cold Brew Tonic",
            description:
              "Local cold brew over tonic and orange peel for a sharp afternoon lift.",
            price: 48,
            tags: ["Coffee", "Low sugar"],
          },
        ],
      },
    ],
    tables: [
      {
        number: "1",
        label: "Table 1",
        zone: "Front Lounge",
        seats: 2,
        status: "ready",
        qrLabel: "TT-KAL-001",
      },
      {
        number: "4",
        label: "Table 4",
        zone: "Front Lounge",
        seats: 4,
        status: "occupied",
        qrLabel: "TT-KAL-004",
      },
      {
        number: "7",
        label: "Table 7",
        zone: "Sunset Terrace",
        seats: 4,
        status: "reserved",
        qrLabel: "TT-KAL-007",
      },
      {
        number: "9",
        label: "Table 9",
        zone: "Sunset Terrace",
        seats: 6,
        status: "ready",
        qrLabel: "TT-KAL-009",
      },
      {
        number: "12",
        label: "Table 12",
        zone: "Garden Deck",
        seats: 4,
        status: "occupied",
        qrLabel: "TT-KAL-012",
      },
      {
        number: "14",
        label: "Table 14",
        zone: "Garden Deck",
        seats: 6,
        status: "ready",
        qrLabel: "TT-KAL-014",
      },
      {
        number: "18",
        label: "Table 18",
        zone: "Private Nook",
        seats: 4,
        status: "occupied",
        qrLabel: "TT-KAL-018",
      },
      {
        number: "21",
        label: "Table 21",
        zone: "Pool Edge",
        seats: 2,
        status: "ready",
        qrLabel: "TT-KAL-021",
      },
    ],
  },
];

export const serviceRequests: ServiceRequest[] = [
  {
    id: "req-1001",
    venueSlug: "kalimba-lounge",
    tableNumber: "12",
    requestType: "call_waiter",
    timestamp: "2026-04-03T18:42:00+02:00",
    status: "pending",
    note: "Ready to order mains",
    partySize: 4,
  },
  {
    id: "req-1002",
    venueSlug: "kalimba-lounge",
    tableNumber: "4",
    requestType: "request_bill",
    timestamp: "2026-04-03T18:35:00+02:00",
    status: "attended",
    note: "Split bill for two cards",
    partySize: 2,
  },
  {
    id: "req-1003",
    venueSlug: "kalimba-lounge",
    tableNumber: "18",
    requestType: "need_assistance",
    timestamp: "2026-04-03T18:31:00+02:00",
    status: "pending",
    note: "Guest has a menu allergy question",
    partySize: 4,
  },
  {
    id: "req-1004",
    venueSlug: "kalimba-lounge",
    tableNumber: "9",
    requestType: "call_waiter",
    timestamp: "2026-04-03T18:18:00+02:00",
    status: "closed",
    note: "Dessert menu delivered",
    partySize: 3,
  },
  {
    id: "req-1005",
    venueSlug: "kalimba-lounge",
    tableNumber: "21",
    requestType: "request_bill",
    timestamp: "2026-04-03T18:12:00+02:00",
    status: "closed",
    partySize: 2,
  },
  {
    id: "req-1006",
    venueSlug: "kalimba-lounge",
    tableNumber: "7",
    requestType: "need_assistance",
    timestamp: "2026-04-03T17:58:00+02:00",
    status: "attended",
    note: "Celebration candle request",
    partySize: 5,
  },
];

export const demoVenue = venues[0];

export function getVenueBySlug(slug: string) {
  return venues.find((venue) => venue.slug === slug);
}

export function getTableForVenue(venue: Venue, tableNumber: string) {
  return venue.tables.find((table) => table.number === tableNumber);
}
