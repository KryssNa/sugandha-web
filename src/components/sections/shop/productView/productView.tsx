"use client";

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpDown,
  Filter,
  Grid,
  List,
  Search,
  X
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import ProductCard from "@/components/shared/cards/productCard";
// import EnhancedProductFilter from "@/components/shared/filters/EnhancedProductFilter";
import { showToast } from '@/components/shared/toast/showAlet';
import { Product } from "@/components/shared/types/product.types";
import { RootState } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addItemToCart
} from "@/store/slices/cartSlice";
import {
  resetFilters,
  setAvailability,
  setPriceRange,
  setSearch,
  setSortBy,
  toggleBrand,
  toggleCategory,
  toggleRating
} from "@/store/slices/filterSlice";
import {
  fetchProducts
} from "@/store/slices/productSlice";
import {
  addToWishlist,
  removeFromWishlist
} from "@/store/slices/wishlistSlice";
import { useRouter } from 'next/navigation';
import ProductQuickView from '../../product/quickview/ProductQuickView';
import EnhancedProductFilter from '../ProductFilter';

export const ProductView: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filter);
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Access Redux state for products, loading, filters, etc.
  const { products, loading, metadata } = useSelector(
    (state: RootState) => state.product
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setSelectedProduct(null);
  };

  const wishlistItems = useAppSelector((state: RootState) => state.wishlist.items);

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Price range check
      const priceInRange =
        product.basePrice >= filters.priceRange.current[0] &&
        product.basePrice <= filters.priceRange.current[1];

      // Brands check
      const brandMatch =
        filters.brands.length === 0 ||
        filters.brands.includes(product.brand);

      // Categories check
      const categoryMatch =
        filters.categories.length === 0 ||
        product.category.some(cat => filters.categories.includes(cat.name));

      // Ratings check
      const ratingMatch =
        filters.ratings.length === 0 ||
        filters.ratings.some(r => (product.rating?.average ?? 0) >= r);

      // Availability check
      const availabilityMatch =
        filters.availability === 'all' ||
        (filters.availability === 'inStock' && product.inStock) ||
        (filters.availability === 'outOfStock' && !product.inStock);

      // Search check
      const searchMatch =
        filters.search === '' ||
        product.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.brand.toLowerCase().includes(filters.search.toLowerCase());

      return priceInRange &&
        brandMatch &&
        categoryMatch &&
        ratingMatch &&
        availabilityMatch &&
        searchMatch;
    });
  }, [products, filters]);

  // Fetch products when component mounts or filters change
  useEffect(() => {
    const productFilters = {
      ...filters,
      priceRange: filters.priceRange.current as [number, number]
    };
    dispatch(fetchProducts(productFilters));
  }, [dispatch, filters]);

  // Cart and Wishlist Handlers
  const handleAddToCart = ({ product }: { product: Product }) => {
    showToast("success", "Item added to cart");
    dispatch(addItemToCart({
      product: product,
      productId: product.id as string,
      quantity: 1
    }));
  };

  const router = useRouter();

  const handleBuyNow = async ({ product }: { product: Product }) => {
    // redirect to checkout page with product details
    await dispatch(addItemToCart({
      product: product,
      productId: product.id as string,
      quantity: 1
    }));
    // Save cart state to local storage or backend here if needed
    router.push('/checkout');
  }


  const checkWishlist = (product: Product) => {
    return wishlistItems.some(item => item.id === product.id);
  };

  const handleToggleWishlist = ({ product }: { product: Product }) => {
    const isInWishlist = wishlistItems.some(item => item.id === product.id);
    if (isInWishlist) {
      if (product.id) {
        showToast("success", "Item removed from wishlist");
        dispatch(removeFromWishlist(product.id));
      }
    } else {
      showToast("success", "Item added to wishlist");
      dispatch(addToWishlist(product));
    }
  };

  // Filter Handlers for EnhancedProductFilter
  const filterHandlers = {
    setPriceRange: (range: [number, number]) =>
      dispatch(setPriceRange(range)),
    toggleBrand: (brand: string) =>
      dispatch(toggleBrand(brand)),
    toggleCategory: (category: string) =>
      dispatch(toggleCategory(category)),
    toggleRating: (rating: number) =>
      dispatch(toggleRating(rating)),
    setAvailability: (availability: 'all' | 'inStock' | 'outOfStock') =>
      dispatch(setAvailability(availability)),
    setSearch: (search: string) =>
      dispatch(setSearch(search)),
    setSortBy: (sortBy: 'popular' | 'priceAsc' | 'priceDesc') =>
      dispatch(setSortBy(sortBy)),
    resetFilters: () =>
      dispatch(resetFilters())
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg mb-6">
          <p className="text-sm font-medium text-center">
            Special Offer: Free shipping on orders over Rs15000!
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
                  <EnhancedProductFilter
                    products={products}
                    filters={filters}
                    onFilterChange={filterHandlers}
                    className="sticky top-24"
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
                {/* Left Side Controls */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsFilterVisible(!isFilterVisible)}
                    className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 
                      hover:bg-gray-200 rounded-lg text-sm transition-all duration-200"
                  >
                    {isFilterVisible ? <X size={18} /> : <Filter size={18} />}
                    <span>{isFilterVisible ? "Hide" : "Show"} Filters</span>
                  </button>

                  {/* View Mode Toggles */}
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
                      <List size={18} />
                    </button>
                  </div>
                </div>

                {/* Right Side Controls */}
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-medium">{filteredProducts.length}</span> products
                  </p>

                  {/* Sort Dropdown */}
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
                      discount={product.discountPercentage}
                      secondaryImage={product.coverImage}
                      rating={product.rating?.average ?? 0}
                      primaryImage={product.images.find(image => image.isPrimary)?.url || ''}
                      viewMode={viewMode}
                      onAddToWishlist={() => handleToggleWishlist({ product })}
                      onQuickView={() => handleQuickView(product)}
                      onAddToCart={() => handleAddToCart({ product })}
                      buyNow={() => handleBuyNow({ product })}
                      checkWishlist={checkWishlist(product)}
                    />
                  </motion.div>
                ))}
                {selectedProduct && (
                  <ProductQuickView
                    product={selectedProduct}
                    isOpen={isQuickViewOpen}
                    onClose={handleCloseQuickView}
                    onAddToCart={(product, quantity, size) => {
                      dispatch(addItemToCart({
                        product,
                        quantity,

                      }));
                      handleCloseQuickView();
                    }}
                  />
                )}
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