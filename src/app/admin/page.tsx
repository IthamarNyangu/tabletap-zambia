import { AdminDashboardView } from "@/components/admin/admin-dashboard-view";
import { DatabaseSetupState } from "@/components/layout/database-setup-state";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireAuthContext } from "@/lib/auth/guards";
import { customerDemoHref } from "@/lib/mock-data";
import { getAdminDashboardData } from "@/lib/supabase/queries";
import {
  adminFeedbackSchema,
  adminMenuItemEditSchema,
  adminTableEditSchema,
} from "@/lib/validations/admin";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    notice?: string;
    error?: string;
    editTable?: string;
    editItem?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = new URLSearchParams();

  if (resolvedSearchParams.notice) {
    query.set("notice", resolvedSearchParams.notice);
  }

  if (resolvedSearchParams.error) {
    query.set("error", resolvedSearchParams.error);
  }

  if (resolvedSearchParams.editTable) {
    query.set("editTable", resolvedSearchParams.editTable);
  }

  if (resolvedSearchParams.editItem) {
    query.set("editItem", resolvedSearchParams.editItem);
  }

  const authContext = await requireAuthContext({
    allowedRoles: ["admin"],
    nextPath: `/admin${query.size ? `?${query.toString()}` : ""}`,
  });
  const data = await getAdminDashboardData(authContext.profile.venueId);
  const notice = adminFeedbackSchema.safeParse(resolvedSearchParams.notice);
  const error = adminFeedbackSchema.safeParse(resolvedSearchParams.error);
  const editTable = adminTableEditSchema.safeParse(
    resolvedSearchParams.editTable
  );
  const editItem = adminMenuItemEditSchema.safeParse(
    resolvedSearchParams.editItem
  );

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
      notice={notice.success ? notice.data ?? null : null}
      error={error.success ? error.data ?? null : null}
      editingTableId={editTable.success ? editTable.data ?? null : null}
      editingMenuItemId={editItem.success ? editItem.data ?? null : null}
    />
  );
}
