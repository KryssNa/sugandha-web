// services/dashboard.service.ts
import { Order } from "@/components/sections/order history/types";
import { ActivityItem, DashboardData } from "@/components/shared/types/dashboard.types";
import { api } from "@/lib/axios";

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    try {
      const response = await api.get('/dashboard/overview');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      throw error;
    }
  },

  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    sortBy?: string;
  }): Promise<{ orders: Order[]; total: number }> {
    try {
      const response = await api.get('/dashboard/orders', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      throw error;
    }
  },

  async getOrderDetails(orderId: string): Promise<Order> {
    try {
      const response = await api.get(`/dashboard/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      throw error;
    }
  },

  async getActivityLog(params?: {
    page?: number;
    limit?: number;
    type?: string;
  }): Promise<{ activities: ActivityItem[]; total: number }> {
    try {
      const response = await api.get('/dashboard/activity', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch activity log:', error);
      throw error;
    }
  },

  async updateOrderTracking(orderId: string, trackingData: {
    carrier: string;
    trackingNumber: string;
  }): Promise<Order> {
    try {
      const response = await api.patch(`/dashboard/orders/${orderId}/tracking`, trackingData);
      return response.data;
    } catch (error) {
      console.error('Failed to update order tracking:', error);
      throw error;
    }
  },

  async cancelOrder(orderId: string, reason?: string): Promise<Order> {
    try {
      const response = await api.post(`/dashboard/orders/${orderId}/cancel`, { reason });
      return response.data;
    } catch (error) {
      console.error('Failed to cancel order:', error);
      throw error;
    }
  }
};