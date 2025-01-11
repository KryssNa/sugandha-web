// hooks/useDashboard.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppDispatch } from '@/store/hooks';
import type { DashboardData, DashboardMetric } from '@/components/shared/types/dashboard';

interface DashboardFilters {
  dateRange: '7d' | '30d' | '90d' | '1y' | 'all';
  category: string;
  status: string;
  searchQuery?: string;
}

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: '7d',
    category: 'all',
    status: 'all',
    searchQuery: '',
  });

  const metrics = useMemo(() => ({
    calculateRevenueMetrics: (revenue: DashboardData['revenue']) => ({
      title: 'Total Revenue',
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(revenue.totalRevenue),
      trend: revenue.revenueGrowth,
      icon: 'CurrencyDollar',
      chartData: revenue.revenueByPeriod.map(p => ({
        date: p.period,
        value: p.revenue
      }))
    }),
    calculateOrderMetrics: (orders: DashboardData['orders']) => ({
      title: 'Total Orders',
      value: orders.totalOrders.toString(),
      trend: ((orders.completedOrders - orders.pendingOrders) / 
              orders.totalOrders) * 100,
      icon: 'ShoppingCart',
      chartData: orders.recentOrders.map(o => ({
        date: o.date,
        value: o.amount
      }))
    }),
    calculateCustomerMetrics: (customers: DashboardData['customers']) => ({
      title: 'Total Customers',
      value: customers.totalCustomers.toString(),
      trend: customers.customerGrowth,
      icon: 'Users',
      chartData: customers.topCustomers.map(c => ({
        date: c.lastOrder,
        value: c.totalSpent
      }))
    }),
    calculateProductMetrics: (products: DashboardData['products']) => ({
      title: 'Total Products',
      value: products.totalProducts.toString(),
      trend: (products.activeProducts / products.totalProducts) * 100,
      icon: 'Package',
      chartData: products.productCategories.map(c => ({
        date: c.category,
        value: c.revenue
      }))
    })
  }), []);

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

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        range: filters.dateRange,
        ...(filters.category !== 'all' && { category: filters.category }),
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.searchQuery && { search: filters.searchQuery })
      });
      
      const response = await fetch(`/api/admin/dashboard?${queryParams}`);
      const jsonData: DashboardData = await response.json();
      
      if (!response.ok) {
        throw new Error(jsonData.message || 'Failed to fetch dashboard data');
      }
      
      setData(jsonData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const exportDashboardData = async (format: 'csv' | 'pdf') => {
    try {
      const response = await fetch(`/api/admin/dashboard/export?format=${format}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filters, data }),
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-${new Date().toISOString()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [filters]);

  const processedData = useMemo(() => {
    if (!data) return null;

    return {
      ...data,
      metrics: {
        revenue: metrics.calculateRevenueMetrics(data.revenue),
        orders: metrics.calculateOrderMetrics(data.orders),
        customers: metrics.calculateCustomerMetrics(data.customers),
        products: metrics.calculateProductMetrics(data.products),
      },
    };
  }, [data, metrics]);

  return {
    data: processedData,
    loading,
    error,
    filters,
    metrics,
    actions: {
      updateFilter,
      resetFilters,
      refetch: fetchDashboardData,
      exportData: exportDashboardData,
    },
  };
};