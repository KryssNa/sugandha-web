// services/cart.service.ts
import { ApiCart } from '@/components/shared/types/cart.types';
import { Product } from '@/components/shared/types/product.types';
import { api } from '@/lib/axios';

export const CartService = {

  getCart: async () => {
    const response = await api.get<ApiCart>('/cart');
    return response.data;
  },

  addToCart: async (productId: string, quantity: number = 1) => {
    // const dispatch = useDispatch();
    // try {
    //   const response = await api.post<ApiCart>('/cart/add', {
    //     productId,
    //     quantity
    //   });
    //   return response.data;
    // }catch(err){
    //  if (err.status === 401 || !err.status) {
    //          dispatch(addToCartLocal({
    //            product: items as Product,
    //            quantity
    //          }));
    //        }
    //   return err;
    // }
    const response = await api.post<ApiCart>('/cart/add', {
      productId,
      quantity
    });
    return response.data;
  },

  updateQuantity: async (productId: string, quantity: number) => {
    const response = await api.patch<ApiCart>('/cart/quantity', {
      productId,
      quantity
    });
    return response.data;
  },

  bulkUpdate: async (updates: Array<{ productId: string; quantity: number }>) => {
    const response = await api.patch<ApiCart>('/cart/bulk-update', {
      updates
    });
    return response.data;
  },

  removeFromCart: async (productId: string) => {
    const response = await api.delete<ApiCart>(`/cart/${productId}`);
    return response.data;
  },

  applyCoupon: async (couponCode: string) => {
    const response = await api.post<ApiCart>('/cart/coupon', {
      couponCode
    });
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete<ApiCart>('/cart/clear');
    return response.data;
  },

  mergeCart: async () => {
    const response = await api.post<ApiCart>('/cart/merge');
    return response.data;
  }
};