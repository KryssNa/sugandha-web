// types/cart.types.ts
import { IVariant, Product } from '@/components/shared/types/product.types';

// API Response Types
export interface ApiCartItem {
    product: {
        id: string;
        name: string;
        image: string;
        price: number;
        inStock: boolean;
        quantity: number;
    };
    quantity: number;
}

// types/cart.types.ts
export interface ApiCartResponse {
    success: boolean;
    status: string;
    message: string;
    data: {
      _id: string;
      user: string;
      items: Array<{
        product: {
          _id: string;
          title: string;
          thumbnail: string;
          basePrice: number;
          inStock: boolean;
          id: string;
          quantity: number;
        };
        quantity: number;
        price: number;
        _id: string;
      }>;
      totals: {
        subtotal: number;
        shipping: number;
        tax: number;
        total: number;
      };
        couponCode: string | null;
        
    };
  }
  
  export interface CartState {
    items: CartItem[];
    couponCode: string | null;
    totals: {
      subtotal: number;
      shipping: number;
      tax: number;
      discount: number;
      total: number;
    };
    isLoading: boolean;
    error: string | null;
  }
  

// Redux State Types
export interface CartItem extends Product {
    quantity: number;
    selectedVariant?: {
        id: string;
        size: number;
        price: number;
    };
}

export interface CartTotals {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
}

export interface CartState {
    items: CartItem[];
    couponCode: string | null;
    totals: CartTotals;
    isLoading: boolean;
    error: string | null;
}

// Type conversion helper
export const mapApiCartItemToCartItem = (apiItem: ApiCartItem): CartItem => ({
    id: apiItem.product.id,
    title: apiItem.product.name,
    thumbnail: apiItem.product.image,
    basePrice: apiItem.product.price,
    inStock: apiItem.product.inStock,
    quantity: apiItem.quantity,
    // Add other required Product fields
    slug: '',
    description: '',
    category: [],
    brand: '',
    sku: '',
    images: [],
    coverImage: '',
    variants: [],
    reviews: [],
    rating: { average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
    originalPrice: 0,
    tags: [],
    specifications: [],
    features: [],
    ingredients: [],
    madeIn: '',
    isHot: false,

});


export interface CartAddPayload {
    product: Product;
    quantity?: number;
    selectedVariant?: IVariant;
    productId?: string;
}

export interface CartUpdatePayload {
    productId: string;
    quantity?: number;
    variantId?: string;
}