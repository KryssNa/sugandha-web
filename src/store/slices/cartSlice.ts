// store/slices/cartSlice.ts
import {
  CartAddPayload,
  CartItem,
  CartState,
  CartUpdatePayload
} from '@/components/shared/types/cart.types';
import { IVariant, Product } from '@/components/shared/types/product.types';
import { CartService } from '@/services/cart.service';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Constants
const CART_STORAGE_KEY = 'sugandha_cart';
const SHIPPING_THRESHOLD = 1000;
const BASE_SHIPPING = 100;
const TAX_RATE = 0.13;


// Helper Functions
const calculateTotals = (
  items: CartItem[],
  couponCode: string | null
) => {
  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => {
    const price = item.basePrice || item.basePrice;
    return sum + (price * (item.quantity || 1));
  }, 0);

  // Calculate discount based on coupon
  const discount = couponCode ? calculateDiscount(subtotal, couponCode) : 0;

  // Calculate shipping
  const shipping = subtotal > SHIPPING_THRESHOLD ? 0 : BASE_SHIPPING;

  // Calculate tax on discounted amount
  const taxableAmount = subtotal - discount;
  const tax = Math.round(taxableAmount * TAX_RATE * 100) / 100;

  // Calculate total
  const total = subtotal - discount + shipping + tax;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    total: Math.round(total * 100) / 100
  };
};

const calculateDiscount = (subtotal: number, couponCode: string): number => {
  switch (couponCode) {
    case 'SAVE10':
      return subtotal * 0.1;
    case 'SAVE20':
      return subtotal * 0.2;
    default:
      return 0;
  }
};

// Storage Functions
const saveToLocalStorage = (cartState: CartState) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
        items: cartState.items,
        couponCode: cartState.couponCode,
        totals: cartState.totals
      }));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }
};

const loadFromLocalStorage = (): Partial<CartState> | null => {
  if (typeof window === 'undefined') return null;

  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    if (!cartData) return null;

    const parsedCart = JSON.parse(cartData);
    return {
      items: parsedCart.items || [],
      couponCode: parsedCart.couponCode || null,
      totals: parsedCart.totals || {
        subtotal: 0,
        shipping: 0,
        tax: 0,
        discount: 0,
        total: 0
      }
    };
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return null;
  }
};

// const loadFromLocalStorage = (): Partial<CartState> | null => {
//   if (typeof window === 'undefined') return null;

//   try {
//     const cartData = localStorage.getItem(CART_STORAGE_KEY);
//     return cartData ? JSON.parse(cartData) : null;
//   } catch (error) {
//     console.error('Error loading cart:', error);
//     return null;
//   }
// };

// Initial State
const initialState: CartState = {
  items: [],
  couponCode: null,
  totals: {
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0
  },
  isLoading: false,
  error: null,
  ...loadFromLocalStorage()
};

// store/slices/cartSlice.ts
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await CartService.getCart();

      if (response.data) {
        const formattedCart = {
          items: response.data.items.map(item => ({
            id: item.product.id,
            title: item.product.title,
            thumbnail: item.product.thumbnail,
            basePrice: item.product.basePrice,
            quantity: item.quantity,
            price: item.price || item.product.basePrice,
            inStock: item.product.inStock,
          })),
          totals: {
            subtotal: response.data.totals.subtotal,
            shipping: response.data.totals.shipping,
            tax: response.data.totals.tax,
            discount: 0, // Add if your API provides it
            total: response.data.totals.total
          },
          couponCode: response.data.couponCode || null,
          isLoading: false,
          error: null
        };

        saveToLocalStorage(formattedCart);
        return formattedCart;
      }

      const localCart = loadFromLocalStorage();
      if (localCart) {
        return localCart;
      }

      return initialState;
    } catch (error: any) {
      const localCart = loadFromLocalStorage();
      if (localCart) {
        return localCart;
      }
      return rejectWithValue(error.message || 'Failed to fetch cart');
    }
  }
);

