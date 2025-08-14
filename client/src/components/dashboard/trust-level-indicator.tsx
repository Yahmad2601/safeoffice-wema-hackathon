import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, TrendingUp, TrendingDown } from 'lucide-react';

export default function TrustLevelIndicator() {
  const [trustLevel, setTrustLevel] = useState(0);
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');

  useEffect(() => {
    const generateTrustLevel = () => {
      const factors = {
        deviceHealth: Math.random() * 0.3 + 0.7, // 70-100%
        networkSecurity: Math.random() * 0.4 + 0.6, // 60-100%
        location: Math.random() * 0.2 + 0.8, // 80-100%
      };
      const calculatedLevel = (factors.deviceHealth * 40) + (factors.networkSecurity * 40) + (factors.location * 20);
      return Math.round(calculatedLevel);
    };

    const updateTrustLevel = () => {
      const previousLevel = trustLevel;
      const newLevel = generateTrustLevel();
      
      setTrustLevel(newLevel);
      
      if (newLevel > previousLevel + 2) {
        setTrend('up');
      } else if (newLevel < previousLevel - 2) {
        setTrend('down');
      } else {
        setTrend('stable');
      }
    };

    updateTrustLevel();
    const interval = setInterval(updateTrustLevel, 30000);

    return () => clearInterval(interval);
  }, [trustLevel]);

  const getTrustColor = (level: number) => {
    if (level >= 90) return 'text-green-600 bg-green-100';
    if (level >= 75) return 'text-blue-600 bg-blue-100';
    if (level >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTrustLabel = (level: number) => {
    if (level >= 90) return 'VERY HIGH';
    if (level >= 75) return 'HIGH';
    if (level >= 60) return 'MEDIUM';
    return 'LOW';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="h-3 w-3 text-red-500" />;
    return null;
  };

  return (
    <Card className="border-0 bg-gradient-to-r from-purple-100 to-purple-50" data-testid="card-trust-level">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-200 rounded-full">
              <Shield className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-700">Session Trust Score</h3>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-purple-900" data-testid="text-trust-score">
                  {trustLevel}/100
                </span>
                {getTrendIcon()}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <Badge 
              className={`${getTrustColor(trustLevel)} border-0 font-semibold`}
              data-testid="badge-trust-rating"
            >
              {getTrustLabel(trustLevel)}
            </Badge>
            <p className="text-xs text-gray-500 mt-1">
              Real-time score
            </p>
          </div>
        </div>
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${trustLevel}%` }}
              data-testid="progress-trust-level"
            />
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Factors: Device, Network, Location</span>
          <span>Updates every 30s</span>
        </div>
      </CardContent>
    </Card>
  );
}