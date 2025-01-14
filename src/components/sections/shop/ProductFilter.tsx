"use client";

import { FilterChangeHandlers } from '@/components/shared/types/filterTypes';
import { Product } from '@/components/shared/types/product.types';
import { FilterState } from '@/store/slices/filterSlice';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  ChevronDown,
  Filter,
  Search,
  Star,
  X
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

// Enhanced Filter Component
const EnhancedProductFilter: React.FC<{
  products: Product[];
  filters: FilterState;
  onFilterChange: FilterChangeHandlers;
  className?: string;
}> = ({
  products,
  filters,
  onFilterChange,
  className = ''
}) => {
    // State for section collapse
    const [collapsedSections, setCollapsedSections] = useState<{
      [key: string]: boolean
    }>({
      priceRange: false,
      brands: true,
      categories: true,
      ratings: true,
      availability: true
    });

    // Toggle section collapse
    const toggleSection = (section: string) => {
      setCollapsedSections(prev => ({
        ...prev,
        [section]: !prev[section]
      }));
    };

    // Derive filter options from products
    const filterOptions = useMemo(() => {
      return {
        brands: Array.from(new Set(products.map(p => p.brand))).sort(),
        categories: Array.from(new Set(products.flatMap(p => p.category.map(c => c.name)))).sort(),
        priceRange: {
          min: Math.floor(Math.min(...products.map(p => p.basePrice))),
          max: Math.ceil(Math.max(...products.map(p => p.basePrice)))
        },
        availability: {
          inStock: products.filter(p => p.inStock).length,
          outOfStock: products.filter(p => !p.inStock).length
        },
        ratings: [4, 3, 2, 1].map(rating => ({
          rating,
          count: products.filter(p => (p.rating?.average ?? 0) >= rating).length
        })),
        sortBy: ['popular', 'priceAsc', 'priceDesc']
      };
    }, [products]);

    // Calculate active filters count
    const activeFiltersCount = useMemo(() => {
      return (
        filters.brands.length +
        filters.categories.length +
        filters.ratings.length +
        (filters.availability !== 'all' ? 1 : 0) +
        (filters.search ? 1 : 0)
      );
    }, [filters]);

    return (
      <div
        className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Product Filters</h2>
            {activeFiltersCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full"
              >
                {activeFiltersCount}
              </motion.span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onFilterChange.resetFilters}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                Reset
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => onFilterChange.setSearch(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            {filters.search && (
              <button
                onClick={() => onFilterChange.setSearch('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 
                text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filters Container */}
        <div className="divide-y divide-gray-200">
          {/* Price Range Filter */}
          <FilterSection
            title="Price Range"
            isCollapsed={collapsedSections.priceRange}
            onToggle={() => toggleSection('priceRange')}
          >
            <div className="px-4 py-2">
              <RangeSlider
                min={filterOptions.priceRange.min}
                max={filterOptions.priceRange.max}
                value={filters.priceRange.current}
                onChange={(range) => onFilterChange.setPriceRange(range)}
              />
            </div>
          </FilterSection>

          {/* Brands Filter */}
          <FilterSection
            title="Brands"
            isCollapsed={collapsedSections.brands}
            onToggle={() => toggleSection('brands')}
            badge={filters.brands.length}
          >
            <div className="space-y-2 px-4 py-2 max-h-48 overflow-y-auto scrollbar-thin">
              {filterOptions.brands.map((brand) => (
                <MultiSelectOption
                  key={brand}
                  label={brand}
                  selected={filters.brands.includes(brand)}
                  onToggle={() => onFilterChange.toggleBrand(brand)}
                  count={products.filter(p => p.brand === brand).length}
                />
              ))}
            </div>
          </FilterSection>

          {/* Categories Filter */}
          <FilterSection
            title="Categories"
            isCollapsed={collapsedSections.categories}
            onToggle={() => toggleSection('categories')}
            badge={filters.categories.length}
          >
            <div className="space-y-2 px-4 py-2 max-h-48 overflow-y-auto scrollbar-thin">
              {filterOptions.categories.map((category) => (
                <MultiSelectOption
                  key={category}
                  label={category}
                  selected={filters.categories.includes(category)}
                  onToggle={() => onFilterChange.toggleCategory(category)}
                  count={products.filter(p => p.category.some(c => c.name === category)).length}
                />
              ))}
            </div>
          </FilterSection>

          {/* Ratings Filter */}
          <FilterSection
            title="Ratings"
            isCollapsed={collapsedSections.ratings}
            onToggle={() => toggleSection('ratings')}
            badge={filters.ratings.length}
          >
            <div className="space-y-2 px-4 py-2">
              {filterOptions.ratings.map(({ rating, count }) => (
                <MultiSelectOption
                  key={rating}
                  label={`${rating}★ & Up`}
                  selected={filters.ratings.includes(rating)}
                  onToggle={() => onFilterChange.toggleRating(rating)}
                  count={count}
                  icon={
                    <div className="flex">
                      {[...Array(rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current"
                        />
                      ))}
                      {[...Array(5 - rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-gray-300"
                        />
                      ))}
                    </div>
                  }
                />
              ))}
            </div>
          </FilterSection>

          {/* Availability Filter */}
          <FilterSection
            title="Availability"
            isCollapsed={collapsedSections.availability}
            onToggle={() => toggleSection('availability')}
          >
            <div className="space-y-2 px-4 py-2">
              {(['all', 'inStock', 'outOfStock'] as const).map((status) => (
                <RadioOption
                  key={status}
                  label={
                    status === 'all'
                      ? 'All Products'
                      : status === 'inStock'
                        ? `In Stock (${filterOptions.availability.inStock})`
                        : `Out of Stock (${filterOptions.availability.outOfStock})`
                  }
                  selected={filters.availability === status}
                  onSelect={() => onFilterChange.setAvailability(status)}
                />
              ))}
            </div>
          </FilterSection>
        </div>
      </div>
    );
  };

// Enhanced Filter Section Component
const FilterSection: React.FC<{
  title: string;
  children: React.ReactNode;
  isCollapsed: boolean;
  onToggle: () => void;
  badge?: number;
}> = ({ title, children, isCollapsed, onToggle, badge }) => {
  return (
    <div className="group">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between 
          hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-900 group-hover:text-orange-600">
            {title}
          </span>
          {badge !== undefined && badge > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 
              text-orange-600 rounded-full min-w-[20px] text-center">
              {badge}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isCollapsed ? 0 : 180 }}
          transition={{ duration: 0.2 }}
          className="text-gray-500 group-hover:text-orange-600"
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// MultiSelectOption Component
const MultiSelectOption: React.FC<{
  label: string;
  selected: boolean;
  onToggle: () => void;
  count?: number;
  icon?: React.ReactNode;
}> = ({ label, selected, onToggle, count, icon }) => (
  <motion.div
    whileTap={{ scale: 0.98 }}
    onClick={onToggle}
    className="flex items-center justify-between py-2 px-2 hover:bg-gray-50 
      rounded-lg cursor-pointer group"
  >
    <div className="flex items-center space-x-3">
      <motion.div
        animate={{
          backgroundColor: selected ? 'rgb(249, 115, 22)' : 'transparent',
          borderColor: selected ? 'rgb(249, 115, 22)' : 'rgb(209, 213, 219)'
        }}
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center
          transition-colors`}
      >
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <Check className="w-4 h-4 text-white" />
          </motion.div>
        )}
      </motion.div>
      {icon || <span className="text-sm text-gray-700">{label}</span>}
    </div>
    {count !== undefined && (
      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full 
        group-hover:bg-gray-200 transition-colors">
        {count}
      </span>
    )}
  </motion.div>
);

// RadioOption Component
const RadioOption: React.FC<{
  label: string;
  selected: boolean;
  onSelect: () => void;
}> = ({ label, selected, onSelect }) => (
  <motion.div
    whileTap={{ scale: 0.98 }}
    onClick={onSelect}
    className="flex items-center justify-between py-2 px-2 hover:bg-gray-50 
      rounded-lg cursor-pointer group"
  >
    <div className="flex items-center space-x-3">
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
          transition-colors ${selected
            ? 'border-orange-500'
            : 'border-gray-300 group-hover:border-orange-300'
          }`}
      >
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-3 h-3 rounded-full bg-orange-500"
          />
        )}
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  </motion.div>
);

// RangeSlider Component
const RangeSlider: React.FC<{
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}> = ({ min, max, value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = [...value] as [number, number];
    newValue[index] = Number(e.target.value);

    // Ensure min doesn't exceed max and vice versa
    if (index === 0 && newValue[0] > newValue[1]) {
      newValue[0] = newValue[1];
    }
    if (index === 1 && newValue[1] < newValue[0]) {
      newValue[1] = newValue[0];
    }

    onChange(newValue);
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full">
        <div className="flex">
          <input
            type="range"
            min={min}
            max={max}
            value={value[0]}
            onChange={(e) => handleChange(e, 0)}
            className="w-full h-2 bg-transparent appearance-none"
          />
          <input
            type="range"
            min={min}
            max={max}
            value={value[1]}
            onChange={(e) => handleChange(e, 1)}
            className="w-full h-2 bg-transparent appearance-none"
          />
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute h-2 bg-orange-500 rounded-full"
            style={{
              left: `${((value[0] - min) / (max - min)) * 100}%`,
              width: `${((value[1] - value[0]) / (max - min)) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Value Labels */}
      <div className="flex justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <span className="font-medium">₹{value[0]}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-medium">₹{value[1]}</span>
        </div>
      </div>
    </div>
  );
};

// Export the component
export default EnhancedProductFilter;