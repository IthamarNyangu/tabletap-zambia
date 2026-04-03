import { AdminDashboardView } from "@/components/admin/admin-dashboard-view";
import { DatabaseSetupState } from "@/components/layout/database-setup-state";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { customerDemoHref } from "@/lib/mock-data";
import { getAdminDashboardData } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await getAdminDashboardData();

  if (!data) {
    return (
      <DashboardShell
        currentPath="/admin"
        eyebrow="Admin dashboard"
        title="Connect Supabase data to preview venue setup"
        description="This page becomes useful after the venue, tables, menu, and venue action rows exist in the database."
        tablePreviewHref={customerDemoHref}
      >
        <DatabaseSetupState
          title="No admin data was found"
          description="Run the Phase 2 migrations and the seed script in Supabase, then refresh this page to load the real venue overview."
        />
      </DashboardShell>
    );
  }

  return (
    <AdminDashboardView
      venue={data.venue}
      tables={data.tables}
      menuCategories={data.menuCategories}
      serviceActions={data.serviceActions}
      requestCount={data.requestCount}
      activeRequestCount={data.activeRequestCount}
    />
  );
}
