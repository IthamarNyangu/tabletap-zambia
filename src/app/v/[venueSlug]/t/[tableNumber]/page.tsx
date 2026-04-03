import { notFound } from "next/navigation";

import { CustomerTableView } from "@/components/customer/customer-table-view";
import { getTableForVenue, getVenueBySlug, venues } from "@/lib/mock-data";

export async function generateStaticParams() {
  return venues.flatMap((venue) =>
    venue.tables.map((table) => ({
      venueSlug: venue.slug,
      tableNumber: table.number,
    }))
  );
}

export default async function CustomerTablePage({
  params,
}: {
  params: Promise<{ venueSlug: string; tableNumber: string }>;
}) {
  const { venueSlug, tableNumber } = await params;
  const venue = getVenueBySlug(venueSlug);

  if (!venue) {
    notFound();
  }

  const table = getTableForVenue(venue, tableNumber);

  if (!table) {
    notFound();
  }

  return <CustomerTableView venue={venue} table={table} />;
}
