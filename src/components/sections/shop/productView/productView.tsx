"use client";

import ProductCard from "@/components/shared/cards/productCard";
import ProductFilter from "@/components/shared/filter/filter";
import { FilterState } from "@/components/shared/types/filterTypes";
import { Product } from "@/components/shared/types/productTypes";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";

export const ProductView: React.FC = () => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [sortBy, setSortBy] = useState<"popular" | "priceAsc" | "priceDesc">(
    "popular"
  );

  // Sample products data
  const dummyProducts: Product[] = Array(12)
    .fill(null)
    .map((_, index) => ({
      id: index % 3 === 0? "creed-aventus-edp-100ml" : index % 3 === 1 ? "emporio-armani-stronger-with-you" : "tom-ford-oud-wood",
      slug: "creed-aventus-edp-100ml",
      primaryImage: "/assets/images/products/armani.png",
      secondaryImage: "/assets/images/products/image3.png",
      title:
        index % 3 === 0
          ? "Creed Aventus EDP 100ml"
          : index % 3 === 1
          ? "Emporio Armani Stronger With You"
          : "Tom Ford Oud Wood",
      price: 12500 + index * 1000,
      originalPrice: 15000 + index * 1000,
      discount: 29,
      rating: 4.8 - (index % 3) * 0.5,
      reviews: 12000 - index * 1000,
      isHot: index < 3,
      brand:
        index % 3 === 0
          ? "Creed"
          : index % 3 === 1
          ? "Emporio Armani"
          : "Tom Ford",
      category: index % 2 === 0 ? "EDP" : "EDT",
      inStock: index < 10,
    }));

  const handleFilterChange = useCallback(
    (filters: FilterState) => {
      let filtered = [...dummyProducts];

      if (filters.priceRange) {
        filtered = filtered.filter(
          (product) =>
            product.price >= filters.priceRange[0] &&
            product.price <= filters.priceRange[1]
        );
      }

      if (filters.brands.length > 0) {
        filtered = filtered.filter((product) =>
          filters.brands.includes(product.brand)
        );
      }

      if (filters.categories.length > 0) {
        filtered = filtered.filter((product) =>
          filters.categories.includes(product.category)
        );
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(
          (product) =>
            product.title.toLowerCase().includes(searchLower) ||
            product.brand.toLowerCase().includes(searchLower)
        );
      }

      if (filters.rating) {
        filtered = filtered.filter(
          (product) => product.rating >= filters.rating!
        );
      }

      if (filters.availability && filters.availability !== "all") {
        filtered = filtered.filter((product) =>
          filters.availability === "inStock"
            ? product.inStock
            : !product.inStock
        );
      }

      filtered.sort((a, b) => {
        switch (sortBy) {
          case "priceAsc":
            return a.price - b.price;
          case "priceDesc":
            return b.price - a.price;
          case "popular":
          default:
            return b.reviews - a.reviews;
        }
      });

      setFilteredProducts(filtered);
    },
    [sortBy]
  );

  useEffect(() => {
    const initialProducts = [...dummyProducts].sort((a, b) => {
      switch (sortBy) {
        case "priceAsc":
          return a.price - b.price;
        case "priceDesc":
          return b.price - a.price;
        case "popular":
        default:
          return b.reviews - a.reviews;
      }
    });
    setFilteredProducts(initialProducts);
  }, [sortBy]);

  return (
    <div className='px-4 md:px-12 xl:px-24 py-6 md:py-16 space-y-6 bg-white'>
      <div className='flex flex-col md:flex-row gap-8'>
        {/* Filter Section */}
        <aside className='md:sticky md:top-24 h-fit'>
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
              >
                <ProductFilter
                  products={dummyProducts}
                  onFilterChange={handleFilterChange}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </aside>

        {/* Products Section */}
        <div className='flex-1'>
          {/* Header */}
          <div className='mb-6 flex flex-wrap justify-between items-center gap-4'>
            <button
              onClick={() => setIsFilterVisible(!isFilterVisible)}
              className='md:hidden px-4 py-2 bg-gray-100 hover:bg-gray-200 
                rounded-lg text-sm transition-colors duration-200'
            >
              {isFilterVisible ? "Hide Filters" : "Show Filters"}
            </button>

            <div className='flex items-center gap-4'>
              <p className='text-gray-600'>
                Showing {filteredProducts.length} products
              </p>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className='px-3 py-2 border border-gray-200 rounded-lg text-sm
                  focus:outline-none focus:ring-2 focus:ring-orange-500'
                  title="sort by"
              >
                <option value='popular'>Popular</option>
                <option value='priceAsc'>Price: Low to High</option>
                <option value='priceDesc'>Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Products Grid with Fixed Animation */}
          <motion.div
            layout
            className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6'
          >
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
                className='h-full'
              >
                <ProductCard
                  {...product}
                  onAddToWishlist={() =>
                    console.log("Added to wishlist:", product.id)
                  }
                  onQuickView={() =>
                    console.log("Quick view opened:", product.id)
                  }
                  onCompare={() => console.log("Added to compare:", product.id)}
                  onAddToCart={() => console.log("Added to cart:", product.id)}
                  className='max-h-[480px] transition-transform duration-300 hover:scale-105'
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State - Separate AnimatePresence */}
          <AnimatePresence>
            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className='text-center py-12'
              >
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  No products found
                </h3>
                <p className='text-gray-600'>
                  Try adjusting your filters or search criteria
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
