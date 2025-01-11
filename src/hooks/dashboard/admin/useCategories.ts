// hooks/useCategories.ts
import { Category } from '@/components/shared/types/category.types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  setSelectedCategory,
  updateCategory
} from '@/store/slices/categorySlice';
import { useCallback, useState } from 'react';
import Swal from 'sweetalert2';

export const useCategories = () => {
  const dispatch = useAppDispatch();
  const {
    categories,
    selectedCategory,
    loading,
    error,
    total,
    filteredTotal
  } = useAppSelector(state => state.categories);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    status: '',
    parentId: ''
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

  const loadCategories = useCallback(async (params = filters) => {
    try {
      await dispatch(fetchCategories(params)).unwrap();
    } catch (error) {
      showToast('error', (error as any).message || 'Failed to load categories');
    }
  }, [dispatch, filters]);

  const toggleCategoryStatus = useCallback(async (id: string, status: 'active' | 'inactive') => {
    try {
      await dispatch(updateCategory({ id, data: { status } })).unwrap();
      showToast('success', `Category ${status === 'active' ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      showToast('error', (error as any).message || `Failed to ${status === 'active' ? 'activate' : 'deactivate'} category`);
      throw error;
    }
  }
    , [dispatch
    ]);

  const handleCreateCategory = useCallback(async (data: Partial<Category>) => {
    try {
      const result = await dispatch(createCategory(data)).unwrap();
      showToast('success', 'Category created successfully');
      return result.data;
    } catch (error) {
      showToast('error', (error as any).message || 'Failed to create category');
      throw error;
    }
  }, [dispatch]);

  const handleUpdateCategory = useCallback(async (id: string, data: Partial<Category>) => {
    try {
      const result = await dispatch(updateCategory({ id, data })).unwrap();
      showToast('success', 'Category updated successfully');
      return result.data;
    } catch (error) {
      showToast('error', (error as any).message || 'Failed to update category');
      throw error;
    }
  }, [dispatch]);

  const handleDeleteCategory = useCallback(async (id: string) => {
    // Confirmation dialog
    const result = await Swal.fire({
      title: 'Delete Category',
      text: 'Are you sure you want to delete this category?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteCategory(id)).unwrap();
        showToast('success', 'Category deleted successfully');
      } catch (error) {
        showToast('error', (error as any).message || 'Failed to delete category');
        throw error;
      }
    }
  }, [dispatch]);

  const expandedCategories = categories.reduce<string[]>((acc, category) => {
    if (category.children && category.children.length > 0) {
      acc.push(category.id);
      category.children.forEach(child => acc.push(child.id));
    }
    return acc;
  }, []);

  const isExpanded = (categoryId: string) => expandedCategories.includes(categoryId);

  const handleSelectCategory = useCallback((category: Category | null) => {
    dispatch(setSelectedCategory(category));
  }, [dispatch]);

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || (Object.keys(newFilters).length > 0 ? 1 : prev.page)
    }));
  }, []);

  const bulkDeleteCategories = useCallback(async (ids: string[]) => {
    const result = await Swal.fire({
      title: 'Delete Categories',
      text: `Are you sure you want to delete ${ids.length} categories?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete them!'
    });

    if (result.isConfirmed) {
      try {
        await Promise.all(ids.map(id => dispatch(deleteCategory(id)).unwrap()));
        showToast('success', `${ids.length} categories deleted successfully`);
      } catch (error) {
        showToast('error', (error as any).message || 'Failed to delete categories');
        throw error;
      }
    }
  }, [dispatch]);

  const reorderCategories = useCallback(async (newOrder: string[]) => {
    try {
      // Call API to reorder categories
      await fetch('/api/admin/categories/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder })
      });
      showToast('success', 'Categories reordered successfully');
    } catch (error) {
      showToast('error', (error as any).message || 'Failed to reorder categories');
      throw error;
    }
  }
    , []);

  return {
    // State
    categories,
    selectedCategory,
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
    loadCategories,
    createCategory: handleCreateCategory,
    updateCategory: handleUpdateCategory,
    deleteCategory: handleDeleteCategory,
    selectCategory: handleSelectCategory,
    updateFilters,
    bulkDeleteCategories,
    toggleCategory: toggleCategoryStatus,
    reorderCategories,
    checkExpandedCategories: isExpanded
  };
};