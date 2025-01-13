// src/types/checkout.ts

import { Product } from "./product.types";

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
  paymentMethod: 'credit-card' | 'khalti' | 'esewa' | 'cash-on-delivery';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  saveInfo?: boolean;
}

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface OrderSummary {
  items: Product[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface CheckoutState {
  step: number;
  isLoading: boolean;
  error: string | null;
  formData: CheckoutFormData;
  orderSummary: OrderSummary;
  orderNumber: string | null;
}

export interface CheckoutData {
  isGuest: boolean;
  guestUserDetails?: {
    email: string;
    firstName: string;
    lastName: string;
  };
  orderData: {
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    totalAmount: number;
    subtotal: number;
    tax?: number;
    shippingCost?: number;
  };
  paymentData: {
    method: CheckoutFormData['paymentMethod'];
    details?: {
      cardNumber?: string;
      expiryMonth?: number;
      expiryYear?: number;
      cvv?: string;
    };
  };
}