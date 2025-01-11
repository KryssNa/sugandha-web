// src/services/product.service.ts
import {
  IVariant,
  Product,
  ProductFilters,
  ProductResponse,
  Review
} from '@/components/shared/types/product.types';
import { api } from '@/lib/axios';

export class ProductService {
  // Get all products with filtering
  static async getProducts(filters: ProductFilters = {}): Promise<ProductResponse> {
    try {
      const params = new URLSearchParams();

      // Dynamically add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });

      const response = await api.get(`/products?${params.toString()}`);

      if (response.data.success) {
        return {
          products: response.data.data.products,
          metadata: response.data.metadata
        };
      }

      throw new Error(response.data.message || 'Failed to fetch products');
    } catch (error) {
      console.error('Error in getProducts:', error);
      throw error;
    }
  }

  // Get product by ID
  static async getProductById(id: string): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  }

  // Get product by slug
  static async getProductBySlug(slug: string): Promise<Product> {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data.data;
  }

  // Create product
  static async createProduct(productData: Partial<Product>): Promise<Product> {
    const response = await api.post('/products', productData);
    return response.data.data;
  }

  // Update product
  static async updateProduct(id: string, updateData: Partial<Product>): Promise<Product> {
    const response = await api.patch(`/products/${id}`, updateData);
    return response.data.data;
  }

  // Delete product
  static async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  }

  // Add review
  static async addReview(productId: string, review: Partial<Review>): Promise<Product> {
    const response = await api.post(`/products/${productId}/reviews`, review);
    return response.data.data;
  }

  // Update stock
  static async updateStock(id: string, quantity: number): Promise<Product> {
    const response = await api.patch(`/products/${id}/stock`, { quantity });
    return response.data.data;
  }

  // Update variant stock
  static async updateVariantStock(
    id: string,
    variantSku: string,
    quantity: number
  ): Promise<Product> {
    const response = await api.patch(`/products/${id}/variant-stock`, {
      variantSku,
      quantity
    });
    return response.data.data;
  }

  // Get featured products
  static async getFeaturedProducts(): Promise<Product[]> {
    const response = await api.get('/products/featured');
    return response.data.data;
  }

  // Get new arrivals
  static async getNewArrivals(): Promise<Product[]> {
    const response = await api.get('/products/new-arrivals');
    return response.data.data;
  }

  // Get best sellers
  static async getBestSellers(): Promise<Product[]> {
    const response = await api.get('/products/best-sellers');
    return response.data.data;
  }

  // Get related products
  static async getRelatedProducts(id: string): Promise<Product[]> {
    const response = await api.get(`/products/${id}/related`);
    return response.data.data;
  }

  // Add/Update variant
  static async addVariant(
    productId: string,
    variant: Partial<IVariant>
  ): Promise<Product> {
    const response = await api.post(`/products/${productId}/variants`, variant);
    return response.data.data;
  }

  // Remove variant
  static async removeVariant(
    productId: string,
    variantSku: string
  ): Promise<Product> {
    const response = await api.delete(`/products/${productId}/variants/${variantSku}`);
    return response.data.data;
  }

  // Bulk update variants
  static async bulkUpdateVariants(
    productId: string,
    variants: Partial<IVariant>[]
  ): Promise<Product> {
    const response = await api.patch(`/products/${productId}/variants/bulk`, { variants });
    return response.data.data;
  }
}