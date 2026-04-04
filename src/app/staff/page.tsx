import { DatabaseSetupState } from "@/components/layout/database-setup-state";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StaffDashboardView } from "@/components/staff/staff-dashboard-view";
import { customerDemoHref } from "@/lib/mock-data";
import { getStaffDashboardData } from "@/lib/supabase/queries";
import {
  staffPageSchema,
  staffRequestFilterSchema,
} from "@/lib/validations/service-request";

export const dynamic = "force-dynamic";

export default async function StaffPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    page?: string;
    error?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const parsedFilter = staffRequestFilterSchema.safeParse(
    resolvedSearchParams.status
  );
  const parsedPage = staffPageSchema.safeParse(resolvedSearchParams.page);
  const activeFilter = parsedFilter.success ? parsedFilter.data : "all";
  const currentPage = parsedPage.success ? parsedPage.data : 1;
  const data = await getStaffDashboardData();

  if (!data) {
    return (
      <DashboardShell
        currentPath="/staff"
        eyebrow="Staff dashboard"
        title="Connect Supabase data to view service requests"
        description="This page needs at least one seeded venue and request set before it can render the live staff workflow."
        tablePreviewHref={customerDemoHref}
      >
        <DatabaseSetupState
          title="No venue data was found"
          description="Run the Phase 2 migrations and the seed script in Supabase, then refresh this page to load the real request queue."
        />
      </DashboardShell>
    );
  }

  return (
    <StaffDashboardView
      venue={data.venue}
      requests={data.requests}
      activeFilter={activeFilter}
      currentPage={currentPage}
      actionError={resolvedSearchParams.error ?? null}
    />
  );
}
