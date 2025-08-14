import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRightLeft, HandCoins, Check, X, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useTime } from "@/contexts/TimeContext";

export default function PendingApprovals() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAll, setShowAll] = useState(false);
  const { isReadOnly } = useTime();

  const { data: loans = [], isLoading: loansLoading } = useQuery({
    queryKey: ['/api/loans'],
  });

  const { data: transfers = [], isLoading: transfersLoading } = useQuery({
    queryKey: ['/api/transfers'],
  });

  const approveLoanMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("POST", `/api/loans/${id}/approve`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/loans'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      toast({
        title: "Loan Approved",
        description: "Loan application has been approved successfully.",
      });
    },
  });

  const rejectLoanMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("POST", `/api/loans/${id}/reject`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/loans'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      toast({
        title: "Loan Rejected",
        description: "Loan application has been rejected.",
      });
    },
  });

  const approveTransferMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("POST", `/api/transfers/${id}/approve`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transfers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      toast({
        title: "Transfer Approved",
        description: "Transfer request has been approved successfully.",
      });
    },
  });

  const rejectTransferMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("POST", `/api/transfers/${id}/reject`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transfers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      toast({
        title: "Transfer Rejected",
        description: "Transfer request has been rejected.",
      });
    },
  });

  // Combine loans and transfers for display
  const pendingItems = [
    ...(loans as any[]).map((loan: any) => ({
      ...loan,
      type: 'loan',
      transactionNumber: loan.loanNumber,
      icon: HandCoins,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    })),
    ...(transfers as any[]).map((transfer: any) => ({
      ...transfer,
      type: 'transfer', 
      icon: ArrowRightLeft,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    }))
  ];

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const displayedItems = showAll ? pendingItems : pendingItems.slice(0, 6);

  if (loansLoading || transfersLoading) {
    return (
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4 w-48"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Pending Approvals</h2>
          <Button 
            variant="link" 
            className="text-wema-purple hover:text-wema-dark font-medium text-sm"
            data-testid="button-view-all-approvals"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'View Less' : 'View All'}
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No pending approvals at this time.
                </td>
              </tr>
            ) : (
              displayedItems.map((item: any) => (
                <tr key={item.id} data-testid={`row-${item.type}-${item.id}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 ${item.iconBg} rounded-full flex items-center justify-center mr-3`}>
                        <item.icon className={`${item.iconColor} h-4 w-4`} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.type === 'loan' ? 'Loan Application' : 'Wire Transfer'}
                        </div>
                        <div className="text-sm text-gray-500">{item.transactionNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.customerName}</div>
                    <div className="text-sm text-gray-500">Account: {item.customerAccount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatAmount(item.amount)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-green-900"
                          data-testid={`button-approve-${item.type}-${item.id}`}
                          disabled={isReadOnly}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure you want to approve?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action will approve the {item.type} request for {item.customerName} in the amount of {formatAmount(item.amount)}. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              if (item.type === 'loan') {
                                approveLoanMutation.mutate(item.id);
                              } else {
                                approveTransferMutation.mutate(item.id);
                              }
                            }}
                          >
                            Approve
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-900"
                          data-testid={`button-reject-${item.type}-${item.id}`}
                          disabled={isReadOnly}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure you want to reject?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action will reject the {item.type} request for {item.customerName} in the amount of {formatAmount(item.amount)}. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              if (item.type === 'loan') {
                                rejectLoanMutation.mutate(item.id);
                              } else {
                                rejectTransferMutation.mutate(item.id);
                              }
                            }}
                          >
                            Reject
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-900"
                      onClick={() => {
                        toast({
                          title: "View Details",
                          description: `Opening details for ${item.transactionNumber}...`,
                        });
                      }}
                      data-testid={`button-view-${item.type}-${item.id}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}