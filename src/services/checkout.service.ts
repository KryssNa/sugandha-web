// services/checkoutService.ts
import { Product } from '@/components/shared/types/product.types';
import { api } from '@/lib/axios';
import { AppDispatch } from '@/store/index';
import { updateCartQuantity } from '@/store/slices/cartSlice';
import {
    resetCheckout,
    setFormData,
    setOrderSummary,
    setStep
} from '@/store/slices/checkoutSlice';
import { toast } from 'react-hot-toast'; // Assuming you're using react-hot-toast


interface CheckoutSummary {
    items: Product[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
}
interface CheckoutData {
    isGuest: boolean;
    guestUserDetails?: {
        email: string;
        firstName: string;
        lastName: string;
    };
    orderData: {
        items: {
            product: string;
            name: string;
            price: number;
            quantity: number;
        }[];
        shippingAddress: {
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            street: string;
            city: string;
            state: string;
            country: string;
            postalCode: string;
        };
        totalAmount: number;
        subtotal: number;
        tax?: number;
        shippingCost?: number;
    };
    paymentData: {
        method: 'credit-card' | 'khalti' | 'esewa' | 'cash-on-delivery';
        details?: {
            cardNumber?: string;
            expiryMonth?: number;
            expiryYear?: number;
            cvv?: string;
        };
    };
}

export class CheckoutService {
    // Create checkout from cart items
    static initializeCheckout(dispatch: AppDispatch, cartItems: any[], cartTotals: any) {
        dispatch(setOrderSummary({
            items: cartItems,
            total: cartTotals.total,
            subtotal: cartTotals.subtotal,
            shipping: cartTotals.shipping,
            tax: cartTotals.tax,
        }));
    }

    // Handle input changes in forms
    static handleInputChange(
        dispatch: AppDispatch,
        formData: any,
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        dispatch(setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        }));
    }

    // Remove item from order summary
    static removeItemFromOrderSummary(
        dispatch: AppDispatch,
        orderSummary: CheckoutSummary,
        index: number
    ) {
        const updatedItems = orderSummary.items.filter((_, i) => i !== index);
        dispatch(setOrderSummary({
            ...orderSummary,
            items: updatedItems,
        }));
    }

    // Update item quantity
    static updateItemQuantity(
        dispatch: AppDispatch,
        orderSummary: CheckoutSummary,
        id: string,
        newQuantity: number
    ) {
        const updatedItems = orderSummary.items.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    quantity: newQuantity,
                };
            }
            return item;
        });

        dispatch(updateCartQuantity({ productId: id, quantity: newQuantity }));
        dispatch(setOrderSummary({
            ...orderSummary,
            items: updatedItems,
        }));
    }

    // Proceed to next checkout step
    static proceedToNextStep(dispatch: AppDispatch, currentStep: number) {
        dispatch(setStep(currentStep + 1));
    }

    // Go back to previous checkout step
    static goToPreviousStep(dispatch: AppDispatch, currentStep: number) {
        dispatch(setStep(currentStep - 1));
    }

    // // Create checkout order
    // static async createCheckout(
    //     dispatch: AppDispatch,
    //     formData: any,
    //     orderSummary: CheckoutSummary
    // ) {
    //     try {
    //         // Prepare checkout data
    //         const checkoutData = {
    //             isGuest: !formData.saveInfo, // Assuming saveInfo indicates logged-in user
    //             guestEmail: formData.email,
    //             items: orderSummary.items.map(item => ({
    //                 product: item.id,
    //                 quantity: item.quantity,
    //                 price: item.basePrice
    //             })),
    //             shippingAddress: {
    //                 firstName: formData.firstName,
    //                 lastName: formData.lastName,
    //                 email: formData.email,
    //                 phone: formData.phone,
    //                 street: formData.address,
    //                 city: formData.city,
    //                 state: formData.state,
    //                 country: formData.country,
    //                 postalCode: formData.postalCode
    //             },
    //             paymentMethod: formData.paymentMethod,
    //             totalAmount: orderSummary.total
    //         };

    //         // API call to create checkout
    //         const response = await api.post('/checkout', checkoutData);

    //         // Show success message
    //         toast.success('Checkout created successfully');

    //         // Optional: Additional processing after successful checkout
    //         // For example, clearing cart, resetting form, etc.
    //         // dispatch(resetCart());

    //         return response.data;
    //     } catch (error: any) {
    //         // Handle errors
    //         const errorMessage = error.response?.data?.message || 'Checkout failed';
    //         toast.error(errorMessage);
    //         throw error;
    //     }
    // }

    static async createCheckout(formData: any, cartItems: Product[], cartTotals: any) {
        try {
            const checkoutData: CheckoutData = {
                isGuest: !formData.saveInfo,
                guestUserDetails: !formData.saveInfo ? {
                    email: formData.email,
                    firstName: formData.firstName,
                    lastName: formData.lastName
                } : undefined,
                orderData: {
                    items: cartItems.map(item => ({
                        product: item.id || '',
                        name: item.title,
                        price: item.basePrice,
                        quantity: item.quantity
                    })),
                    shippingAddress: {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email,
                        phone: formData.phone,
                        street: formData.address,
                        city: formData.city,
                        state: formData.state,
                        country: formData.country,
                        postalCode: formData.postalCode
                    },
                    totalAmount: cartTotals.total,
                    subtotal: cartTotals.subtotal,
                    tax: cartTotals.tax,
                    shippingCost: cartTotals.shipping
                },
                paymentData: {
                    method: formData.paymentMethod,
                    details: formData.paymentMethod === 'credit-card' ? {
                        cardNumber: formData.cardNumber,
                        expiryMonth: parseInt(formData.expiryDate?.split('/')[0]),
                        expiryYear: parseInt(formData.expiryDate?.split('/')[1]),
                        cvv: formData.cvv
                    } : undefined
                }
            };

            const response = await api.post('/checkout', checkoutData);
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to create checkout';
            toast.error(errorMessage);
            throw error;
        }
    }

    static async retryPayment(orderId: string, paymentData: any) {
        try {
            const response = await api.post(`/payments/${orderId}/retry`, {
                paymentData: {
                    method: paymentData.method,
                    details: paymentData.details
                }
            });
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Payment retry failed';
            toast.error(errorMessage);
            throw error;
        }
    }

    // Reset checkout process
    static resetCheckoutProcess(dispatch: AppDispatch) {
        dispatch(resetCheckout());
    }
}

