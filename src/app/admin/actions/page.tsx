import { AdminActionsManagementView } from "@/components/admin/admin-actions-management-view";
import { DatabaseSetupState } from "@/components/layout/database-setup-state";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireAuthContext } from "@/lib/auth/guards";
import { customerDemoHref } from "@/lib/mock-data";
import { getAdminActionsManagementData } from "@/lib/supabase/queries";
import { adminFeedbackSchema } from "@/lib/validations/admin";

export const dynamic = "force-dynamic";

export default async function AdminActionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    notice?: string;
    error?: string;
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

  const authContext = await requireAuthContext({
    allowedRoles: ["admin"],
    nextPath: `/admin/actions${query.size ? `?${query.toString()}` : ""}`,
  });
  const data = await getAdminActionsManagementData(authContext.profile.venueId);
  const notice = adminFeedbackSchema.safeParse(resolvedSearchParams.notice);
  const error = adminFeedbackSchema.safeParse(resolvedSearchParams.error);

  if (!data) {
    return (
      <DashboardShell
        currentPath="/admin"
        eyebrow="Admin service actions"
        title="Connect Supabase data to manage guest request actions"
        description="This workspace needs a venue actions row before it can render."
        tablePreviewHref={customerDemoHref}
      >
        <DatabaseSetupState
          title="No action settings were found"
          description="Run the Supabase migrations and seed script, then refresh this page to manage the guest request controls."
        />
      </DashboardShell>
    );
  }

  return (
    <AdminActionsManagementView
      venue={data.venue}
      serviceActions={data.serviceActions}
      notice={notice.success ? notice.data ?? null : null}
      error={error.success ? error.data ?? null : null}
    />
  );
}
