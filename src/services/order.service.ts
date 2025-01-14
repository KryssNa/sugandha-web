// services/orderService.ts
import { api } from '@/lib/axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export interface OrderDetails {
    id: string;
    orderNumber: string;
    status: string;
    createdAt: string;
    estimatedDelivery: string;

    // Shipping Details
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

    // Payment Details
    paymentMethod: 'credit-card' | 'khalti' | 'esewa' | 'cash-on-delivery';
    cardDetails?: {
        lastFourDigits?: string;
    };

    // Order Financials
    items: Array<{
        product: string;
        name: string;
        image: string;
        price: number;
        quantity: number;
    }>;
    subtotal: number;
    tax: number;
    shippingCost: number;
    totalAmount: number;
}
export class OrderService {
    // Fetch order details by ID
    static async getOrderDetails(orderId: string): Promise<OrderDetails> {
        try {
            const response = await api.get(`/checkout/orders/${orderId}`);
            // Validate and transform the response if needed
            const orderDetails = response.data.data;

            return {
                ...orderDetails,
                // Add any additional transformations or default values
                cardDetails: orderDetails.cardDetails || {},
                shippingCost: orderDetails.shippingCost || 0,
                tax: orderDetails.tax || 0
            };
        } catch (error) {
            console.error('Failed to fetch order details', error);
            throw error;
        }
    }

    // Download order invoice
    // static async downloadInvoice(orderId: string): Promise<void> {
    //     try {
    //         const response = await api.get(`/orders/${orderId}/invoice`, {
    //             responseType: 'blob'
    //         });

    //         // Create download link
    //         const url = window.URL.createObjectURL(new Blob([response.data]));
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.setAttribute('download', `order_${orderId}_invoice.pdf`);
    //         document.body.appendChild(link);
    //         link.click();
    //         link.remove();
    //     } catch (error) {
    //         console.error('Failed to download invoice', error);
    //         throw error;
    //     }
    // }

    // // Share order details
    // static async shareOrder(orderId: string) {
    //     try {
    //         const orderDetails = await this.getOrderDetails(orderId);

    //         if (navigator.share) {
    //             await navigator.share({
    //                 title: `Order #${orderDetails.orderNumber}`,
    //                 text: `Check out my order details for Order #${orderDetails.orderNumber}`,
    //                 url: `${window.location.origin}/orders/${orderId}`
    //             });
    //         } else {
    //             // Fallback for browsers not supporting Web Share API
    //             await navigator.clipboard.writeText(
    //                 `Order #${orderDetails.orderNumber} - Total: $${orderDetails.totalAmount.toFixed(2)}`
    //             );
    //             toast.success('Order details copied to clipboard');
    //         }
    //     } catch (error) {
    //         console.error('Failed to share order', error);
    //         throw error;
    //     }
    // }
    static async emailOrderReceipt(orderId: string): Promise<void> {
        try {
            await api.post(`/orders/${orderId}/email-receipt`);
        } catch (error) {
            console.error('Failed to email order receipt', error);
            throw error;
        }
    }

    static async downloadInvoice(orderId: string): Promise<void> {
        try {
            const response = await api.get(`/orders/${orderId}/invoice`, {
                responseType: 'blob'
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `order_${orderId}_invoice.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Failed to download invoice', error);
            throw error;
        }
    }

    static async shareOrder(orderId: string) {
        try {
            const orderDetails = await this.getOrderDetails(orderId);

            if (navigator.share) {
                await navigator.share({
                    title: `Order #${orderDetails.orderNumber}`,
                    text: `Check out my order details for Order #${orderDetails.orderNumber}`,
                    url: `${window.location.origin}/orders/${orderId}`
                });
            } else {
                // Fallback for browsers not supporting Web Share API
                await navigator.clipboard.writeText(
                    `Order #${orderDetails.orderNumber} - Total: $${orderDetails.totalAmount.toFixed(2)}`
                );
                toast.success('Order details copied to clipboard');
            }
        } catch (error) {
            console.error('Failed to share order', error);
            throw error;
        }
    }
}

// Custom Hook
export const useOrderConfirmation = (orderId: string) => {
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                const details = await OrderService.getOrderDetails(orderId);
                setOrderDetails(details);
            } catch (err) {
                setError('Failed to load order details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    return { orderDetails, loading, error };
};