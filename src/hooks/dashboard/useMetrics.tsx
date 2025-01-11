// hooks/dashboard/useMetrics.ts
import { useCallback, useState } from 'react';
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-react';
import { CustomerSummary, OrderSummary, ProductSummary, RevenueSummary } from '@/components/shared/types/dashboard';

export const useDashboardMetrics = () => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const calculateGrowth = (current: number, previous: number): number => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  const calculateRevenueMetrics = useCallback((revenue: RevenueSummary) => ({
    title: 'Total Revenue',
    value: formatCurrency(revenue.totalRevenue),
    trend: revenue.revenueGrowth,
    icon: DollarSign,
    chartData: revenue.revenueByPeriod.map(period => ({
      date: period.period,
      value: period.revenue,
    })),
  }), []);

  const calculateOrderMetrics = useCallback((orders: OrderSummary) => ({
    title: 'Total Orders',
    value: orders.totalOrders.toString(),
    trend: calculateGrowth(orders.completedOrders, orders.totalOrders),
    icon: ShoppingBag,
    chartData: orders.recentOrders.map(order => ({
      date: new Date(order.date).toLocaleDateString(),
      value: order.amount,
    })),
  }), []);

  const calculateCustomerMetrics = useCallback((customers: CustomerSummary) => ({
    title: 'Total Customers',
    value: customers.totalCustomers.toString(),
    trend: customers.customerGrowth,
    icon: Users,
    chartData: customers.topCustomers.map(customer => ({
      date: new Date(customer.lastOrder).toLocaleDateString(),
      value: customer.totalSpent,
    })),
  }), []);

  const calculateProductMetrics = useCallback((products: ProductSummary) => ({
    title: 'Total Products',
    value: products.totalProducts.toString(),
    trend: (products.activeProducts / products.totalProducts) * 100,
    icon: Package,
    chartData: products.productCategories.map(category => ({
      date: category.category,
      value: category.revenue,
    })),
  }), []);

  return {
    formatCurrency,
    calculateGrowth,
    calculateRevenueMetrics,
    calculateOrderMetrics,
    calculateCustomerMetrics,
    calculateProductMetrics,
  };
};