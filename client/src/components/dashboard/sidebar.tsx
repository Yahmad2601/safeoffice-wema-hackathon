import { 
  BarChart3, 
  ArrowRightLeft, 
  HandCoins, 
  Users, 
  TrendingUp, 
  Settings 
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation, Link } from "wouter";

export default function Sidebar() {
  const isMobile = useIsMobile();
  const [location] = useLocation();

  const navLinks = [
    { href: "/dashboard", icon: BarChart3, label: "Overview", testId: "link-overview" },
    { href: "/transactions", icon: ArrowRightLeft, label: "Transactions", testId: "link-transactions" },
    { href: "/loan-management", icon: HandCoins, label: "Loan Management", testId: "link-loan-management" },
    { href: "/customer-data", icon: Users, label: "Customer Data", testId: "link-customer-data" },
    { href: "/analytics", icon: TrendingUp, label: "Analytics", testId: "link-analytics" },
    { href: "/settings", icon: Settings, label: "Settings", testId: "link-settings" },
  ];

  if (isMobile) {
    return null; // Hide sidebar on mobile
  }

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <nav className="space-y-2">
          {navLinks.map(link => (
            <Link 
              key={link.href}
              href={link.href} 
            >
              <a 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  location === link.href 
                    ? "text-wema-purple bg-purple-50" 
                    : "text-gray-600 hover:text-wema-purple hover:bg-gray-50"
                }`}
                data-testid={link.testId}
              >
                <link.icon className="h-4 w-4" />
                <span className="font-medium">{link.label}</span>
              </a>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
