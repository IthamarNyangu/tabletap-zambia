export interface VenueBranding {
  logoSrc?: string;
  logoAlt?: string;
  qrLogoSrc?: string;
}

const venueBrandingBySlug: Record<string, VenueBranding> = {
  grandaddies: {
    logoSrc: "/venues/grandaddies/wordmark.png",
    logoAlt: "Grandaddy's Shoka Nyama logo",
    qrLogoSrc: "/venues/grandaddies/qr-badge.png",
  },
};

export function getVenueBranding(venueSlug: string): VenueBranding {
  return venueBrandingBySlug[venueSlug] ?? {};
}
