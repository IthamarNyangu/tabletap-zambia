import { StaffDashboardView } from "@/components/staff/staff-dashboard-view";
import { serviceRequests } from "@/lib/mock-data";

export default function StaffPage() {
  return <StaffDashboardView requests={serviceRequests} />;
}
