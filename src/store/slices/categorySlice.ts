// store/slices/categorySlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/axios';
import { Category } from '@/components/shared/types/category.types';

interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  loading: boolean;
  error: string | null;
  total: number;
  filteredTotal: number;
}

const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,
  total: 0,
  filteredTotal: 0
};

// Async thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (params: { page?: number; limit?: number; search?: string; status?: string; parentId?: string }) => {
    const response = await api.get('/categories', { params });
    return response.data;
  }
);

export const createCategory = createAsyncThunk(
  'categories/create',
  async (categoryData: Partial<Category>) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  }
);

export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, data }: { id: string; data: Partial<Category> }) => {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data;
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id: string) => {
    await api.delete(`/categories/${id}`);
    return id;
  }
);

export const reorderCategories = createAsyncThunk(

  'categories/reorderCategories',

  async (orderedIds: string[], { rejectWithValue }) => {

      await api.post(`/reorderCategories/${orderedIds}`);
  }
)

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data;
        state.total = action.payload.metadata.total;
        state.filteredTotal = action.payload.metadata.filteredTotal;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })

      // Create Category
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.unshift(action.payload.data);
        state.total += 1;
        state.filteredTotal += 1;
      })

      // Update Category
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(cat => cat.id === action.payload.data._id);
        if (index !== -1) {
          state.categories[index] = action.payload.data;
        }
      })

      // Delete Category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(cat => cat.id !== action.payload);
        state.total -= 1;
        state.filteredTotal -= 1;
      })

      // Reorder Categories
      .addCase(reorderCategories.rejected, (state, action) => {

        state.error = action.error.message ?? null;

        state.loading = false;

      })
  }
});

export const { setSelectedCategory, clearErrors } = categorySlice.actions;
export default categorySlice.reducer;