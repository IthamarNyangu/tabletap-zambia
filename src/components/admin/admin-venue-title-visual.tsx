import Image from "next/image";

import type { Venue } from "@/lib/types";
import { getVenueBranding } from "@/lib/venue-branding";

interface AdminVenueTitleVisualProps {
  venue: Venue;
}

export function AdminVenueTitleVisual({
  venue,
}: AdminVenueTitleVisualProps) {
  const branding = getVenueBranding(venue.slug);

  if (branding.logoSrc) {
    return (
      <div className="relative h-20 w-full max-w-[20rem] sm:h-24 sm:max-w-[28rem]">
        <Image
          src={branding.logoSrc}
          alt={branding.logoAlt ?? `${venue.name} logo`}
          fill
          preload
          sizes="(max-width: 640px) 78vw, 28rem"
          className="object-contain object-center"
        />
      </div>
    );
  }

  return (
    <span className="font-heading text-[1.7rem] leading-tight text-foreground sm:text-[2rem]">
      {venue.name}
    </span>
  );
}
