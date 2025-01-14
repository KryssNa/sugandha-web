// import { Product } from "./product.types";

// export interface PriceRange {
//   min: number;
//   max: number;
//   current: [number, number];
// }

// export interface FilterState {
//   priceRange: PriceRange;
//   brands: string[];
//   categories: string[];
//   search: string;
//   rating: number | null;
//   availability: "all" | "inStock" | "outOfStock";
//   sortBy: "popular" | "priceAsc" | "priceDesc";
//   gender: "unisex" | "male" | "female" |"all";
// }

// export interface RangeSliderProps {
//   range: PriceRange;
//   onChange: (values: [number, number]) => void;
//   formatValue?: (value: number) => string;
//   step?: number;
// }

// export interface FilterAccordionProps {
//   title: string;
//   children: React.ReactNode;
//   isOpen: boolean;
//   onToggle: () => void;
//   badge?: number;
// }

// export interface FilterCheckboxProps {
//   label: string;
//   checked: boolean;
//   onChange: (checked: boolean) => void;
//   count?: number;
//   indent?: boolean;
// }

// export interface ProductFilterProps {
//   products: Product[];
//   onFilterChange: (filters: FilterState) => void;
//   className?: string;
// }

// src/types/filter.ts
import { Product } from './product.types';

export interface FilterState {
  priceRange: {
    min: number;
    max: number;
    current: [number, number];
  };
  brands: string[];
  categories: string[];
  ratings: number[];
  availability: 'all' | 'inStock' | 'outOfStock';
  search: string;
  sortBy: 'popular' | 'priceAsc' | 'priceDesc';
}

export interface FilterChangeHandlers {
  setPriceRange: (range: [number, number]) => void;
  toggleBrand: (brand: string) => void;
  toggleCategory: (category: string) => void;
  toggleRating: (rating: number) => void;
  setAvailability: (availability: 'all' | 'inStock' | 'outOfStock') => void;
  setSearch: (search: string) => void;
  setSortBy: (sortBy: 'popular' | 'priceAsc' | 'priceDesc') => void;
  resetFilters: () => void;
}

export interface FilterOptions {
  brands: string[];
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  availability: {
    inStock: number;
    outOfStock: number;
  };
  ratings: Array<{
    rating: number;
    count: number;
  }>;
  sortBy: string[];
}

export interface ProductFilterProps {
  products: Product[];
  filters: FilterState;
  onFilterChange: FilterChangeHandlers;
  className?: string;
}