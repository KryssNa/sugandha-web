import { Product } from "./productTypes";

export interface PriceRange {
  min: number;
  max: number;
  current: [number, number];
}

export interface FilterState {
  priceRange: PriceRange;
  brands: string[];
  categories: string[];
  search: string;
  rating: number | null;
  availability: "all" | "inStock" | "outOfStock";
  sortBy: "popular" | "priceAsc" | "priceDesc";
}

export interface RangeSliderProps {
  range: PriceRange;
  onChange: (values: [number, number]) => void;
  formatValue?: (value: number) => string;
  step?: number;
}

export interface FilterAccordionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  badge?: number;
}

export interface FilterCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  count?: number;
  indent?: boolean;
}

export interface ProductFilterProps {
  products: Product[];
  onFilterChange: (filters: FilterState) => void;
  className?: string;
}