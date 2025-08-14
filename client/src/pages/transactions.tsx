import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import Sidebar from "@/components/dashboard/sidebar";
import { Search } from "lucide-react";

const transactionsData = [
  // Add 20 dummy transactions
  { id: 'TXN-001', date: '2025-08-14', customerName: 'Adebola Adesanya', amount: 150000, type: 'Wire Transfer', status: 'Completed' },
  { id: 'TXN-002', date: '2025-08-14', customerName: 'Ngozi Eze', amount: 75000, type: 'Loan Disbursement', status: 'Completed' },
  { id: 'TXN-003', date: '2025-08-13', customerName: 'Musa Ibrahim', amount: 200000, type: 'Wire Transfer', status: 'Pending' },
  { id: 'TXN-004', date: '2025-08-13', customerName: 'Fatima Aliyu', amount: 50000, type: 'Card Transaction', status: 'Completed' },
  { id: 'TXN-005', date: '2025-08-12', customerName: 'Tunde Ojo', amount: 120000, type: 'Wire Transfer', status: 'Failed' },
  { id: 'TXN-006', date: '2025-08-12', customerName: 'Chiamaka Nwosu', amount: 95000, type: 'Loan Disbursement', status: 'Completed' },
  { id: 'TXN-007', date: '2025-08-11', customerName: 'Emeka Okoro', amount: 300000, type: 'Wire Transfer', status: 'Completed' },
  { id: 'TXN-008', date: '2025-08-11', customerName: 'Amina Bello', amount: 45000, type: 'Card Transaction', status: 'Completed' },
  { id: 'TXN-009', date: '2025-08-10', customerName: 'Yusuf Ahmed', amount: 180000, type: 'Wire Transfer', status: 'Pending' },
  { id: 'TXN-010', date: '2025-08-10', customerName: 'Ifeoma Adebayo', amount: 250000, type: 'Loan Disbursement', status: 'Completed' },
  { id: 'TXN-011', date: '2025-08-09', customerName: 'Babatunde Adeyemi', amount: 80000, type: 'Wire Transfer', status: 'Completed' },
  { id: 'TXN-012', date: '2025-08-09', customerName: 'Halima Abubakar', amount: 60000, type: 'Card Transaction', status: 'Completed' },
  { id: 'TXN-013', date: '2025-08-08', customerName: 'Segun Williams', amount: 220000, type: 'Wire Transfer', status: 'Completed' },
  { id: 'TXN-014', date: '2025-08-08', customerName: 'Zainab Idris', amount: 150000, type: 'Loan Disbursement', status: 'Failed' },
  { id: 'TXN-015', date: '2025-08-07', customerName: 'Oluwaseun Ajayi', amount: 100000, type: 'Wire Transfer', status: 'Completed' },
  { id: 'TXN-016', date: '2025-08-07', customerName: 'Kemi Adewale', amount: 30000, type: 'Card Transaction', status: 'Completed' },
  { id: 'TXN-017', date: '2025-08-06', customerName: 'Mustapha Garba', amount: 175000, type: 'Wire Transfer', status: 'Pending' },
  { id: 'TXN-018', date: '2025-08-06', customerName: 'Funmilayo Benson', amount: 350000, type: 'Loan Disbursement', status: 'Completed' },
  { id: 'TXN-019', date: '2025-08-05', customerName: 'Ibrahim Diallo', amount: 90000, type: 'Wire Transfer', status: 'Completed' },
  { id: 'TXN-020', date: '2025-08-05', customerName: 'Aisha Lawal', amount: 110000, type: 'Card Transaction', status: 'Completed' },
];

export default function Transactions() {
    const { data: employee } = useQuery({
        queryKey: ['/api/auth/me'],
        queryFn: () => ({ name: 'John Adebayo', role: 'Senior Banking Officer' }),
      });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
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
              <CardTitle>Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div className="relative w-1/3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input placeholder="Search by customer or ID..." className="pl-10" />
                </div>
                <div className="flex space-x-2">
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="transfer">Wire Transfer</SelectItem>
                      <SelectItem value="loan">Loan Disbursement</SelectItem>
                      <SelectItem value="card">Card Transaction</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionsData.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.customerName}</TableCell>
                      <TableCell>₦{transaction.amount.toLocaleString()}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}