'use client';

import {
  Edit,
  Eye,
  Package,
  Plus,
  Trash2,
  XCircle
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { useModal } from '@/components/shared/customModal/customModal';
import { Column, Table, TableAction } from '@/components/shared/customTable/customTable';
import { Product } from '@/components/shared/types/product.types';
import { useProducts } from '@/hooks/dashboard/admin/product/useProducts';
// import useCategories from '@/hooks/dashboard/admin/useCategories';
import { RootState } from '@/store';
import { fetchProducts } from '@/store/slices/productSlice';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { showProductDetailsModal } from './PrdocutDetails';

import { AppDispatch } from '@/store';
const ProductManagement: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const modal = useModal();

  const dispatch: AppDispatch = useDispatch();

  const {
    // products,
    totalProducts,
    // loading,
    filters,
    actions: productActions
  } = useProducts();

  // Access Redux state for products, loading, filters, etc.
  const { products, loading, metadata } = useSelector(
    (state: RootState) => state.product
  );

  // Fetch products when component mounts or filters change
  useEffect(() => {
    dispatch(fetchProducts(filters));  // Dispatch the action to fetch products with filters
  }, [dispatch, filters]);

  // Open Product Form Modal
  const openProductFormModal = (product?: Product) => {
    setSelectedProduct(product || null);

  };

  // Prepare table columns
  const columns: Column<Product>[] = [
    {
      key: 'title',
      title: 'Product Name',
      sortable: true,
      filterable: true,
    },
    {
      key: 'brand',
      title: 'Brand',
      sortable: true,
      filterable: true,
    },
    {
      key: 'price',
      title: 'Price',
      sortable: true,
      render: (value) => `₹${value}`,
    },
    {
      key: 'category',
      title: 'Category',
      sortable: true,
      filterable: true,
    },
    {
      key: 'inStock',
      title: 'Stock',
      sortable: true,
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
        >
          {value ? 'In Stock' : 'Out of Stock'}
        </span>
      ),
    },
  ];

  // Prepare table actions
  const tableActions: TableAction<Product>[] = [
    {
      icon: <Eye className="w-4 h-4" />,
      label: 'View Details',
      onClick: (product) => showProductDetailsModal(product, modal),
    },
    {
      icon: <Edit className="w-4 h-4" />,
      label: 'Edit',
      onClick: (product) => openProductFormModal(product),
    },
    {
      icon: <Trash2 className="w-4 h-4 text-red-600" />,
      label: 'Delete',
      onClick: (product) => {
        modal.showModal({
          title: 'Delete Product',
          content: (
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <XCircle className="w-16 h-16 text-red-500" />
              </div>
              <p>Are you sure you want to delete this product?</p>
              <p className="text-sm text-gray-500">
                This action cannot be undone and will permanently remove the product.
              </p>
            </div>
          ),
          footerButtons: (
            <>
              <button
                onClick={() => modal.hideModal()}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (product.id) {
                    productActions.deleteProduct(product.id);
                  }
                  modal.hideModal();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </>
          ),
        });
      },
      className: 'text-red-600 hover:bg-red-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-orange-500" />
            Product Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your product catalog ({totalProducts} total products)
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/products/manage-product"
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg 
            hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Product Table */}
      <Table
        data={products || []}
        columns={columns}
        actions={tableActions}
        isLoading={loading}
        selectable
        pagination={{
          currentPage: filters.page || 1,
          totalItems: totalProducts,
          pageSize: filters.limit || 10,
          onPageChange: (page) => productActions.updateFilters({ page }),
          onPageSizeChange: (pageSize) => productActions.updateFilters({ limit: pageSize }),
        }}
        onRowClick={(product) => showProductDetailsModal(product, modal)}
      />
    </div>
  );
};

export default ProductManagement;