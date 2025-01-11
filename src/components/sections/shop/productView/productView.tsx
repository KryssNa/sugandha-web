"use client";

import ProductCard from "@/components/shared/cards/productCard";
import { RootState } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetFilters, setFilters, setSortBy } from "@/store/slices/filterSlice";
import { fetchProducts } from "@/store/slices/productSlice";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpDown,
  Filter,
  Grid,
  List,
  Search,
  X
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import ProductFilter from "../ProductFilter";

export const ProductView: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filter);
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Access Redux state for products, loading, filters, etc.
  const { products, loading, metadata } = useSelector(
    (state: RootState) => state.product
  );


  // Fetch products when component mounts or filters change
  useEffect(() => {
    dispatch(fetchProducts(filters));  // Dispatch the action to fetch products with filters
  }, [dispatch, filters]);

  // Memoize filtered products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply filters
    if (filters.priceRange) {
      result = result.filter(
        (product) =>
          product.basePrice >= filters.priceRange.current[0] &&
          product.basePrice <= filters.priceRange.current[1]
      );
    }

    if (filters.brands.length > 0) {
      result = result.filter((product) =>
        filters.brands.includes(product.brand)
      );
    }

    if (filters.categories.length > 0) {
      result = result.filter((product) =>
        product.category.some(cat => filters.categories.includes(cat))
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(searchLower) ||
          product.brand.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.rating) {
      result = result.filter(
        (product) => product.rating.average >= filters.rating!
      );
    }

    if (filters.availability !== "all") {
      result = result.filter((product) =>
        filters.availability === "inStock"
          ? product.inStock
          : !product.inStock
      );
    }

    // Sort Products
    return result.sort((a, b) => {
      switch (filters.sortBy) {
        case "priceAsc":
          return a.basePrice - b.basePrice;
        case "priceDesc":
          return b.basePrice - a.basePrice;
        case "popular":
        default:
          return b.rating.count - a.rating.count;
      }
    });
  }, [filters, products]);

  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    dispatch(setFilters(newFilters));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Banner - Optional */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg mb-6">
          <p className="text-sm font-medium text-center">
            Special Offer: Free shipping on orders over $150!
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter Section */}
          <aside className="md:w-1/4 lg:w-1/5">
            <AnimatePresence>
              {isFilterVisible && (
                <motion.div
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                  }}
                  className="sticky top-24"
                >
                  <ProductFilter
                    products={products}
                    onFilterChange={handleFilterChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Header Controls */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Left Side */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsFilterVisible(!isFilterVisible)}
                    className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 
                      hover:bg-gray-200 rounded-lg text-sm transition-all duration-200"
                  >
                    {isFilterVisible ? <X size={18} /> : <Filter size={18} />}
                    <span>{isFilterVisible ? "Hide" : "Show"} Filters</span>
                  </button>

                  <div className="hidden md:flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-all duration-200 
                        ${viewMode === 'grid'
                          ? 'bg-orange-100 text-orange-600'
                          : 'hover:bg-gray-100'}`}
                      title="Grid View"
                    >
                      <Grid size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-all duration-200 
                        ${viewMode === 'list'
                          ? 'bg-orange-100 text-orange-600'
                          : 'hover:bg-gray-100'}`}
                      title="List View"
                    >
                      <List size={10} />
                    </button>
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-medium">{filteredProducts.length}</span> products
                  </p>

                  <div className="relative">
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        dispatch(setSortBy(e.target.value as typeof filters.sortBy))
                      }
                      className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm
                        appearance-none bg-transparent focus:outline-none focus:ring-2 
                        focus:ring-orange-500 cursor-pointer"
                      title="sort by"
                    >
                      <option value="popular">Most Popular</option>
                      <option value="priceAsc">Price: Low to High</option>
                      <option value="priceDesc">Price: High to Low</option>
                    </select>
                    <ArrowUpDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            <div className={viewMode === 'grid'
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
              : "flex flex-col gap-6"
            }>
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      opacity: { duration: 0.2 },
                      scale: { duration: 0.3 },
                      layout: { duration: 0.3 },
                    }}
                  >
                    <ProductCard
                      slug={product.slug}
                      title={product.title}
                      price={product.basePrice}
                      discount={product.discount}
                      rating={product.rating.average}
                      primaryImage={product.images.find(image => image.isPrimary)?.url || ''}
                      viewMode={viewMode}
                      onAddToWishlist={() => console.log("Added to wishlist:", product.id)}
                      onQuickView={() => console.log("Quick view opened:", product.id)}
                      onAddToCart={() => console.log("Added to cart:", product.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Empty State */}
            <AnimatePresence>
              {filteredProducts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-lg shadow-sm p-12 text-center"
                >
                  <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or search criteria
                  </p>
                  <button
                    onClick={() => dispatch(resetFilters())}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 
                      transition-colors duration-200"
                  >
                    Clear All Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductView;