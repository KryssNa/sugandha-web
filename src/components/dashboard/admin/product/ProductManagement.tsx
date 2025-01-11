"use client";
import { useModal } from '@/components/shared/customModal/customModal';
import { AppDispatch, RootState } from "@/store";
import { fetchProducts } from "@/store/slices/productSlice";
import { ChevronDown, ChevronUp, Edit, Eye, Filter, Package, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showProductDetailsModal } from './PrdocutDetails';

interface Category {
  id: string;
  name: string;
  _id?: string;
}

interface Product {
  slug: string;
  id: string;
  title: string;
  brand: string;
  originalPrice: number;
  thumbnail: string;
  category: Category[];
  subCategory?: Category[] | string[];
  inStock: boolean;
}

interface ProductFilters {
  page: number;
  limit: number;
  search?: string;
  category?: string;
}

export const ProductManagement: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { products, loading, metadata } = useSelector((state: RootState) => state.product);

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 10,
  });
  const modal = useModal();

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  const handleSort = (key: keyof Product) => {
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map(product => product.id!).filter(id => id !== undefined));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      // Dispatch delete action
    }
  };
  const router = useRouter();
  // Open Product Form Modal
  const openProductFormModal = (product?: Product) => {
    setSelectedProduct(product || null);
    router.push(`/admin/products/manage-product/${product?.slug}`);

  };

  const getSortIcon = (key: keyof Product) => {
    if (sortConfig?.key !== key) {
      return <ChevronDown className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc'
      ? <ChevronUp className="w-4 h-4 text-gray-900" />
      : <ChevronDown className="w-4 h-4 text-gray-900" />;
  };

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
            Manage your product catalog ({metadata?.total || 0} total products)
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

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow">
        {/* Table Controls */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg ${showFilters ? 'bg-gray-100' : ''}`}
            >
              <Filter className="w-5 h-5 text-gray-500" />
            </button>
            {selectedProducts.length > 0 && (
              <span className="text-sm text-gray-600">
                {selectedProducts.length} selected
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={filters.limit}
              onChange={(e) => setFilters(prev => ({ ...prev, limit: Number(e.target.value) }))}
              className="border border-gray-300 rounded-lg px-2 py-1"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="p-4 border-b border-gray-200 grid grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search products..."
              className="border border-gray-300 rounded-lg px-3 py-2"
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2"
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="">All Categories</option>
              {/* Add category options here */}
            </select>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Image
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Product Name</span>
                    {getSortIcon('title')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort('brand')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Brand</span>
                    {getSortIcon('brand')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort('originalPrice')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Price</span>
                    {getSortIcon('originalPrice')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stock Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts(prev => [...prev, product.id]);
                        } else {
                          setSelectedProducts(prev => prev.filter(id => id !== product.id));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                      <img
                        src={product.thumbnail || '/api/placeholder/48/48'}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">{product.title}</td>
                  <td className="px-6 py-4">{product.brand}</td>
                  <td className="px-6 py-4">₹{product.originalPrice}</td>
                  <td className="px-6 py-4">
                    {product.category?.[0]?.name || 'Uncategorized'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs 
                                            ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => showProductDetailsModal(product, modal)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => openProductFormModal(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 hover:bg-red-100 rounded text-red-600"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <span className="text-sm text-gray-700">
            Showing {((filters.page - 1) * filters.limit) + 1} to{' '}
            {Math.min(filters.page * filters.limit, metadata?.total || 0)} of{' '}
            {metadata?.total || 0} results
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={filters.page === 1}
              className="px-3 py-1 border rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-gray-100 rounded-lg">{filters.page}</span>
            <button
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={filters.page * filters.limit >= (metadata?.total || 0)}
              className="px-3 py-1 border rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;