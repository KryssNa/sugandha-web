export interface Product {
  id?: string;
  slug: string;
  primaryImage: string;
  secondaryImage: string;
  title: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  isHot: boolean;
  endDate?: Date;
  brand: string;
  category: string;
  inStock: boolean;
}