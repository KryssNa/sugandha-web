import { Product } from '@/components/shared/types/productTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Constants
const CART_STORAGE_KEY = 'shopping_cart';

// Types
interface CartState {
  items: Product[];
  couponCode: string;
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
}

// Helper Functions
const saveToLocalStorage = (cartState: CartState) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

const loadFromLocalStorage = (): CartState | null => {
  try {
    // Add this to your app initialization
    let cartData = null;
    if (typeof window !== 'undefined') {
      cartData = localStorage.getItem(CART_STORAGE_KEY);
    }
    return cartData ? JSON.parse(cartData) : null;
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return null;
  }
};

// Initial State
const savedCart = loadFromLocalStorage();

const initialState: CartState = savedCart || {
  items: [],
  couponCode: '',
  totals: {
    subtotal: 0,
    shipping: 0,
    tax: 10.0,
    total: 0,
  },
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 0) + 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      saveToLocalStorage(state);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveToLocalStorage(state);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; change: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, (item.quantity || 0) + action.payload.change);
        saveToLocalStorage(state);
      }
    },
    setCouponCode: (state, action: PayloadAction<string>) => {
      state.couponCode = action.payload;
      saveToLocalStorage(state);
    },
    updateTotals: (state) => {
      const subtotal = state.items.reduce(
        (sum, item) => sum + item.basePrice * (item.quantity || 1),
        0
      );
      state.totals = {
        subtotal,
        shipping: 0,
        tax: 10.0,
        total: subtotal + 10.0,
      };
      saveToLocalStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.couponCode = '';
      state.totals = initialState.totals;
      localStorage.removeItem(CART_STORAGE_KEY);
    },
    // New action to initialize cart from localStorage
    initializeCart: (state) => {
      const savedCart = loadFromLocalStorage();
      if (savedCart) {
        state.items = savedCart.items;
        state.couponCode = savedCart.couponCode;
        state.totals = savedCart.totals;
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  setCouponCode,
  updateTotals,
  clearCart,
  initializeCart,
} = cartSlice.actions;

export default cartSlice.reducer;