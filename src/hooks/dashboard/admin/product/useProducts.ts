// hooks/useProducts.ts
import useSweetAlert from '@/components/shared/toast/showToast';
import { Product, ProductFilters } from '@/components/shared/types/product.types';
import { useCallback, useEffect, useState } from 'react';

// interface ProductFilters {
//   category?: string[];
//   gender?: string;
//   concentration?: string;
//   priceRange?: [number, number];
//   inStock?: boolean;
//   collections?: string[];
//   seasonality?: string[];
//   sillage?: string;
//   longevity?: string;
//   searchQuery?: string;
//   sortBy?: 'price' | 'rating' | 'createdAt' | 'title';
//   sortOrder?: 'asc' | 'desc';

//   brand?: string;

//   page?: number;

//   limit?: number;

// }

interface ProductsState {
  products: Product[];
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

interface UpdateProductData extends Partial<Omit<Product, 'id' | 'updateStock'>> {
  updateStock?: number;
}

export const useProducts = (initialFilters?: Partial<ProductFilters>) => {
  const [state, setState] = useState<ProductsState>({
    products: [],
    totalProducts: 0,
    currentPage: 1,
    totalPages: 1,
    loading: true,
    error: null,
  });

  const [filters, setFilters] = useState<ProductFilters>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...initialFilters,
  });

  const createAlert = useSweetAlert();

  const fetchProducts = useCallback(async (page = 1) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const queryParams = new URLSearchParams({
        page: page.toString(),
        ...(filters.category && { category: filters.category.join(',') }),
        ...(filters.gender && { gender: filters.gender }),
        ...(filters.concentration && { concentration: filters.concentration }),
        ...(filters.priceRange && {
          minPrice: filters.priceRange[0].toString(),
          maxPrice: filters.priceRange[1].toString()
        }),
        ...(filters.searchQuery && { search: filters.searchQuery }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
        ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
        ...(filters.inStock !== undefined && { inStock: filters.inStock.toString() }),
        ...(filters.collections && { collections: filters.collections.join(',') }),
        ...(filters.seasonality && { seasonality: filters.seasonality.join(',') }),
        ...(filters.sillage && { sillage: filters.sillage }),
        ...(filters.longevity && { longevity: filters.longevity }),
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch products');
      }

      setState(prev => ({
        ...prev,
        products: data.products,
        totalProducts: data.total,
        currentPage: page,
        totalPages: Math.ceil(data.total / 20), // Assuming 20 items per page
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'An error occurred'
      }));
      createAlert("error",
        err instanceof Error ? err.message : 'Failed to fetch products',

      );
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [filters]);

  const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'updateStock'>) => {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create product');
      }

      setState(prev => ({
        ...prev,
        products: [data.product, ...prev.products],
        totalProducts: prev.totalProducts + 1,
      }));

      createAlert("success",
        "Product created successfully",
      );

      return data.product;
    } catch (err) {
      createAlert("error",
        err instanceof Error ? err.message : 'Failed to create product',
      );
      throw err;
    }
  };

  const updateProduct = async (id: string, data: UpdateProductData) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update product');
      }

      setState(prev => ({
        ...prev,
        products: prev.products.map(product =>
          product.id === id ? { ...product, ...result.product } : product
        ),
      }));

      createAlert("success",
        "Product updated successfully",
      );

      return result.product;
    } catch (err) {
      createAlert("error",
        err instanceof Error ? err.message : 'Failed to update product',
      );
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete product');
      }

      setState(prev => ({
        ...prev,
        products: prev.products.filter(product => product.id !== id),
        totalProducts: prev.totalProducts - 1,
      }));

      createAlert("success",
        "Product deleted successfully",
      );
    } catch (err) {
      createAlert("error",
        err instanceof Error ? err.message : 'Failed to delete product',
      );
      throw err;
    }
  };

  const updateStock = async (id: string, variantSku: string, quantity: number) => {
    try {
      const response = await fetch(`/api/admin/products/${id}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantSku, quantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update stock');
      }

      setState(prev => ({
        ...prev,
        products: prev.products.map(product => {
          if (product.id === id) {
            const updatedVariants = product.variants.map(variant =>
              variant.sku === variantSku
                ? { ...variant, quantity: variant.quantity + quantity }
                : variant
            );
            return { ...product, variants: updatedVariants };
          }
          return product;
        }),
      }));

      createAlert("success",
        "Stock updated successfully",
      );
    } catch (err) {
      createAlert("error",
        err instanceof Error ? err.message : 'Failed to update stock',
      );
      throw err;
    }
  };

  const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const getProductById = useCallback((id: string) => {
    return state.products.find(product => product.id === id);
  }, [state.products]);


  const resetFilters = useCallback(() => {
    setFilters({
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  }, []);

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  return {
    ...state,
    filters,
    actions: {
      fetchProducts,
      createProduct,
      updateProduct,
      deleteProduct,
      updateStock,
      updateFilters,
      resetFilters,
      getProductById
    },
  };
};