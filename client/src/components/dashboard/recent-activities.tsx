import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";

export default function RecentActivities() {
  // This now correctly uses the default query function from your queryClient setup,
  // which includes the necessary credentials to fetch data from the API.
  const { data: activities, isLoading } = useQuery({
    queryKey: ['/api/activities'],
  });

  const displayActivities = (activities as any[]) || [];

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffMs = now.getTime() - activityDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 1) {
      return activityDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (diffMins < 60) {
      return diffMins === 1 ? "1 minute ago" : `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    } else {
      return activityDate.toLocaleDateString();
    }
  };
  
  const getActivityColor = (action: string) => {
    if (action.includes('approved')) return 'bg-green-500';
    if (action.includes('rejected')) return 'bg-red-500';
    if (action.includes('login')) return 'bg-blue-500';
    return 'bg-purple-500';
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activities</h2>
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start space-x-3 animate-pulse">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {displayActivities.length === 0 ? (
                <p className="text-sm text-gray-500">No recent activities.</p>
              ) : (
                displayActivities.map((activity) => (
                  <div 
                    key={activity.id} 
                    className="flex items-start space-x-3"
                    data-testid={`activity-${activity.id}`}
                  >
                    <div className={`w-2 h-2 ${getActivityColor(activity.action)} rounded-full mt-2`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{getTimeAgo(activity.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
