import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import Sidebar from "@/components/dashboard/sidebar";
import { useTime } from "@/contexts/TimeContext";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Clock, Sun, Moon } from "lucide-react";

export default function Settings() {
  const { data: employee } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: () => ({ name: 'John Adebayo', role: 'Senior Banking Officer' }),
  });
  const { simulatedTime, setSimulatedTime, isReadOnly } = useTime();

  const formatTime = (hour: number) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h = hour % 12 || 12;
    return `${h}:00 ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader employee={employee} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Time Simulation</h3>
                <div className="flex items-center gap-4 mb-4">
                  <Clock className="h-6 w-6 text-gray-500" />
                  <Label htmlFor="time-slider" className="font-medium">Simulated Time of Day</Label>
                </div>
                <div className="flex items-center gap-4">
                  <Sun className="h-5 w-5 text-yellow-500" />
                  <Slider
                    id="time-slider"
                    min={0}
                    max={23}
                    step={1}
                    value={[simulatedTime]}
                    onValueChange={(value) => setSimulatedTime(value[0])}
                    className="w-full"
                  />
                  <Moon className="h-5 w-5 text-gray-700" />
                </div>
                <div className="text-center mt-4">
                  <p className="text-2xl font-bold text-wema-purple">{formatTime(simulatedTime)}</p>
                  <Badge className={isReadOnly ? "bg-red-100 text-red-800 mt-2" : "bg-green-100 text-green-800 mt-2"}>
                    {isReadOnly ? "System is in View-Only Mode" : "System is Fully Active"}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-2">
                    Full functionality is available from 8:00 AM to 5:59 PM.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
