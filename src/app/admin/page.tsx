import { AdminDashboardView } from "@/components/admin/admin-dashboard-view";
import { demoVenue, serviceRequests } from "@/lib/mock-data";

export default function AdminPage() {
  return <AdminDashboardView venue={demoVenue} requests={serviceRequests} />;
}
