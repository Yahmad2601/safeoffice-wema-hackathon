import { useQuery } from "@tanstack/react-query";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import Sidebar from "@/components/dashboard/sidebar";
import StatsCards from "@/components/dashboard/stats-cards";
import RecentActivities from "@/components/dashboard/recent-activities";
import PendingApprovals from "@/components/dashboard/pending-approvals";
import SecureDocuments from "@/components/dashboard/secure-documents";
import SecurityPosture from "@/components/dashboard/security-posture";

export default function Dashboard() {
  const { data: employee } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: () => ({ name: 'John Adebayo', role: 'Senior Banking Officer' }),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader employee={employee} />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          {/* Dashboard Stats */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
            <StatsCards />
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 space-y-6">
              <PendingApprovals />
              <SecureDocuments employeeName={employee?.name || "John Adebayo"} />
            </div>
            <div className="lg:col-span-1 space-y-6">
              <SecurityPosture />
              <RecentActivities />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}