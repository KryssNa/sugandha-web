// context/DashboardContext.tsx
'use client';

import { DashboardData } from '@/components/shared/types/dashboard.types';
import { useDashboard } from '@/hooks/useDashboard';
import React, { createContext, useCallback, useContext, useState } from 'react';

interface DashboardContextType {
    dashboardData: DashboardData | null;
    loading: boolean;
    error: string | null;
    refreshDashboard: () => Promise<void>;
    setActiveSection: (section: string) => void;
    activeSection: string;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
    const { data, loading, error, refetch } = useDashboard();
    const [activeSection, setActiveSection] = useState('overview');

    const refreshDashboard = useCallback(async () => {
        await refetch();
    }, [refetch]);

    return (
        <DashboardContext.Provider
            value={{
                dashboardData: data,
                loading,
                error,
                refreshDashboard,
                setActiveSection,
                activeSection,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboardContext() {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error('useDashboardContext must be used within a DashboardProvider');
    }
    return context;
}