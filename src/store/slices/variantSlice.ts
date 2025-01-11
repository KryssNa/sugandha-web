// store/slices/variantSlice.ts
import { IVariant } from '@/components/shared/types/productTypes';
import { api } from '@/lib/axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface BulkUpdateVariant {
    sku: string;
    quantity: number;
}

interface BulkUpdateResponse {
    data: IVariant[];
}
interface VariantState {
    variants: IVariant[];
    selectedVariant: IVariant | null;
    loading: boolean;
    error: string | null;
    total: number;
    filteredTotal: number;
}

const initialState: VariantState = {
    variants: [],
    selectedVariant: null,
    loading: false,
    error: null,
    total: 0,
    filteredTotal: 0
};

// Async Thunks
export const fetchVariants = createAsyncThunk(
    'variants/fetchAll',
    async (params: {
        productId: string;
        page?: number;
        limit?: number;
        search?: string
    }) => {
        const response = await api.get(`/products/${params.productId}/variants`, { params });
        return response.data;
    }
);

export const createVariant = createAsyncThunk(
    'variants/create',
    async ({ productId, variantData }: {
        productId: string;
        variantData: Partial<IVariant>
    }) => {
        const response = await api.post(`/products/${productId}/variants`, variantData);
        return response.data;
    }
);

export const updateVariant = createAsyncThunk(
    'variants/update',
    async ({
        productId,
        sku,
        variantData
    }: {
        productId: string;
        sku: string;
        variantData: Partial<IVariant>
    }) => {
        const response = await api.patch(`/products/${productId}/variants/${sku}`, variantData);
        return response.data;
    }
);

export const deleteVariant = createAsyncThunk(
    'variants/delete',
    async ({
        productId,
        sku
    }: {
        productId: string;
        sku: string
    }) => {
        await api.delete(`/products/${productId}/variants/${sku}`);
        return sku;
    }
);

export const updateVariantStock = createAsyncThunk(
    'variants/updateStock',
    async ({
        productId,
        sku,
        quantity
    }: {
        productId: string;
        sku: string;
        quantity: number
    }) => {
        const response = await api.patch(`/products/${productId}/variants/${sku}/stock`, { quantity });
        return response.data;
    }
);

export const bulkUpdateVariantStock = createAsyncThunk(
    'variants/bulkUpdateStock',
    async ({
        productId,
        updates
    }: {
        productId: string;
        updates: Array<{ sku: string; quantity: number }>
    }) => {
        const response = await api.patch(`/products/${productId}/variants/bulk-stock-update`, { updates });
        return response.data;
    }
);

export const reorderVariants = createAsyncThunk(
    'variants/reorder',
    async ({
        productId,
        order
    }: {
        productId: string;
        order: string[]
    }) => {
        await api.patch(`/products/${productId}/variants/reorder`, { order });
        return order;
    }
);

const variantSlice = createSlice({
    name: 'variants',
    initialState,
    reducers: {
        setSelectedVariant: (state, action) => {
            state.selectedVariant = action.payload;
        },
        clearErrors: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Variants
            .addCase(fetchVariants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVariants.fulfilled, (state, action) => {
                state.loading = false;
                state.variants = action.payload.data;
                state.total = action.payload.metadata.total;
                state.filteredTotal = action.payload.metadata.filteredTotal;
            })
            .addCase(fetchVariants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch variants';
            })

            // Create Variant
            .addCase(createVariant.fulfilled, (state, action) => {
                state.variants.push(action.payload.data);
                state.total += 1;
                state.filteredTotal += 1;
            })

            // Update Variant
            .addCase(updateVariant.fulfilled, (state, action) => {
                const index = state.variants.findIndex(v => v.sku === action.payload.data.sku);
                if (index !== -1) {
                    state.variants[index] = action.payload.data;
                }
            })

            // Delete Variant
            .addCase(deleteVariant.fulfilled, (state, action) => {
                state.variants = state.variants.filter(v => v.sku !== action.payload);
                state.total -= 1;
                state.filteredTotal -= 1;
            })

            // Update Stock
            .addCase(updateVariantStock.fulfilled, (state, action) => {
                const index = state.variants.findIndex(v => v.sku === action.payload.data.sku);
                if (index !== -1) {
                    state.variants[index] = action.payload.data;
                }
            })

            // Bulk Stock Update
            .addCase(bulkUpdateVariantStock.fulfilled, (state, action) => {
                const updatedVariants = action.payload.data;

                const bulkUpdateHandler = (state: VariantState, action: { payload: BulkUpdateResponse }) => {
                    const updatedVariants = action.payload.data;
                    updatedVariants.forEach((updatedVariant: IVariant) => {
                        const index = state.variants.findIndex(v => v.sku === updatedVariant.sku);
                        if (index !== -1) {
                            state.variants[index] = updatedVariant;
                        }
                    });
                };
            })

            // Reorder Variants
            .addCase(reorderVariants.fulfilled, (state, action) => {
                const orderedSkus = action.payload;
                state.variants = orderedSkus
                    .map(sku => state.variants.find(v => v.sku === sku))
                    .filter((v): v is IVariant => v !== undefined);
            });
    }
});

export const { setSelectedVariant, clearErrors } = variantSlice.actions;
export default variantSlice.reducer;