import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardHeader from "@/components/dashboard/dashboard-header";
import Sidebar from "@/components/dashboard/sidebar";
import { Shield, AlertTriangle, WifiOff } from "lucide-react";

const threatData = [
  { name: 'Mon', threats: 4 },
  { name: 'Tue', threats: 3 },
  { name: 'Wed', threats: 5 },
  { name: 'Thu', threats: 2 },
  { name: 'Fri', threats: 7 },
  { name: 'Sat', threats: 1 },
  { name: 'Sun', threats: 0 },
];

const accessData = [
    { name: 'Successful', value: 400 },
    { name: 'Failed', value: 30 },
    { name: 'Blocked', value: 15 },
];

export default function Analytics() {
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Threats Detected</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">22</div>
                <p className="text-xs text-muted-foreground">+18.2% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High-Risk Logins</CardTitle>
                <WifiOff className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">+5.1% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Device Compliance</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.2%</div>
                <p className="text-xs text-muted-foreground">All corporate devices</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Threats Detected (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={threatData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="threats" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Access Attempts (Last 24 Hours)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={accessData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
