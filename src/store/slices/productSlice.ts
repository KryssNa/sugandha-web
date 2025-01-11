import { Product } from '@/components/shared/types/productTypes';
import { getProductById, getProductBySlug, getProducts } from '@/services/product.service';
// import { ProductService } from '@/services/product.service';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  metadata?: any;
  error: string | null;
}

const initialProductState: ProductState = {
  products: [],
  selectedProduct: null,
  loading: false,
  metadata: null,
  error: null,
};

// Fetch all products with optional filters
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (filters: object = {}, { rejectWithValue }) => {
    try {
      const { data, metadata } = await getProducts(filters);
      return { data, metadata };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Fetch a single product by ID
export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await getProductById(id);
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Fetch a product by slug
export const fetchProductBySlug = createAsyncThunk(
  'products/fetchBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      const { data } = await getProductBySlug(slug);
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
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
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
        state.metadata = action.payload.metadata;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch product by slug
      .addCase(fetchProductBySlug.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
