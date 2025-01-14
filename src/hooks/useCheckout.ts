// src/hooks/useCheckout.ts
import { CheckoutService } from '@/services/checkout.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearCart } from '@/store/slices/cartSlice';
import {
    setError,
    setFormData,
    setLoading,
    setOrderNumber,
    setStep
} from '@/store/slices/checkoutSlice';
import { useErrorHandler } from '@/utils/parser/errorParser';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import useToast from './useToast';

export const useCheckout = () => {
    const dispatch = useAppDispatch();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    const router = useRouter();
    const createAlert = useToast();
    const { showError } = useErrorHandler(createAlert);


    // Get state from Redux
    const { step, formData, orderSummary } = useAppSelector(state => state.checkout);
    const { items: cartItems, totals: cartTotals } = useAppSelector(state => state.cart);

    // Local loading state
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form handling
    const handleInputChange = useCallback((
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        dispatch(setFormData({ [name]: value }));
    }, [dispatch]);
    const handleRemoveItem = useCallback((index: number) => {
        CheckoutService.removeItemFromOrderSummary(dispatch, orderSummary, index);
    }, [dispatch, orderSummary]);

    // Create checkout
    const createCheckout = useCallback(async () => {
        setIsSubmitting(true);
        dispatch(setLoading(true));
        try {
            const result = await CheckoutService.createCheckout(
                {...formData,isGuest: !isAuthenticated},
                cartItems,
                cartTotals
            );

            if (result.success) {
                dispatch(setOrderNumber(result.data.orderNumber));
                dispatch(clearCart());
                dispatch(setError(null));
                return result;
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Checkout failed';
            showError(error.response?.data);
            dispatch(setError(errorMessage));
            return null;
        } finally {
            setIsSubmitting(false);
            dispatch(setLoading(false));
        }
    }, [formData, cartItems, cartTotals, dispatch]);
    const handleUpdateQuantity = useCallback((id: string, newQuantity: number) => {
        CheckoutService.updateItemQuantity(dispatch, orderSummary, id, newQuantity);
    }, [dispatch, orderSummary]);

    // Navigation
    const handleNextStep = useCallback(() => {
        dispatch(setStep(step + 1));
    }, [step, dispatch]);

    const handlePrevStep = useCallback(() => {
        dispatch(setStep(step - 1));
    }, [step, dispatch]);

    // Form submission
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        // For shipping step, just validate and proceed
        if (step === 1) {
            if (validateShippingForm()) {
                handleNextStep();
            }
            return;
        }

        // For payment step, create checkout
        if (step === 2) {
            if (validatePaymentForm()) {
                const checkoutResult = await createCheckout();
                if (checkoutResult?.success) {
                    handleNextStep();
                }
            }
        }
    }, [step, createCheckout, handleNextStep]);

    // Validation functions
    const validateShippingForm = useCallback(() => {
        const requiredFields = [
            'firstName',
            'lastName',
            'email',
            'phone',
            'address',
            'city',
            'state',
            'country',
            'postalCode'
        ];

        const missingFields = requiredFields.filter(field => !(formData as any)[field]);

        if (missingFields.length > 0) {
            toast.error('Please fill in all required fields');
            return false;
        }

        if (!formData.email.includes('@')) {
            toast.error('Please enter a valid email address');
            return false;
        }

        if (formData.phone.length < 10) {
            toast.error('Please enter a valid phone number');
            return false;
        }

        return true;
    }, [formData]);

    const validatePaymentForm = useCallback(() => {
        if (!formData.paymentMethod) {
            toast.error('Please select a payment method');
            return false;
        }

        if (formData.paymentMethod === 'credit-card') {
            if (!formData.cardNumber || !formData.expiryDate || !formData.cvv) {
                toast.error('Please fill in all card details');
                return false;
            }

            // Basic card validation
            if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
                toast.error('Please enter a valid card number');
                return false;
            }

            if (formData.cvv.length !== 3) {
                toast.error('Please enter a valid CVV');
                return false;
            }
        }

        return true;
    }, [formData]);

    return {
        step,
        formData,
        orderSummary,
        isSubmitting,
        handleInputChange,
        handleSubmit,
        handleNextStep,
        handlePrevStep,
        createCheckout,
        handleRemoveItem,
        handleUpdateQuantity
    };
};