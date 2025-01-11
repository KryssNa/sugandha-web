// src/services/product.service.ts
import { Product, Review } from '@/components/shared/types/productTypes';
import { api } from '@/lib/axios';

// Get all products with filtering
export const getProducts = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  try {
    const response = await api.get(`/products?${params}`);
    if (response.data.success) {
      return {
        data: response.data.data.products,
        metadata: response.data.metadata
      }
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    console.error('Error in getProducts:', error);
    throw error;
  }
};


// Get product by ID
export const getProductById = async (id: string) => {
  return api.get<any, { data: Product }>(`/products/${id}`);
};

// Get product by slug
export const getProductBySlug = async (slug: string) => {
  return api.get<any, { data: Product }>(`/products/slug/${slug}`);
};

// Create product
export const createProduct = async (productData: Partial<Product>) => {
  return api.post<any, { data: Product }>('/products', productData);
};

// Update product
export const updateProduct = async (id: string, updateData: Partial<Product>) => {
  return api.patch<any, { data: Product }>(`/products/${id}`, updateData);
};

// Delete product
export const deleteProduct = async (id: string) => {
  return api.delete(`/products/${id}`);
};

// Add review
export const addReview = async (productId: string, review: Review) => {
  return api.post<any, { data: Product }>(`/products/${productId}/reviews`, review);
};

// Update stock
export const updateStock = async (id: string, quantity: number) => {
  return api.patch(`/products/${id}/stock`, { quantity });
};

// Update variant stock
export const updateVariantStock = async (id: string, variantSku: string, quantity: number) => {
  return api.patch(`/products/${id}/variant-stock`, { variantSku, quantity });
};

// Get featured products
export const getFeaturedProducts = async () => {
  return api.get<any, { data: Product[] }>('/products/featured');
};

// Get new arrivals
export const getNewArrivals = async () => {
  return api.get<any, { data: Product[] }>('/products/new-arrivals');
};

// Get best sellers
export const getBestSellers = async () => {
  return api.get<any, { data: Product[] }>('/products/best-sellers');
};

// Get related products
export const getRelatedProducts = async (id: string) => {
  return api.get<any, { data: Product[] }>(`/products/${id}/related`);
};