export const addItemToCart = createAsyncThunk(
  'cart/addItem',
  async (
    {
      product,
      quantity = 1,
      selectedVariant,
      productId,
    }: CartAddPayload,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const updatedCart = await CartService.addToCart(
        productId || product.id!,
        quantity
      );

      if (updatedCart) {
        const formattedCart = {
          items: updatedCart.items.map(item => ({
            id: item.product.id,
            title: item.product.title,
            thumbnail: item.product.thumbnail,
            basePrice: item.product.basePrice,
            quantity: item.quantity,
            price: item.price,
            inStock: item.product.inStock,
          })),
          totals: updatedCart.totals
        };
        saveToLocalStorage(formattedCart);
        return formattedCart;
      }
      throw new Error('Failed to add item');

    } catch (error: any) {
      // Fallback to local storage
      dispatch(addToCartLocal({ product, quantity, selectedVariant }));
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add item to cart'
      );
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  'cart/removeItem',
  async (
    { productId, variantId }: CartUpdatePayload,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const updatedCart = await CartService.removeFromCart(productId);

      if (updatedCart) {
        const formattedCart = {
          items: updatedCart.items.map(item => ({
            id: item.product.id,
            title: item.product.title,
            thumbnail: item.product.thumbnail,
            basePrice: item.product.basePrice,
            quantity: item.quantity,
            price: item.price,
            inStock: item.product.inStock,
          })),
          totals: updatedCart.totals
        };
        saveToLocalStorage(formattedCart);
        return formattedCart;
      }
      throw new Error('Failed to remove item');

    } catch (error: any) {
      // Fallback to local storage
      dispatch(removeFromCart({ productId, variantId }));
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove item from cart'
      );
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async (
    { productId, quantity, variantId }: CartUpdatePayload,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const updatedCart = await CartService.updateQuantity(
        productId,
        quantity!
      );

      if (updatedCart) {
        const formattedCart = {
          items: updatedCart.items.map(item => ({
            id: item.product.id,
            title: item.product.title,
            thumbnail: item.product.thumbnail,
            basePrice: item.product.basePrice,
            quantity: item.quantity,
            price: item.price,
            inStock: item.product.inStock,
          })),
          totals: updatedCart.totals
        };
        saveToLocalStorage(formattedCart);
        return formattedCart;
      }
      throw new Error('Failed to update quantity');

    } catch (error: any) {
      // Fallback to local storage
      dispatch(updateQuantity({ productId, quantity: quantity!, variantId }));
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update cart quantity'
      );
    }
  }
);

export const updateCartTotals = createAsyncThunk(
  'cart/updateTotals',
  async (_, { getState }) => {
    const { items, couponCode } = (getState() as { cart: CartState }).cart;
    
    const totals = calculateTotals(items, couponCode);
    return { totals };
  }
);

