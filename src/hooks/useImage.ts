// hooks/useImages.ts
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useCallback, useState } from 'react';
import Swal from 'sweetalert2';

import { Image } from '@/components/shared/types/image.types';
import { bulkDeleteImages, deleteImage, fetchImages, setSelectedImage, updateImage, uploadImages } from '@/store/slices/image.slice';
export const useImages = () => {
    const dispatch = useAppDispatch();
    const {
        images,
        selectedImage,
        loading,
        error,
        total,
        filteredTotal
    } = useAppSelector(state => state.images);

    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        search: '',
        productId: '',
        userId: ''
    });

    // Toast notification handler
    const showToast = (type: "success" | "error", message: string) => {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });

        Toast.fire({
            customClass: { popup: "z-xxxl" },
            icon: type,
            title: message
        });
    };

    const loadImages = useCallback(async (params = filters) => {
        try {
            await dispatch(fetchImages(params)).unwrap();
        } catch (error) {
            showToast('error', (error as any).message || 'Failed to load images');
        }
    }, [dispatch, filters]);

    const handleUploadImages = useCallback(async (
        files: File[],
        entityType: 'product' | 'profile' | 'banner',
        entityId?: string
    ) => {
        try {
            const result = await dispatch(uploadImages({
                files,
                entityType,
                entityId
            })).unwrap();

            showToast('success', 'Images uploaded successfully');
            return result.data;
        } catch (error) {
            showToast('error', (error as any).message || 'Failed to upload images');
            throw error;
        }
    }, [dispatch]);

    const handleUpdateImage = useCallback(async (id: string, data: Partial<Image>) => {
        try {
            const result = await dispatch(updateImage({ id, data })).unwrap();
            showToast('success', 'Image updated successfully');
            return result.data;
        } catch (error) {
            showToast('error', (error as any).message || 'Failed to update image');
            throw error;
        }
    }, [dispatch]);

    const handleDeleteImage = useCallback(async (id: string) => {
        const result = await Swal.fire({
            title: 'Delete Image',
            text: 'Are you sure you want to delete this image?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await dispatch(deleteImage(id)).unwrap();
                showToast('success', 'Image deleted successfully');
            } catch (error) {
                showToast('error', (error as any).message || 'Failed to delete image');
                throw error;
            }
        }
    }, [dispatch]);

    const handleBulkDeleteImages = useCallback(async (ids: string[]) => {
        const result = await Swal.fire({
            title: 'Delete Images',
            text: `Are you sure you want to delete ${ids.length} images?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete them!'
        });

        if (result.isConfirmed) {
            try {
                await dispatch(bulkDeleteImages(ids)).unwrap();
                showToast('success', `${ids.length} images deleted successfully`);
            } catch (error) {
                showToast('error', (error as any).message || 'Failed to delete images');
                throw error;
            }
        }
    }, [dispatch]);

    const handleSelectImage = useCallback((image: Image | null) => {
        dispatch(setSelectedImage(image));
    }, [dispatch]);

    const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: newFilters.page || (Object.keys(newFilters).length > 0 ? 1 : prev.page)
        }));
    }, []);

    const setPrimaryImage = useCallback(async (id: string) => {
        try {
            await handleUpdateImage(id, { isPrimary: true });
            // Optionally, you can update other images' isPrimary to false
            const otherImages = images.filter(img => img.id !== id);
            await Promise.all(
                otherImages.map(img =>
                    img.isPrimary ? handleUpdateImage(img.id, { isPrimary: false }) : Promise.resolve()
                )
            );
        } catch (error) {
            showToast('error', 'Failed to set primary image');
        }
    }, [handleUpdateImage, images]);

    return {
        // State
        images,
        selectedImage,
        loading,
        error,
        filters,
        metadata: {
            total,
            filteredTotal,
            totalPages: Math.ceil(total / filters.limit),
            hasNextPage: filters.page * filters.limit < filteredTotal,
            hasPrevPage: filters.page > 1
        },

        // Actions
        loadImages,
        uploadImages: handleUploadImages,
        updateImage: handleUpdateImage,
        deleteImage: handleDeleteImage,
        bulkDeleteImages: handleBulkDeleteImages,
        selectImage: handleSelectImage,
        updateFilters,
        setPrimaryImage
    };
};