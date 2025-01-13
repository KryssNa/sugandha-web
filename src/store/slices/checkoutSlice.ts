// src/store/slices/checkoutSlice.ts
import { CheckoutFormData, CheckoutState, OrderSummary } from '@/components/shared/types/checkout';
import { RootState } from '@/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: CheckoutState = {
  step: 1,
  isLoading: false,
  error: null,
  formData: {
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    phone: '',
    paymentMethod: 'credit-card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    saveInfo: false
  },
  orderSummary: {
    items: [],
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  },
  orderNumber: null
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },

    setFormData: (state, action: PayloadAction<Partial<CheckoutFormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },

    setOrderSummary: (state, action: PayloadAction<OrderSummary>) => {
      state.orderSummary = action.payload;
    },

    updateItemQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.orderSummary.items.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
        // Recalculate totals
        state.orderSummary.subtotal = state.orderSummary.items.reduce(
          (sum, item) => sum + (item.basePrice * item.quantity),
          0
        );
        state.orderSummary.total =
          state.orderSummary.subtotal +
          state.orderSummary.shipping +
          state.orderSummary.tax;
      }
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.orderSummary.items = state.orderSummary.items.filter(
        item => item.id !== action.payload
      );
      // Recalculate totals
      state.orderSummary.subtotal = state.orderSummary.items.reduce(
        (sum, item) => sum + (item.basePrice * item.quantity),
        0
      );
      state.orderSummary.total =
        state.orderSummary.subtotal +
        state.orderSummary.shipping +
        state.orderSummary.tax;
    },

    setOrderNumber: (state, action: PayloadAction<string>) => {
      state.orderNumber = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    resetCheckout: (state) => {
      return initialState;
    }
  }
});

export const {
  setStep,
  setFormData,
  setOrderSummary,
  updateItemQuantity,
  removeItem,
  setOrderNumber,
  setLoading,
  setError,
  resetCheckout
} = checkoutSlice.actions;

// Selectors
export const selectCheckoutStep = (state: RootState) => state.checkout.step;
export const selectFormData = (state: RootState) => state.checkout.formData;
export const selectOrderSummary = (state: RootState) => state.checkout.orderSummary;
export const selectCheckoutError = (state: RootState) => state.checkout.error;
export const selectIsLoading = (state: RootState) => state.checkout.isLoading;

export default checkoutSlice.reducer;