// services/cart.service.ts
import {  ApiCartResponse } from '@/components/shared/types/cart.types';
import { Product } from '@/components/shared/types/product.types';
import { api } from '@/lib/axios';


  export const CartService = {
    getCart: async () => {
      try {
        const response = await api.get<ApiCartResponse>('/cart');
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to fetch cart');
        }
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  
    addToCart: async (productId: string, quantity: number = 1) => {
      const response = await api.post<ApiCartResponse>('/cart/add', {
        productId,
        quantity
      });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to add item');
      }
      return response.data.data;
    },
  
    updateQuantity: async (productId: string, quantity: number) => {
      const response = await api.patch<ApiCartResponse>('/cart/quantity', {
        productId,
        quantity
      });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update quantity');
      }
      return response.data.data;
    },
  
    removeFromCart: async (productId: string) => {
      const response = await api.delete<ApiCartResponse>(`/cart/${productId}`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to remove item');
      }
      return response.data.data;
    },

  bulkUpdate: async (updates: Array<{ productId: string; quantity: number }>) => {
    const response = await api.patch<ApiCartResponse>('/cart/bulk-update', {
      updates
    });
    return response.data;
  },

  applyCoupon: async (couponCode: string) => {
    const response = await api.post<ApiCartResponse>('/cart/coupon', {
      couponCode
    });
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete<ApiCartResponse>('/cart/clear');
    return response.data;
  },

  mergeCart: async () => {
    const response = await api.post<ApiCartResponse>('/cart/merge');
    return response.data;
  }
};