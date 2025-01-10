
  // src/services/product.service.ts
import { Product, Review } from '@/components/shared/types/productTypes';
import { api } from '@/lib/axios';

  export class ProductService {
    // Get all products with filtering
    // static async getProducts(filters: ProductFilterProps = {}) {
    //   const params = new URLSearchParams();
      
    //   Object.entries(filters).forEach(([key, value]) => {
    //     if (value !== undefined) {
    //       params.append(key, value.toString());
    //     }
    //   });
  
    //   return api.get<any, { data: Product[]; metadata: any }>(`/products?${params}`);
    // }
  
    // Get product by ID
    static async getProductById(id: string) {
      return api.get<any, { data: Product }>(`/products/${id}`);
    }
  
    // Get product by slug
    static async getProductBySlug(slug: string) {
      return api.get<any, { data: Product }>(`/products/slug/${slug}`);
    }
  
    // Create product
    static async createProduct(productData: Partial<Product>) {
      return api.post<any, { data: Product }>('/products', productData);
    }
  
    // Update product
    static async updateProduct(id: string, updateData: Partial<Product>) {
      return api.patch<any, { data: Product }>(`/products/${id}`, updateData);
    }
  
    // Delete product
    static async deleteProduct(id: string) {
      return api.delete(`/products/${id}`);
    }
  
    // Add review
    static async addReview(productId: string, review: Review) {
      return api.post<any, { data: Product }>(`/products/${productId}/reviews`, review);
    }
  
    // Update stock
    static async updateStock(id: string, quantity: number) {
      return api.patch(`/products/${id}/stock`, { quantity });
    }
  
    // Update variant stock
    static async updateVariantStock(id: string, variantSku: string, quantity: number) {
      return api.patch(`/products/${id}/variant-stock`, { variantSku, quantity });
    }
  
    // Get featured products
    static async getFeaturedProducts() {
      return api.get<any, { data: Product[] }>('/products/featured');
    }
  
    // Get new arrivals
    static async getNewArrivals() {
      return api.get<any, { data: Product[] }>('/products/new-arrivals');
    }
  
    // Get best sellers
    static async getBestSellers() {
      return api.get<any, { data: Product[] }>('/products/best-sellers');
    }
  
    // Get related products
    static async getRelatedProducts(id: string) {
      return api.get<any, { data: Product[] }>(`/products/${id}/related`);
    }
  }
  
 