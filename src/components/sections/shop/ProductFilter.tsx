"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import RangeSlider from "./RangeSlider";
import { FilterAccordion, FilterCheckbox } from "./FilterAccordion";
import {
  setPriceRange,
  toggleBrand,
  toggleCategory,
  setSearch,
  setRating,
  setAvailability,
  resetFilters,
} from "@/store/slices/filterSlice";
import { ProductFilterProps } from "@/components/shared/types/filterTypes";

const ProductFilter: React.FC<ProductFilterProps> = ({
  products,
  onFilterChange,
  className = "",
}) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filter);

  // Calculate filter options from products
  const brands = [...new Set(products.map((p) => p.brand))].sort();
  const categories = [...new Set(products.map((p) => p.category))].sort();

  // Calculate counts
  const brandCounts = brands.reduce((acc, brand) => {
    acc[brand] = products.filter((p) => p.brand === brand).length;
    return acc;
  }, {} as Record<string, number>);

  const categoryCounts = categories.reduce((acc, category) => {
    acc[category[1]] = products.filter((p) => p.category === category).length; // category[1] is the category name
    return acc;
  }, {} as Record<string, number>);

  const ratingCounts = [4, 3, 2, 1].reduce((acc, rating) => {
    acc[rating] = products.filter((p) => p.rating.average >= rating).length;
    return acc;
  }, {} as Record<number, number>);

  const availabilityCounts = {
    inStock: products.filter((p) => p.inStock).length,
    outOfStock: products.filter((p) => !p.inStock).length,
  };

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(resetFilters())}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            Clear All
            <X className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            className="w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
              transition-shadow duration-200"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
      </div>

      {/* Filter Sections */}
      <div className="p-4 space-y-2">
        {/* Price Range Section */}
        <FilterAccordion
          title="Price Range"
          isOpen={true}
          onToggle={() => {}}
        >
          <RangeSlider
            range={{
              min: Math.min(...products.map((p) => p.basePrice)),
              max: Math.max(...products.map((p) => p.basePrice)),
              current: filters.priceRange.current,
            }}
            onChange={(values) => dispatch(setPriceRange(values))}
          />
        </FilterAccordion>

        {/* Brands Section */}
        <FilterAccordion
          title="Brands"
          isOpen={false}
          onToggle={() => {}}
          badge={filters.brands.length}
        >
          <div className="space-y-2 px-4">
            {brands.map((brand) => (
              <FilterCheckbox
                key={Math.random()}
                label={brand}
                checked={filters.brands.includes(brand)}
                onChange={() => dispatch(toggleBrand(brand))}
                count={brandCounts[brand]}
              />
            ))}
          </div>
        </FilterAccordion>

        {/* Categories Section */}
        <FilterAccordion
          title="Categories"
          isOpen={false}
          onToggle={() => {}}
          badge={filters.categories.length}
        >
          <div className="space-y-2 px-4">
            {categories.map((category) => (
              <FilterCheckbox
                key={Math.random()}
                label={category[1]}
                checked={filters.categories.includes(category[1])}
                onChange={() => dispatch(toggleCategory(category[1]))}
                count={categoryCounts[category[1]]}
              />
            ))}
          </div>
        </FilterAccordion>

        {/* Rating Section */}
        <FilterAccordion
          title="Rating"
          isOpen={false}
          onToggle={() => {}}
          badge={filters.rating ? 1 : undefined}
        >
          <div className="space-y-2 px-4">
            {[4, 3, 2, 1].map((rating) => (
              <div
                key={Math.random()}
                className="flex items-center justify-between cursor-pointer"
                onClick={() => dispatch(setRating(filters.rating === rating ? null : rating))}
              >
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <motion.svg
                        key={index}
                        className={`w-4 h-4 ${
                          index < rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                        fill="currentColor"
                        initial={false}
                        animate={index < rating ? { scale: 1.2 } : { scale: 1 }}
                        transition={{ duration: 0.2 }}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </motion.svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">& Up</span>
                </div>
                <span className="text-xs text-gray-500">({ratingCounts[rating]})</span>
              </div>
            ))}
          </div>
        </FilterAccordion>

        {/* Availability Section */}
        <FilterAccordion
          title="Availability"
          isOpen={false}
          onToggle={() => {}}
          badge={filters.availability !== "all" ? 1 : undefined}
        >
          <div className="space-y-2 px-4">
            <FilterCheckbox
              label="In Stock"
              checked={filters.availability === "inStock"}
              onChange={() => dispatch(setAvailability("inStock"))}
              count={availabilityCounts.inStock}
            />
            <FilterCheckbox
              label="Out of Stock"
              checked={filters.availability === "outOfStock"}
              onChange={() => dispatch(setAvailability("outOfStock"))}
              count={availabilityCounts.outOfStock}
            />
          </div>
        </FilterAccordion>
      </div>

      {/* Active Filters */}
      {(filters.brands.length > 0 ||
        filters.categories.length > 0 ||
        filters.rating ||
        filters.availability !== "all") && (
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Active Filters</h3>
          <div className="flex flex-wrap gap-2">
            {filters.brands.map((brand) => (
              <FilterTag
                key={Math.random()}
                label={brand}
                onRemove={() => dispatch(toggleBrand(brand))}
              />
            ))}
            {filters.categories.map((category) => (
              <FilterTag
                key={Math.random()}
                label={category}
                onRemove={() => dispatch(toggleCategory(category))}
              />
            ))}
            {filters.rating && (
              <FilterTag
                label={`${filters.rating}★ & Up`}
                onRemove={() => dispatch(setRating(null))}
              />
            )}
            {filters.availability !== "all" && (
              <FilterTag
                label={filters.availability === "inStock" ? "In Stock" : "Out of Stock"}
                onRemove={() => dispatch(setAvailability("all"))}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const FilterTag: React.FC<{ label: string; onRemove: () => void }> = ({
  label,
  onRemove,
}) => (
  <motion.span
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.8, opacity: 0 }}
    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
      bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
  >
    {label}
    <button
      onClick={onRemove}
      className="ml-1 hover:text-orange-900"
    >
      ×
    </button>
  </motion.span>
);

export default ProductFilter;