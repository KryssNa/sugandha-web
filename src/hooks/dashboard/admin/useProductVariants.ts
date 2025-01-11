// hooks/useVariants.ts
import { IVariant } from '@/components/shared/types/productTypes';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  bulkUpdateVariantStock,
  createVariant,
  deleteVariant,
  fetchVariants,
  reorderVariants,
  setSelectedVariant,
  updateVariant,
  updateVariantStock
} from '@/store/slices/variantSlice';
import { useCallback, useState } from 'react';
import Swal from 'sweetalert2';

export const useVariants = (productId: string) => {
  const dispatch = useAppDispatch();
  const {
    variants,
    selectedVariant,
    loading,
    error,
    total,
    filteredTotal
  } = useAppSelector(state => state.variants);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: ''
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

  // Validation function
  const validateVariant = (variant: Partial<IVariant>): string[] => {
    const errors: string[] = [];

    if (!variant.size || variant.size <= 0) {
      errors.push('Size must be greater than 0');
    }

    if (!variant.sku) {
      errors.push('SKU is required');
    }

    if (!variant.price || variant.price <= 0) {
      errors.push('Price must be greater than 0');
    }

    if (!variant.originalPrice || variant.originalPrice <= 0) {
      errors.push('Original price must be greater than 0');
    }

    if (variant.originalPrice! < variant.price!) {
      errors.push('Original price cannot be less than sale price');
    }

    return errors;
  };

  // Load Variants
  const loadVariants = useCallback(async (params = filters) => {
    try {
      await dispatch(fetchVariants({ productId, ...params })).unwrap();
    } catch (error) {
      showToast('error', (error as any).message || 'Failed to load variants');
    }
  }, [dispatch, productId, filters]);

  // Create Variant
  const handleCreateVariant = useCallback(async (variantData: Partial<IVariant>) => {
    const validationErrors = validateVariant(variantData);

    if (validationErrors.length > 0) {
      validationErrors.forEach(error => showToast('error', error));
      throw new Error('Validation failed');
    }

    try {
      const result = await dispatch(createVariant({ productId, variantData })).unwrap();
      showToast('success', 'Variant created successfully');
      return result.data;
    } catch (error) {
      showToast('error', (error as any).message || 'Failed to create variant');
      throw error;
    }
  }, [dispatch, productId]);

  // Update Variant
  const handleUpdateVariant = useCallback(async (sku: string, variantData: Partial<IVariant>) => {
    const validationErrors = validateVariant(variantData);

    if (validationErrors.length > 0) {
      validationErrors.forEach(error => showToast('error', error));
      throw new Error('Validation failed');
    }

    try {
      const result = await dispatch(updateVariant({ productId, sku, variantData })).unwrap();
      showToast('success', 'Variant updated successfully');
      return result.data;
    } catch (error) {
      showToast('error', (error as any).message || 'Failed to update variant');
      throw error;
    }
  }, [dispatch, productId]);

  // Delete Variant
  const handleDeleteVariant = useCallback(async (sku: string) => {
    const result = await Swal.fire({
      title: 'Delete Variant',
      text: 'Are you sure you want to delete this variant?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteVariant({ productId, sku })).unwrap();
        showToast('success', 'Variant deleted successfully');
      } catch (error) {
        showToast('error', (error as any).message || 'Failed to delete variant');
        throw error;
      }
    }
  }, [dispatch, productId]);

  // Update Stock
  const handleUpdateStock = useCallback(async (sku: string, quantity: number) => {
    try {
      const result = await dispatch(updateVariantStock({ productId, sku, quantity })).unwrap();
      showToast('success', 'Stock updated successfully');
      return result.data;
    } catch (error) {
      showToast('error', (error as any).message || 'Failed to update stock');
      throw error;
    }
  }, [dispatch, productId]);

  // Bulk Stock Update
  const handleBulkStockUpdate = useCallback(async (updates: Array<{ sku: string; quantity: number }>) => {
    try {
      const result = await dispatch(bulkUpdateVariantStock({ productId, updates })).unwrap();
      showToast('success', 'Stock updated successfully');
      return result.data;
    } catch (error) {
      showToast('error', (error as any).message || 'Failed to update stock');
      throw error;
    }
  }, [dispatch, productId]);

  // Reorder Variants
  const handleReorderVariants = useCallback(async (order: string[]) => {
    try {
      await dispatch(reorderVariants({ productId, order })).unwrap();
      showToast('success', 'Variants reordered successfully');
    } catch (error) {
      showToast('error', (error as any).message || 'Failed to reorder variants');
      throw error;
    }
  }, [dispatch, productId]);

  // Select Variant
  const handleSelectVariant = useCallback((variant: IVariant | null) => {
    dispatch(setSelectedVariant(variant));
  }, [dispatch]);

  // Update Filters
  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || (Object.keys(newFilters).length > 0 ? 1 : prev.page)
    }));
  }, []);

  return {
    // State
    variants,
    selectedVariant,
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
    loadVariants,
    createVariant: handleCreateVariant,
    updateVariant: handleUpdateVariant,
    deleteVariant: handleDeleteVariant,
    updateStock: handleUpdateStock,
    bulkUpdateStock: handleBulkStockUpdate,
    reorderVariants: handleReorderVariants,
    selectVariant: handleSelectVariant,
    updateFilters,
    validateVariant
  };
};