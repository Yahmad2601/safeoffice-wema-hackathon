import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TimeProvider } from "@/contexts/TimeContext";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Transactions from "@/pages/transactions";
import LoanManagement from "@/pages/loan-management";
import CustomerData from "@/pages/customer-data";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/loan-management" component={LoanManagement} />
      <Route path="/customer-data" component={CustomerData} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/settings" component={Settings} />
    </Switch>
  );
}

function App() {
  return (
    <TimeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </TimeProvider>
  );
}

export default App;