export const applyCartCoupon = createAsyncThunk(
  'cart/applyCoupon',
  async (
    couponCode: string,
    { dispatch, rejectWithValue }
  ) => {
    try {
      // Try to apply coupon via API
      const updatedCart = await CartService.applyCoupon(couponCode);

      // Update local and API cart
      dispatch(updateCartLocal(updatedCart));
      return updatedCart;
    } catch (error: any) {
      // If API fails, apply coupon locally
      dispatch(applyCoupon(couponCode));

      return rejectWithValue(
        error.response?.data?.message || 'Failed to apply coupon'
      );
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {

    // Local cart management reducers
    addToCartLocal: (
      state,
      action: PayloadAction<{
        product: Product;
        quantity: number;
        selectedVariant?: IVariant;
      }>
    ) => {
      const { product, quantity, selectedVariant } = action.payload;

      // Find existing item in cart
      const existingItemIndex = state.items.findIndex(
        item =>
          item.id === product.id &&
          (selectedVariant
            ? item.selectedVariant?.id === selectedVariant.id
            : true)
      );

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        state.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        state.items.push({
          ...product,
          quantity
        });
      }

      // Recalculate totals
      state.totals = calculateTotals(state.items, state.couponCode);

      // Save to local storage
      saveToLocalStorage(state);
    },

    removeFromCart: (
      state,
      action: PayloadAction<{
        productId: string;
        variantId?: string;
      }>
    ) => {
      const { productId, variantId } = action.payload;

      // Filter out the item
      state.items = state.items.filter(item =>
        !(item.id === productId &&
          (variantId
            ? item.selectedVariant?.id === variantId
            : true))
      );

      // Recalculate totals
      state.totals = calculateTotals(state.items, state.couponCode);

      // Save to local storage
      saveToLocalStorage(state);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{
        productId: string;
        quantity: number;
        variantId?: string;
      }>
    ) => {
      const { productId, quantity, variantId } = action.payload;

      // Find the item to update
      const itemIndex = state.items.findIndex(
        item =>
          item.id === productId &&
          (variantId
            ? item.selectedVariant?.id === variantId
            : true)
      );

      if (itemIndex > -1) {
        // Update quantity or remove if zero
        if (quantity > 0) {
          state.items[itemIndex].quantity = quantity;
        } else {
          state.items.splice(itemIndex, 1);
        }

        // Recalculate totals
        state.totals = calculateTotals(state.items, state.couponCode);

        // Save to local storage
        saveToLocalStorage(state);
      }
    },

    applyCoupon: (state, action: PayloadAction<string>) => {
      state.couponCode = action.payload;
      state.totals = calculateTotals(state.items, state.couponCode);
      saveToLocalStorage(state);
    },

    updateCartLocal: (
      state,
      action: PayloadAction<Partial<CartState>>
    ) => {
      const payload = action.payload;

      // Handle API cart or local cart update
      const items = 'items' in payload
        ? payload.items
        : payload.items || [];

      state.items = (items as CartItem[]) || [];
      state.couponCode = payload.couponCode || null;
      state.totals = calculateTotals(
        items as CartItem[],
        payload.couponCode || null
      );

      saveToLocalStorage(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.couponCode = null;
      state.totals = {
        subtotal: 0,
        shipping: 0,
        tax: 0,
        discount: 0,
        total: 0
      };
      localStorage.removeItem(CART_STORAGE_KEY);
    },

    // Hydrate cart from local storage
    hydrate: (state) => {
      const savedCart = loadFromLocalStorage();
      if (savedCart) {
        Object.assign(state, savedCart);
      }
    }
  },
  extraReducers: (builder) => {
    // Handle async thunks loading states
    const loadingHandlers = [
      fetchCart,
      addItemToCart,
      removeItemFromCart,
      updateCartQuantity,
      applyCartCoupon
    ];


    // loadingHandlers.forEach(thunk => {
    //   builder
    //     .addCase(thunk.pending, (state) => {
    //       state.isLoading = true;
    //       state.error = null;
    //     })
    //     .addCase(thunk.rejected, (state, action) => {
    //       state.isLoading = false;
    //       state.error = action.payload as string;
    //     });
    // });

    builder
    // Fetch Cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const cartData = action.payload;
          state.items = cartData.items;
          state.totals = cartData.totals;
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Try to load from localStorage as fallback
        const localCart = loadFromLocalStorage();
        if (localCart) {
          state.items = localCart.items;
          state.totals = localCart.totals;
        }
      })
      .addCase(addItemToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.items = action.payload.items;
          state.totals = action.payload.totals;
        }
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Remove Item
      .addCase(removeItemFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.items = action.payload.items;
          state.totals = action.payload.totals;
        }
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update Quantity
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.items = action.payload.items;
          state.totals = action.payload.totals;
        }
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(applyCartCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
      })
    .addCase(updateCartTotals.fulfilled, (state, action) => {
      state.totals = action.payload.totals;
    }
    );
}
});

export const {
  addToCartLocal,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  updateCartLocal,
  clearCart,
  hydrate
} = cartSlice.actions;

export default cartSlice.reducer;