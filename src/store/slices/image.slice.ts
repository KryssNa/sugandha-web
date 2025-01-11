// src/store/slices/imageSlice.ts
import { Image } from '@/components/shared/types/image.types';
import { api } from '@/lib/axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface ImageState {
    images: Image[];
    selectedImage: Image | null;
    loading: boolean;
    error: string | null;
    total: number;
    filteredTotal: number;
}

const initialState: ImageState = {
    images: [],
    selectedImage: null,
    loading: false,
    error: null,
    total: 0,
    filteredTotal: 0
};

// Async Thunks
export const fetchImages = createAsyncThunk(
    'images/fetchAll',
    async (params: {
        page?: number;
        limit?: number;
        search?: string;
        productId?: string;
        userId?: string;
    }) => {
        const response = await api.get('/images', { params });
        return response.data;
    }
);

export const uploadImages = createAsyncThunk(
    'images/upload',
    async (
        {
            files,
            entityType,
            entityId
        }: {
            files: File[];
            entityType: 'product' | 'profile' | 'banner';
            entityId?: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const formData = new FormData();
            files.forEach(file => formData.append('images', file));

            if (entityId) {
                formData.append('entityId', entityId);
            }
            formData.append('entityType', entityType);

            const response = await api.post('/images/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Upload failed');
        }
    }
);

export const updateImage = createAsyncThunk(
    'images/update',
    async ({
        id,
        data
    }: {
        id: string;
        data: Partial<Image>
    }) => {
        const response = await api.patch(`/images/${id}`, data);
        return response.data;
    }
);

export const deleteImage = createAsyncThunk(
    'images/delete',
    async (id: string) => {
        await api.delete(`/images/${id}`);
        return id;
    }
);

export const bulkDeleteImages = createAsyncThunk(
    'images/bulkDelete',
    async (ids: string[]) => {
        await api.delete('/images/bulk', { data: { ids } });
        return ids;
    }
);

const imageSlice = createSlice({
    name: 'images',
    initialState,
    reducers: {
        setSelectedImage: (state, action) => {
            state.selectedImage = action.payload;
        },
        clearErrors: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Images
            .addCase(fetchImages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchImages.fulfilled, (state, action) => {
                state.loading = false;
                state.images = action.payload.data;
                state.total = action.payload.metadata.total;
                state.filteredTotal = action.payload.metadata.filteredTotal;
            })
            .addCase(fetchImages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch images';
            })

            // Upload Images
            .addCase(uploadImages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadImages.fulfilled, (state, action) => {
                state.loading = false;
                const uploadedImages = action.payload.data;

                // Add new images to the start of the list
                state.images = [
                    ...uploadedImages.map((img: Image) => ({
                        ...img,
                        isPrimary: uploadedImages.length === 1 ? true : img.isPrimary
                    })),
                    ...state.images
                ];

                state.total += uploadedImages.length;
                state.filteredTotal += uploadedImages.length;
            })
            .addCase(uploadImages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Image upload failed';
            })

            // Update Image
            .addCase(updateImage.fulfilled, (state, action) => {
                const index = state.images.findIndex(img => img.id === action.payload.data.id);
                if (index !== -1) {
                    state.images[index] = {
                        ...state.images[index],
                        ...action.payload.data
                    };
                }
            })

            // Delete Image
            .addCase(deleteImage.fulfilled, (state, action) => {
                state.images = state.images.filter(img => img.id !== action.payload);
                state.total -= 1;
                state.filteredTotal -= 1;
            })

            // Bulk Delete Images
            .addCase(bulkDeleteImages.fulfilled, (state, action) => {
                const deletedCount = action.payload.length;
                state.images = state.images.filter(img => !action.payload.includes(img.id));
                state.total -= deletedCount;
                state.filteredTotal -= deletedCount;
            });
    }
});

export const { setSelectedImage, clearErrors } = imageSlice.actions;
export default imageSlice.reducer;