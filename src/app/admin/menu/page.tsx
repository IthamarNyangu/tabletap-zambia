import { AdminMenuManagementView } from "@/components/admin/admin-menu-management-view";
import { DatabaseSetupState } from "@/components/layout/database-setup-state";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireAuthContext } from "@/lib/auth/guards";
import { customerDemoHref } from "@/lib/mock-data";
import { getAdminMenuManagementData } from "@/lib/supabase/queries";
import {
  adminFeedbackSchema,
  adminMenuItemEditSchema,
} from "@/lib/validations/admin";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage({
  searchParams,
}: {
  searchParams: Promise<{
    notice?: string;
    error?: string;
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

  if (resolvedSearchParams.editItem) {
    query.set("editItem", resolvedSearchParams.editItem);
  }

  const authContext = await requireAuthContext({
    allowedRoles: ["admin"],
    nextPath: `/admin/menu${query.size ? `?${query.toString()}` : ""}`,
  });
  const data = await getAdminMenuManagementData(authContext.profile.venueId);
  const notice = adminFeedbackSchema.safeParse(resolvedSearchParams.notice);
  const error = adminFeedbackSchema.safeParse(resolvedSearchParams.error);
  const editItem = adminMenuItemEditSchema.safeParse(
    resolvedSearchParams.editItem
  );

  if (!data) {
    return (
      <DashboardShell
        currentPath="/admin"
        eyebrow="Admin menu"
        title="Connect Supabase data to manage menu items"
        description="This workspace needs a seeded venue menu before it can render."
        tablePreviewHref={customerDemoHref}
      >
        <DatabaseSetupState
          title="No menu data was found"
          description="Run the Supabase migrations and seed script, then refresh this page to manage the guest-facing menu."
        />
      </DashboardShell>
    );
  }

  return (
    <AdminMenuManagementView
      venue={data.venue}
      menuCategories={data.menuCategories}
      editingMenuItemId={editItem.success ? editItem.data ?? null : null}
      notice={notice.success ? notice.data ?? null : null}
      error={error.success ? error.data ?? null : null}
    />
  );
}
