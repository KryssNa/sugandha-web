// types/checkout.ts
export interface FormData {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    phone: string;
    paymentMethod: 'credit-card' | 'khalti' | 'esewa'| "cash-on-delivery";
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  }
  
 export interface OrderItem {
    name: string;
    price: number;
    quantity: number;
    image: string;
  }
  
export  interface OrderSummary {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    items: OrderItem[];
  }
  
 export interface InputProps {
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
    required?: boolean;
    placeholder?: string;
  }
  
export  interface RadioProps {
    label: string;
    checked: boolean;
    onChange: () => void;
    icon?: React.ReactNode;
    description?: string;
  }