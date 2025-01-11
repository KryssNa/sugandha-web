// hooks/useDashboardFilters.ts
import { useState, useCallback } from 'react';

export interface DashboardFilters {
  dateRange: '7d' | '30d' | '90d' | '1y' | 'all';
  category: string;
  status: string;
  searchQuery: string;
}

export const useDashboardFilters = (initialFilters?: Partial<DashboardFilters>) => {
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: '7d',
    category: 'all',
    status: 'all',
    searchQuery: '',
    ...initialFilters,
  });

  const updateFilter = useCallback((key: keyof DashboardFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      dateRange: '7d',
      category: 'all',
      status: 'all',
      searchQuery: '',
    });
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: query,
    }));
  }, []);

  return {
    filters,
    updateFilter,
    resetFilters,
    setSearchQuery,
  };
};