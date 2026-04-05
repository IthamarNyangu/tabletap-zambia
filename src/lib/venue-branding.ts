export interface VenueBranding {
  logoSrc?: string;
  logoAlt?: string;
}

const venueBrandingBySlug: Record<string, VenueBranding> = {
  grandaddies: {
    logoSrc: "/venues/grandaddies/wordmark.png",
    logoAlt: "Grandaddy's Shoka Nyama logo",
  },
};

export function getVenueBranding(venueSlug: string): VenueBranding {
  return venueBrandingBySlug[venueSlug] ?? {};
}
