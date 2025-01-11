// src/store/slices/productSlice.ts
import {
  IVariant,
  Product,
  ProductFilters,
  ProductResponse,
  Review
} from '@/components/shared/types/product.types';
import { ProductService } from '@/services/product.service';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  metadata?: ProductResponse['metadata'];
  error: string | null;
}

const initialProductState: ProductState = {
  products: [],
  selectedProduct: null,
  loading: false,
  metadata: undefined,
  error: null,
};

// Async Thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (filters: ProductFilters = {}, { rejectWithValue }) => {
    try {
      return await ProductService.getProducts(filters);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch products'
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await ProductService.getProductById(id);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch product'
      );
    }
  }
);

export const fetchProductBySlug = createAsyncThunk(
  'products/fetchBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      return await ProductService.getProductBySlug(slug);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch product'
      );
    }
  }
);

// Create Product Thunk
export const createProduct = createAsyncThunk(
  'products/create',
  async (productData: Partial<Product>, { rejectWithValue }) => {
    try {
      const createdProduct = await ProductService.createProduct(productData);
      return createdProduct;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to create product'
      );
    }
  }
);

// Update Product Thunk
export const updateProduct = createAsyncThunk(
  'products/update',
  async (
    {
      id,
      updateData
    }: {
      id: string;
      updateData: Partial<Product>
    },
    { rejectWithValue }
  ) => {
    try {
      const updatedProduct = await ProductService.updateProduct(id, updateData);
      return updatedProduct;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update product'
      );
    }
  }
);

// Delete Product Thunk
export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await ProductService.deleteProduct(id);
      return id; // Return the ID of the deleted product
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to delete product'
      );
    }
  }
);

// Add Variant Thunk
export const addProductVariant = createAsyncThunk(
  'products/addVariant',
  async (
    {
      productId,
      variant
    }: {
      productId: string;
      variant: Partial<IVariant>
    },
    { rejectWithValue }
  ) => {
    try {
      const updatedProduct = await ProductService.addVariant(productId, variant);
      return updatedProduct;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to add variant'
      );
    }
  }
);

// Remove Variant Thunk
export const removeProductVariant = createAsyncThunk(
  'products/removeVariant',
  async (
    {
      productId,
      variantSku
    }: {
      productId: string;
      variantSku: string
    },
    { rejectWithValue }
  ) => {
    try {
      const updatedProduct = await ProductService.removeVariant(productId, variantSku);
      return updatedProduct;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to remove variant'
      );
    }
  }
);

// Bulk Update Variants Thunk
export const bulkUpdateVariants = createAsyncThunk(
  'products/bulkUpdateVariants',
  async (
    {
      productId,
      variants
    }: {
      productId: string;
      variants: Partial<IVariant>[]
    },
    { rejectWithValue }
  ) => {
    try {
      const updatedProduct = await ProductService.bulkUpdateVariants(productId, variants);
      return updatedProduct;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update variants'
      );
    }
  }
);

// Add Review Thunk
export const addProductReview = createAsyncThunk(
  'products/addReview',
  async (
    {
      productId,
      review
    }: {
      productId: string;
      review: Partial<Review>
    },
    { rejectWithValue }
  ) => {
    try {
      const updatedProduct = await ProductService.addReview(productId, review);
      return updatedProduct;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to add review'
      );
    }
  }
);

// Update Stock Thunk
export const updateProductStock = createAsyncThunk(
  'products/updateStock',
  async (
    {
      id,
      quantity
    }: {
      id: string;
      quantity: number
    },
    { rejectWithValue }
  ) => {
    try {
      const updatedProduct = await ProductService.updateStock(id, quantity);
      return updatedProduct;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update stock'
      );
    }
  }
);

// Update Variant Stock Thunk
export const updateVariantStock = createAsyncThunk(
  'products/updateVariantStock',
  async (
    {
      id,
      variantSku,
      quantity
    }: {
      id: string;
      variantSku: string;
      quantity: number
    },
    { rejectWithValue }
  ) => {
    try {
      const updatedProduct = await ProductService.updateVariantStock(id, variantSku, quantity);
      return updatedProduct;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update variant stock'
      );
    }
  }
);


const productSlice = createSlice({
  name: 'product',
  initialState: initialProductState,
  reducers: {
    setSelectedProduct: (state, action: PayloadAction<Product>) => {
      state.selectedProduct = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    const handlePendingState = (state: ProductState) => {
      state.loading = true;
      state.error = null;
    };

    const handleRejectedState = (state: ProductState, action) => {
      state.loading = false;
      state.error = action.payload as string;
    };

    // Fetch Products
    builder
      .addCase(fetchProducts.pending, handlePendingState)
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.metadata = action.payload.metadata;
      })
      .addCase(fetchProducts.rejected, handleRejectedState);

    // Fetch Product by ID
    builder
      .addCase(fetchProductById.pending, handlePendingState)
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, handleRejectedState);

    // Fetch Product by Slug  
    builder
      .addCase(fetchProductBySlug.pending, handlePendingState)
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductBySlug.rejected, handleRejectedState);

    builder
      .addCase(createProduct.pending, handlePendingState)
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload);
        state.selectedProduct = action.payload;
      })
      .addCase(createProduct.rejected, handleRejectedState);

    // Update Product
    builder
      .addCase(updateProduct.pending, handlePendingState)
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.selectedProduct = action.payload;
      })
      .addCase(updateProduct.rejected, handleRejectedState);

    // Delete Product
    builder
      .addCase(deleteProduct.pending, handlePendingState)
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(p => p.id !== action.payload);
        if (state.selectedProduct?.id === action.payload) {
          state.selectedProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, handleRejectedState);

    // Add Variant
    builder
      .addCase(addProductVariant.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct = action.payload;
        }
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      });

    // Remove Variant
    builder
      .addCase(removeProductVariant.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct = action.payload;
        }
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      });

    // Bulk Update Variants
    builder
      .addCase(bulkUpdateVariants.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct = action.payload;
        }
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      });

    // Add Review
    builder
      .addCase(addProductReview.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct = action.payload;
        }
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      });

    // Update Stock
    builder
      .addCase(updateProductStock.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct = action.payload;
        }
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      });

    // Update Variant Stock
    builder
      .addCase(updateVariantStock.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct = action.payload;
        }
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      });
  },
});

export const { setSelectedProduct, clearError, } = productSlice.actions;
export default productSlice.reducer;