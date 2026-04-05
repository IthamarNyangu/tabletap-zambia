import { AdminTablesManagementView } from "@/components/admin/admin-tables-management-view";
import { DatabaseSetupState } from "@/components/layout/database-setup-state";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireAuthContext } from "@/lib/auth/guards";
import { customerDemoHref } from "@/lib/mock-data";
import { getAdminTablesManagementData } from "@/lib/supabase/queries";
import {
  adminFeedbackSchema,
  adminPageSchema,
  adminTableEditSchema,
} from "@/lib/validations/admin";

export const dynamic = "force-dynamic";

export default async function AdminTablesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    notice?: string;
    error?: string;
    editTable?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = new URLSearchParams();

  if (resolvedSearchParams.page) {
    query.set("page", resolvedSearchParams.page);
  }

  if (resolvedSearchParams.notice) {
    query.set("notice", resolvedSearchParams.notice);
  }

  if (resolvedSearchParams.error) {
    query.set("error", resolvedSearchParams.error);
  }

  if (resolvedSearchParams.editTable) {
    query.set("editTable", resolvedSearchParams.editTable);
  }

  const authContext = await requireAuthContext({
    allowedRoles: ["admin"],
    nextPath: `/admin/tables${query.size ? `?${query.toString()}` : ""}`,
  });
  const data = await getAdminTablesManagementData(authContext.profile.venueId);
  const notice = adminFeedbackSchema.safeParse(resolvedSearchParams.notice);
  const error = adminFeedbackSchema.safeParse(resolvedSearchParams.error);
  const page = adminPageSchema.safeParse(resolvedSearchParams.page);
  const editTable = adminTableEditSchema.safeParse(
    resolvedSearchParams.editTable
  );

  if (!data) {
    return (
      <DashboardShell
        currentPath="/admin"
        eyebrow="Admin tables"
        title="Connect Supabase data to manage venue tables"
        description="This workspace needs a seeded venue before it can manage table rows."
        tablePreviewHref={customerDemoHref}
      >
        <DatabaseSetupState
          title="No table data was found"
          description="Run the Supabase migrations and seed script, then refresh this page to manage the venue floor setup."
        />
      </DashboardShell>
    );
  }

  return (
    <AdminTablesManagementView
      venue={data.venue}
      tables={data.tables}
      currentPage={page.success ? page.data : 1}
      editingTableId={editTable.success ? editTable.data ?? null : null}
      notice={notice.success ? notice.data ?? null : null}
      error={error.success ? error.data ?? null : null}
    />
  );
}
