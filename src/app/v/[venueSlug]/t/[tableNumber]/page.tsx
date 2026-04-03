import { notFound } from "next/navigation";

import { CustomerTableView } from "@/components/customer/customer-table-view";
import { getCustomerTablePageData } from "@/lib/supabase/queries";
import { customerRouteParamsSchema } from "@/lib/validations/service-request";

export const dynamic = "force-dynamic";

export default async function CustomerTablePage({
  params,
}: {
  params: Promise<{ venueSlug: string; tableNumber: string }>;
}) {
  const parsedParams = customerRouteParamsSchema.safeParse(await params);

  if (!parsedParams.success) {
    notFound();
  }

  const data = await getCustomerTablePageData(parsedParams.data);

  if (!data) {
    notFound();
  }

  return (
    <CustomerTableView
      venue={data.venue}
      table={data.table}
      menuCategories={data.menuCategories}
      specials={data.specials}
      serviceActions={data.serviceActions}
    />
  );
}
