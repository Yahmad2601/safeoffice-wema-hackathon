import { Link } from "wouter";
import { Shield, Bell, LogOut, Menu, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import TrustLevelIndicator from "./trust-level-indicator";
import { useTime } from "@/contexts/TimeContext";

interface DashboardHeaderProps {
  employee?: {
    name: string;
    role: string;
  };
}

export default function DashboardHeader({ employee }: DashboardHeaderProps) {
  const isMobile = useIsMobile();
  const { isReadOnly } = useTime();

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 wema-gradient rounded-lg flex items-center justify-center">
                <Shield className="text-white h-4 w-4" />
              </div>
              <span className="text-xl font-bold text-gray-900">SAFE OFFICE</span>
            </div>
            {!isMobile && (
              <nav className="hidden lg:flex items-center space-x-6 ml-8">
                <a href="#" className="text-wema-purple font-medium">Dashboard</a>
                <a href="#" className="text-gray-600 hover:text-wema-purple transition-colors">Transactions</a>
                <a href="#" className="text-gray-600 hover:text-wema-purple transition-colors">Customers</a>
                <a href="#" className="text-gray-600 hover:text-wema-purple transition-colors">Loans</a>
                <a href="#" className="text-gray-600 hover:text-wema-purple transition-colors">Reports</a>
              </nav>
            )}
            </div>
            <div className="flex items-center space-x-4">
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm"
                className="p-2 text-gray-400 hover:text-gray-600"
                data-testid="button-notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
            </div>
            {!isMobile && (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900" data-testid="text-employee-name">
                    {employee?.name || "John Adebayo"}
                  </p>
                  <p className="text-xs text-gray-500" data-testid="text-employee-role">
                    {employee?.role || "Senior Banking Officer"}
                  </p>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150"
                  alt="Employee profile" 
                  className="w-10 h-10 rounded-full object-cover"
                  data-testid="img-employee-avatar"
                />
              </div>
            )}
            <Link href="/">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-400 hover:text-gray-600"
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </Link>
            {isMobile && (
              <Button 
                variant="ghost" 
                size="sm"
                data-testid="button-mobile-menu"
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
            </div>
          </div>
        </div>
    </header>
    
    {isReadOnly && (
        <div className="bg-yellow-100 border-b border-yellow-200 text-yellow-800 px-4 py-2 text-center text-sm flex items-center justify-center gap-2">
            <EyeOff className="h-4 w-4" />
            <span>System is in <strong>View-Only Mode</strong>. Actions are disabled until 8:00 AM.</span>
        </div>
    )}
    
    <div className="px-4 sm:px-6 lg:px-8 py-4 bg-gray-50">
      <TrustLevelIndicator />
    </div>
    </>
  );
}
