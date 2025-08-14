import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import Sidebar from "@/components/dashboard/sidebar";
import DocumentUploader from "@/components/dashboard/document-uploader";

const loanData = [
    { id: 'LN-001', customerName: 'Adebola Adesanya', amount: 5000000, status: 'Approved', date: '2025-08-10' },
    { id: 'LN-002', customerName: 'Ngozi Eze', amount: 2500000, status: 'Pending', date: '2025-08-12' },
    { id: 'LN-003', customerName: 'Musa Ibrahim', amount: 7000000, status: 'Rejected', date: '2025-08-11' },
    { id: 'LN-004', customerName: 'Fatima Aliyu', amount: 1000000, status: 'Approved', date: '2025-08-09' },
    { id: 'LN-005', customerName: 'Tunde Ojo', amount: 3500000, status: 'Pending', date: '2025-08-13' },
];

export default function LoanManagement() {
    const { data: employee } = useQuery({
        queryKey: ['/api/auth/me'],
        queryFn: () => ({ name: 'John Adebayo', role: 'Senior Banking Officer' }),
      });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader employee={employee} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>All Loan Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Loan ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loanData.map((loan) => (
                        <TableRow key={loan.id}>
                          <TableCell className="font-medium">{loan.id}</TableCell>
                          <TableCell>{loan.customerName}</TableCell>
                          <TableCell>₦{loan.amount.toLocaleString()}</TableCell>
                          <TableCell>{loan.date}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(loan.status)}>{loan.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Loan Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between"><span>Pending Applications</span><strong>2</strong></div>
                    <div className="flex justify-between"><span>Approved Value</span><strong>₦6,000,000</strong></div>
                    <div className="flex justify-between"><span>Rejection Rate</span><strong>20%</strong></div>
                  </div>
                </CardContent>
              </Card>
              <DocumentUploader />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}