// types/dashboard.ts
export interface OrderSummary {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    recentOrders: Array<{
      id: string;
      customer: string;
      amount: number;
      status: 'pending' | 'completed' | 'cancelled';
      date: string;
    }>;
  }
  
  export interface RevenueSummary {
    totalRevenue: number;
    revenueGrowth: number;
    averageOrderValue: number;
    projectedRevenue: number;
    revenueByPeriod: Array<{
      period: string;
      revenue: number;
      orders: number;
    }>;
  }
  
  export interface CustomerSummary {
    totalCustomers: number;
    newCustomers: number;
    repeatCustomers: number;
    customerGrowth: number;
    topCustomers: Array<{
      id: string;
      name: string;
      email: string;
      totalSpent: number;
      totalOrders: number;
      lastOrder: string;
    }>;
    customerSegments: Array<{
      segment: string;
      count: number;
      percentage: number;
    }>;
  }
  
  export interface ProductSummary {
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    topProducts: Array<{
      id: string;
      name: string;
      sku: string;
      price: number;
      stock: number;
      sales: number;
    }>;
    productCategories: Array<{
      category: string;
      count: number;
      revenue: number;
    }>;
  }
  
  export interface DashboardState {
    orders: OrderSummary;
    revenue: RevenueSummary;
    customers: CustomerSummary;
    products: ProductSummary;
    dateRange: string;
    loading: boolean;
    error: string | null;
  }

// types/dashboard.ts
export interface DashboardMetric {
  title: string;
  value: string;
  trend: number;
  icon: React.ElementType;
  chartData: Array<{ date: string; value: number }>;
}

export interface DashboardData {
  revenue: {
    totalRevenue: number;
    revenueGrowth: number;
    revenueByPeriod: Array<{
      period: string;
      revenue: number;
    }>;
    averageOrderValue: number;
    projectedRevenue: number;
  };
  orders: {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    recentOrders: Array<{
      id: string;
      date: string;
      amount: number;
      status: 'pending' | 'completed' | 'cancelled';
    }>;
  };
  customers: {
    totalCustomers: number;
    newCustomers: number;
    customerGrowth: number;
    topCustomers: Array<{
      id: string;
      name: string;
      lastOrder: string;
      totalSpent: number;
    }>;
  };
  products: {
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    productCategories: Array<{
      category: string;
      count: number;
      revenue: number;
    }>;
  };
  metrics?: {
    revenue: DashboardMetric;
    orders: DashboardMetric;
    customers: DashboardMetric;
    products: DashboardMetric;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
  }>;
  salesAnalytics: Array<{
    date: string;
    sales: number;
    orders: number;
  }>;
}
  
export  interface UseDashboardReturn {
    data: DashboardData | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    setDateRange: (range: string) => void;
  }