import React, { createContext, useState, useContext, useMemo } from 'react';

interface TimeContextType {
  simulatedTime: number; // Hour from 0 to 23
  setSimulatedTime: (hour: number) => void;
  isReadOnly: boolean;
}

const TimeContext = createContext<TimeContextType | undefined>(undefined);

export const TimeProvider = ({ children }: { children: React.ReactNode }) => {
  const [simulatedTime, setSimulatedTime] = useState(new Date().getHours());

  const isReadOnly = useMemo(() => {
    // Read-only between 6 PM (18) and 8 AM (8)
    return simulatedTime >= 18 || simulatedTime < 8;
  }, [simulatedTime]);

  const value = {
    simulatedTime,
    setSimulatedTime,
    isReadOnly,
  };

  return <TimeContext.Provider value={value}>{children}</TimeContext.Provider>;
};

export const useTime = () => {
  const context = useContext(TimeContext);
  if (context === undefined) {
    throw new Error('useTime must be used within a TimeProvider');
  }
  return context;
};
