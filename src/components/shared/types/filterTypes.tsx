import { Product } from "./productTypes";

export interface FilterState {
  priceRange: [number, number];
  brands: string[];
  categories: string[];
  search: string;
  rating?: number;
  availability?: "all" | "inStock" | "outOfStock";
}

export interface SliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

export interface AccordionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

export interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  count?: number;
}

export interface ProductFilterProps {
  products: Product[];
  onFilterChange: (filters: FilterState) => void;
  className?: string;
}
