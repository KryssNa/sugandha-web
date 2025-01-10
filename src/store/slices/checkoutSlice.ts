// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface FormData {
//   email: string;
//   firstName: string;
//   lastName: string;
//   address: string;
//   city: string;
//   state: string;
//   country: string;
//   postalCode: string;
//   phone: string;
//   paymentMethod: "credit-card" | "khalti" | "esewa";
//   cardNumber: string;
//   expiryDate: string;
//   cvv: string;
// }

// interface OrderItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image: string;
// }

// interface OrderSummary {
//   subtotal: number;
//   shipping: number;
//   tax: number;
//   total: number;
//   items: OrderItem[];
// }

// interface CheckoutState {
//   step: number;
//   formData: FormData;
//   orderSummary: OrderSummary;
//   orderNumber: string | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialFormData: FormData = {
//   email: "",
//   firstName: "",
//   lastName: "",
//   address: "",
//   city: "",
//   state: "",
//   country: "",
//   postalCode: "",
//   phone: "",
//   paymentMethod: "credit-card",
//   cardNumber: "",
//   expiryDate: "",
//   cvv: "",
// };

// const initialState: CheckoutState = {
//   step: 1,
//   formData: initialFormData,
//   orderSummary: {
//     subtotal: 0,
//     shipping: 0,
//     tax: 0,
//     total: 0,
//     items: [],
//   },
//   orderNumber: null,
//   loading: false,
//   error: null,
// };

// const checkoutSlice = createSlice({
//   name: 'checkout',
//   initialState,
//   reducers: {
//     setStep: (state, action: PayloadAction<number>) => {
//       state.step = action.payload;
//     },
//     updateFormData: (state, action: PayloadAction<Partial<FormData>>) => {
//       state.formData = { ...state.formData, ...action.payload };
//     },
//     setOrderSummary: (state, action: PayloadAction<OrderSummary>) => {
//       state.orderSummary = action.payload;
//     },
//     setOrderNumber: (state, action: PayloadAction<string>) => {
//       state.orderNumber = action.payload;
//     },
//     setFormData: (state, action: PayloadAction<FormData>) => {
//       state.formData = action.payload;
//     },
//     CheckoutFormData: (state) => {
//       state.loading = true;
//     },
//     resetCheckout: () => initialState,
//   },
// });

// export const {
//   setStep,
//   updateFormData,
//   setOrderSummary,
//   setOrderNumber,
//   setFormData,
//   CheckoutFormData,
//   resetCheckout,
// } = checkoutSlice.actions;

// export default checkoutSlice.reducer;


// src/types/checkout.ts
export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  paymentMethod: "credit-card" | "khalti" | "esewa";
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  items: OrderItem[];
}

// src/store/slices/checkoutSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CheckoutState {
  step: number;
  formData: CheckoutFormData;
  orderSummary: OrderSummary;
  orderNumber: string | null;
}

const initialState: CheckoutState = {
  step: 1,
  formData: {
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    phone: "",
    paymentMethod: "credit-card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  },
  orderSummary: {
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
    items: [],
  },
  orderNumber: null,
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
    setOrderNumber: (state, action: PayloadAction<string>) => {
      state.orderNumber = action.payload;
    },
    resetCheckout: () => initialState,
  },
});

export const {
  setStep,
  setFormData,
  setOrderSummary,
  setOrderNumber,
  resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;