
// Interfacesexport
export interface IImage {
  id: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export interface ISpecification {
  label: string;
  value: string;
}


export interface IScentNote {
  type: string //'top' | 'middle' | 'base';
  notes: string[];
}

export interface IVariant {
  id?: string;
  size: number; // in ml
  sku: string;
  price: number;
  originalPrice: number;
  quantity: number;
  inStock: boolean;
}

export interface Rating {
  average: number;
  count: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}


export interface Review {
  id?: string;
  name: string;
  userId: string;
  rating: number;
  title?: string;
  comment: string;
  datePosted: string;
  helpful?: number;
  verifiedPurchase?: boolean;
}

// Product Interface
export interface Product {
  id?: string;
  // Basic Information
  title: string;
  slug: string;
  sku: string;
  brand: string;
  description: string;
  shortDescription?: string;

  // Media
  images: IImage[];
  thumbnail: string;
  coverImage: string;
  video?: string;

  // Pricing & Inventory
  variants: IVariant[];
  basePrice: number;
  originalPrice: number;
  discount?: number;
  discountEndDate?: Date;
  quantity: number;
  inStock: boolean;

  // Categories & Organization
  // category: string[];
  category: {
    id: string;
    name: string;
  }[]
  subCategory?: string[];
  tags: string[];
  collections?: string[];
  gender?: string;

  // Perfume Specific
  concentration?: string;  //'Parfum' | 'EDP' | 'EDT' | 'EDC' | 'Perfume Oil';
  scentNotes?: IScentNote[];
  sillage?: string; //'Intimate' | 'Moderate' | 'Strong' | 'Enormous';
  longevity?: string  //'Poor' | 'Moderate' | 'Long Lasting' | 'Very Long Lasting';
  seasonality?: string[];
  timeOfDay?: string[];
  occasions?: string[];

  // Product Details
  specifications: ISpecification[];
  features: string[];
  ingredients: string[];
  madeIn: string;
  launchYear?: number;
  perfumer?: string;

  // Ratings & Reviews
  rating?: {
    average: number;
    count: number;
    distribution: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  };
  reviews?: Review[];

  // Marketing & Sales
  isHot: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isLimited?: boolean;

  // SEO & Meta
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  updateStock?(quantity: number): Promise<void>;

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string[];
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  gender?: 'male' | 'female' | 'unisex';
  sort?: string;
  tags?: string[];
  concentration?: string;
  priceRange?: [number, number];
  inStock?: boolean;
  collections?: string[];
  seasonality?: string[];
  sillage?: string;
  longevity?: string;
  searchQuery?: string;
  sortBy?: 'price' | 'rating' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';


}

export interface ProductResponse {
  products: Product[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}