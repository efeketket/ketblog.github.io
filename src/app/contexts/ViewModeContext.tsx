'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type ViewMode = 'compact' | 'expanded';

interface ViewModeContextType {
  viewMode: ViewMode;
  toggleViewMode: () => void;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>('compact');

  useEffect(() => {
    const savedMode = localStorage.getItem('viewMode') as ViewMode;
    if (savedMode) {
      setViewMode(savedMode);
    }
  }, []);

  const toggleViewMode = () => {
    const newMode = viewMode === 'compact' ? 'expanded' : 'compact';
    setViewMode(newMode);
    localStorage.setItem('viewMode', newMode);
  };

  return (
    <ViewModeContext.Provider value={{ viewMode, toggleViewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
} 