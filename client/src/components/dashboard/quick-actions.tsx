import { HandCoins, ArrowRightLeft, Download, UserCog } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function QuickActions() {
  const { toast } = useToast();

  const actions = [
    {
      title: "Loan Approval",
      description: "Review and approve loan applications",
      icon: HandCoins,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      onClick: () => toast({ title: "Loan Approval", description: "Opening loan approval interface..." }),
    },
    {
      title: "Transfer Approval",
      description: "Approve high-value transfer requests",
      icon: ArrowRightLeft,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      onClick: () => toast({ title: "Transfer Approval", description: "Opening transfer approval interface..." }),
    },
    {
      title: "Download Data",
      description: "Export customer data reports",
      icon: Download,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      onClick: () => toast({ title: "Data Export", description: "Preparing customer data export..." }),
    },
    {
      title: "Account Management",
      description: "Manage customer accounts",
      icon: UserCog,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
      onClick: () => toast({ title: "Account Management", description: "Opening account management interface..." }),
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {actions.map((action) => (
          <Card 
            key={action.title}
            className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={action.onClick}
            data-testid={`card-${action.title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center`}>
                  <action.icon className={`${action.iconColor} h-6 w-6`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
