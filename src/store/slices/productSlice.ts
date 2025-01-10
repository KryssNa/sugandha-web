import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';


interface Product {
    id: string;
    title: string;
    price: number;
    description: string;
    images: string[];
    // ... other product properties
  }
  
  interface ProductState {
    products: Product[];
    selectedProduct: Product | null;
    loading: boolean;
    error: string | null;
  }
  
  const initialProductState: ProductState = {
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,
  };
  
  export const fetchProducts = createAsyncThunk(
    'products/fetchAll',
    async (_, { rejectWithValue }) => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
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
        .addCase(fetchProducts.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchProducts.fulfilled, (state, action) => {
          state.loading = false;
          state.products = action.payload;
        })
        .addCase(fetchProducts.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
    },
  });
  
  export const { setSelectedProduct } = productSlice.actions;
  export default productSlice.reducer;