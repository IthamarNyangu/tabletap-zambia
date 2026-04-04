import { notFound } from "next/navigation";

import { CustomerTableView } from "@/components/customer/customer-table-view";
import { serviceActionDefinitions } from "@/lib/types";
import { getCustomerTablePageData } from "@/lib/supabase/queries";
import {
  customerRouteParamsSchema,
  customerViewSchema,
  requestTypeSchema,
} from "@/lib/validations/service-request";

export const dynamic = "force-dynamic";

export default async function CustomerTablePage({
  params,
  searchParams,
}: {
  params: Promise<{ venueSlug: string; tableNumber: string }>;
  searchParams: Promise<{
    view?: string;
    notice?: string;
    error?: string;
  }>;
}) {
  const parsedParams = customerRouteParamsSchema.safeParse(await params);

  if (!parsedParams.success) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const parsedView = customerViewSchema.safeParse(resolvedSearchParams.view);
  const view = parsedView.success ? parsedView.data : "home";
  const notice = requestTypeSchema.safeParse(resolvedSearchParams.notice);
  const feedback =
    notice.success
      ? {
          tone: "success" as const,
          title: serviceActionDefinitions[notice.data].label,
          message: serviceActionDefinitions[notice.data].successMessage,
          actionType: notice.data,
        }
      : resolvedSearchParams.error
        ? {
            tone: "error" as const,
            title: "Request not sent",
            message: resolvedSearchParams.error,
            actionType: null,
          }
        : null;

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
      view={view}
      feedback={feedback}
    />
  );
}
