// types/dashboard.types.ts

export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }
  
  export interface Order {
    id: string;
    orderNumber: string;
    date: string;
    status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total: number;
    items: OrderItem[];
    tracking?: {
      number: string;
      carrier: string;
      status: string;
      estimatedDelivery: string;
      updates: {
        status: string;
        location: string;
        timestamp: string;
      }[];
    };
    shipping: {
      address: string;
      city: string;
      country: string;
      postalCode: string;
    };
    payment: {
      method: string;
      lastFour?: string;
      status: 'pending' | 'completed' | 'failed';
    };
  }
  
  export interface DashboardMetrics {
    totalOrders: number;
    wishlistItems: number;
    cartItems: number;
    totalSpent: number;
    monthlyOrderChange: number;
    recentOrders: Order[];
  }
  
  export interface ActivityItem {
    id: string;
    type: 'order' | 'wishlist' | 'cart' | 'profile' | 'review';
    action: string;
    itemId: string;
    itemName: string;
    timestamp: string;
    metadata?: Record<string, any>;
  }
  
  export interface DashboardData {
    metrics: DashboardMetrics;
    recentActivity: ActivityItem[];
    activeOrders: Order[];
  }