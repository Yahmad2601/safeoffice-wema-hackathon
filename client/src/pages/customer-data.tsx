import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import Sidebar from "@/components/dashboard/sidebar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const customerData = [
    { id: 'CUST-001', name: 'Adebola Adesanya', email: 'adebola@example.com', riskLevel: 'Low', joinDate: '2023-01-15' },
    { id: 'CUST-002', name: 'Ngozi Eze', email: 'ngozi@example.com', riskLevel: 'Medium', joinDate: '2022-11-20' },
    { id: 'CUST-003', name: 'Musa Ibrahim', email: 'musa@example.com', riskLevel: 'High', joinDate: '2023-03-10' },
    { id: 'CUST-004', name: 'Fatima Aliyu', email: 'fatima@example.com', riskLevel: 'Low', joinDate: '2021-07-22' },
    { id: 'CUST-005', name: 'Tunde Ojo', email: 'tunde@example.com', riskLevel: 'Medium', joinDate: '2023-05-30' },
];

export default function CustomerData() {
    const { data: employee } = useQuery({
        queryKey: ['/api/auth/me'],
        queryFn: () => ({ name: 'John Adebayo', role: 'Senior Banking Officer' }),
      });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader employee={employee} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div className="relative w-1/3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input placeholder="Search by customer name or ID..." className="pl-10" />
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Join Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerData.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.id}</TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>
                        <Badge className={getRiskColor(customer.riskLevel)}>{customer.riskLevel}</Badge>
                      </TableCell>
                      <TableCell>{customer.joinDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
