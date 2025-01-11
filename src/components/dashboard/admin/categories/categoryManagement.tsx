// components/admin/categories/CategoriesManagement.tsx
"use client"
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  Edit2,
  FolderTree,
  Trash2
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Category, CategoryFormData } from '@/components/shared/types/category.types';
import { useCategories } from '@/hooks/dashboard/admin/useCategories';
import { useAppDispatch } from '@/store/hooks';
import Swal from 'sweetalert2';
import CategoryFormModal from './categoryFormModal';
import CategoriesList from './CategoryList';

const CategoriesManagement = () => {
  // Custom hook for category management
  const dispatch = useAppDispatch();
  const {
    categories,
    selectedCategory,
    // expandedCategories,
    loading,
    error,
    filters,
    metadata,

    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    selectCategory,
    toggleCategory,
    checkExpandedCategories,
    updateFilters,

  } = useCategories();

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Handler for category form submission
  const handleSubmitCategory = async (data: CategoryFormData) => {
    try {
      if (selectedCategory) {
        const updatedData = {
          ...data,
          image: data.image ? { url: URL.createObjectURL(data.image), alt: data.image.name } : undefined,
        };
        await updateCategory(selectedCategory.id, updatedData);
        Swal.fire({
          icon: 'success',
          title: 'Category Updated',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      } else {
        const newData = {
          ...data,
          image: data.image ? { url: URL.createObjectURL(data.image), alt: data.image.name } : undefined,
        };
        await createCategory(newData);
        Swal.fire({
          icon: 'success',
          title: 'Category Created',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Operation Failed',
        text: 'Failed to save category. Please try again.',
      });
    }
  };

  // Handler for category deletion
  const handleDeleteCategory = async (id: string) => {
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
        await deleteCategory(id);
        await loadCategories();
        Swal.fire({
          icon: 'success',
          title: 'Category Deleted',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: 'Failed to delete category. Please try again.',
        });
      }
    }
  };

  // Search handler
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    updateFilters({ search: term, page: 1 });
  }, [updateFilters]);

  // Modal handlers
  const handleAddCategory = useCallback(() => {
    selectCategory(null);
    setIsModalOpen(true);
  }, [selectCategory]);

  const handleEditCategory = useCallback((category: Category) => {
    selectCategory(category);
    setIsModalOpen(true);
  }, [selectCategory]);

  // Tree rendering function
  const renderCategoryTree = useCallback((category: Category, depth = 0) => {
    const isExpanded = checkExpandedCategories(category.id);
    const isSelected = selectedCategory?.id === category.id;

    return (
      <motion.div
        key={category.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        layout
      >
        <div
          className={`flex items-center py-2 px-4 hover:bg-gray-50 cursor-pointer
            ${isSelected ? 'bg-orange-50' : ''}`}
          style={{ paddingLeft: `${depth * 24 + 16}px` }}
          onClick={() => selectCategory(category)}
        >
          {/* Tree node controls */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCategory(category.id, category.status || 'active');
            }}
            className="p-1 hover:bg-gray-100 rounded-full mr-2"
          >
            {category.children?.length ? (
              isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )
            ) : (
              <div className="w-4" />
            )}
          </button>

          {/* Category information */}
          <div className="flex-1 flex items-center">
            <FolderTree className={`w-5 h-5 mr-2 ${isSelected ? 'text-orange-500' : 'text-gray-400'}`} />
            <div>
              <span className="font-medium text-gray-900">{category.name}</span>
              <span className="ml-2 text-sm text-gray-500">({category.productCount})</span>
            </div>
          </div>

          {/* Category actions */}
          <div className="flex items-center gap-2">
            {category.status === 'inactive' && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                Inactive
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditCategory(category);
              }}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
              title='Edit Category'
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCategory(category.id);
              }}
              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
              title='Delete Category'
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Render children */}
        {isExpanded && category.children && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {category.children.map(child => renderCategoryTree(child, depth + 1))}
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    );
  }, [selectedCategory, selectCategory, toggleCategory, handleEditCategory, handleDeleteCategory]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage your product categories and subcategories
            </p>
          </div>

        </div>
      </div>

      {/* Category tree section */}
      <div className="divide-y divide-gray-100 p-4">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 
              border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading categories...</p>
          </div>
        ) : (
          <CategoriesList
            categories={categories}
            onAddCategory={handleAddCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
            onToggleStatus={toggleCategory}
          />
        )}
      </div>

      {/* Category form modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        category={selectedCategory ?? undefined}
        categories={categories}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitCategory}
      />
    </div>
  );
};

export default CategoriesManagement;