// // React Hook for Checkout
// import { Product } from '@/components/shared/types/product.types';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { useRouter } from 'next/navigation';
// import { useCallback } from 'react';

// export const useCheckout = () => {
//     const dispatch = useAppDispatch();
//     const router = useRouter();
//     const { step, formData, orderSummary } = useAppSelector((state) => state.checkout);
//     const { items: cartItems, totals: cartTotals } = useAppSelector((state) => state.cart);

//     // Initialize checkout
//     const initializeCheckout = useCallback(() => {
//         CheckoutService.initializeCheckout(dispatch, cartItems, cartTotals);
//     }, [dispatch, cartItems, cartTotals]);

//     // Handle input changes
//     const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//         CheckoutService.handleInputChange(dispatch, formData, e);
//     }, [dispatch, formData]);

//     // Remove item from order summary
// const handleRemoveItem = useCallback((index: number) => {
//     CheckoutService.removeItemFromOrderSummary(dispatch, orderSummary, index);
// }, [dispatch, orderSummary]);

//     // Update item quantity
// const handleUpdateQuantity = useCallback((id: string, newQuantity: number) => {
//     CheckoutService.updateItemQuantity(dispatch, orderSummary, id, newQuantity);
// }, [dispatch, orderSummary]);

//     // Proceed to next step
//     const handleSubmit = useCallback((e?: React.FormEvent) => {
//         if (e) e.preventDefault();
//         CheckoutService.proceedToNextStep(dispatch, step);
//     }, [dispatch, step]);

//     // Go back to previous step
//     const handleBackStep = useCallback(() => {
//         CheckoutService.goToPreviousStep(dispatch, step);
//     }, [dispatch, step]);

//     // Create checkout order
//     const createCheckout = useCallback(async () => {
//         try {
//             const checkoutResponse = await CheckoutService.createCheckout(dispatch, formData, orderSummary);

//             // Redirect to confirmation or next step
//             // router.push(`/checkout/confirmation/${checkoutResponse.data.checkoutId}`);

//             return checkoutResponse;
//         } catch (error) {
//             console.error('Checkout failed', error);
//             // Handle error (toast, error state, etc.)
//         }
//     }, [dispatch, formData, orderSummary, router]);

//     // Reset checkout process
//     const resetCheckout = useCallback(() => {
//         CheckoutService.resetCheckoutProcess(dispatch);
//     }, [dispatch]);

//     return {
//         step,
//         formData,
//         orderSummary,
//         initializeCheckout,
//         handleInputChange,
//         handleRemoveItem,
//         handleUpdateQuantity,
//         handleSubmit,
//         handleBackStep,
//         createCheckout,
//         resetCheckout
//     };
// };