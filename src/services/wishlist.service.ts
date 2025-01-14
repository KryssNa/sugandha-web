import { api } from '@/lib/axios';

export interface WishlistItem {
  id: string;
  name: string;
  image: string;
  price: number;
  inStock: boolean;
  rating?: number;
}

export interface Wishlist {
  products: WishlistItem[];
}

export const WishlistService = {
  // Get wishlist
  getWishlist: async () => {
    const response = await api.get<Wishlist>('/wishlist');
    return response.data;
  },

  // Add to wishlist
  addToWishlist: async (productId: string) => {
    const response = await api.post<Wishlist>('/wishlist/add', {
      productId
    });
    
    return response.data;
  },

  // Remove from wishlist
  removeFromWishlist: async (productId: string) => {
    const response = await api.delete<Wishlist>(`/wishlist/${productId}`);
    return response.data;
  },

  // Move item to cart
  moveToCart: async (productId: string) => {
    const response = await api.post(`/wishlist/${productId}/move-to-cart`);
    return response.data;
  },

  // Check if product is in wishlist
  isInWishlist: async (productId: string) => {
    const response = await api.get<{ isInWishlist: boolean }>(
      `/wishlist/${productId}/check`
    );
    return response.data.isInWishlist;
  },

  // Clear wishlist
  clearWishlist: async () => {
    const response = await api.delete('/wishlist/clear');
    return response.data;
  }
};