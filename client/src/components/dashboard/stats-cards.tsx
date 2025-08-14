import { useQuery } from "@tanstack/react-query";
import { Clock, CheckCircle, ArrowRightLeft, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  interface StatsData {
    pendingApprovals: number;
    loansProcessed: number;
    totalTransactions: string;
    activeCustomers: number;
  }

  const cardSkeletons = [
    { title: "Pending Approvals", icon: Clock, bgColor: "bg-orange-100", iconColor: "text-orange-600", change: "↑ 12%", changeColor: "text-orange-600" },
    { title: "Loans Processed", icon: CheckCircle, bgColor: "bg-green-100", iconColor: "text-green-600", change: "↑ 23%", changeColor: "text-green-600" },
    { title: "Total Transactions", icon: ArrowRightLeft, bgColor: "bg-blue-100", iconColor: "text-blue-600", change: "↑ 8%", changeColor: "text-green-600" },
    { title: "Active Customers", icon: Users, bgColor: "bg-purple-100", iconColor: "text-purple-600", change: "↑ 5%", changeColor: "text-green-600" },
  ];

  const getStatValue = (title: string) => {
    if (!stats) return '0';
    const typedStats = stats as StatsData;
    switch (title) {
      case "Pending Approvals": return typedStats.pendingApprovals;
      case "Loans Processed": return typedStats.loansProcessed;
      case "Total Transactions": return typedStats.totalTransactions;
      case "Active Customers": return typedStats.activeCustomers.toLocaleString();
      default: return '0';
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardSkeletons.map((card, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{card.title}</p>
                  <Skeleton className="h-9 w-24 mt-1" />
                </div>
                <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                  <card.icon className={`${card.iconColor} h-6 w-6`} />
                </div>
              </div>
              <Skeleton className="h-4 w-32 mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardSkeletons.map((card) => (
        <Card key={card.title} className="shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{card.title}</p>
                <p 
                  className="text-3xl font-bold text-gray-900"
                  data-testid={`stat-${card.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {getStatValue(card.title)}
                </p>
              </div>
              <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                <card.icon className={`${card.iconColor} h-6 w-6`} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm ${card.changeColor}`}>{card.change}</span>
              <span className="text-sm text-gray-500 ml-2">vs last week</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
