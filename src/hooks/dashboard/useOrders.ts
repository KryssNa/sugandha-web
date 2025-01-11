import useSweetAlert from '@/components/shared/toast/showToast';
import { useCallback, useEffect, useState } from 'react';

export interface Order {
    id: string;
    customer: {
        name: string;
        email: string;
    };
    products: Array<{
        id: string;
        name: string;
        quantity: number;
        price: number;
    }>;
    total: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    paymentStatus: 'paid' | 'unpaid' | 'refunded';
    date: string;
}

export interface OrderFilters {
    status?: Order['status'];
    paymentStatus?: Order['paymentStatus'];
    dateRange?: string;
    searchQuery?: string;
}

interface UpdateOrderData {
    status?: Order['status'];
    paymentStatus?: Order['paymentStatus'];
    [key: string]: any;
}

export const useOrders = (initialFilters?: OrderFilters) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<OrderFilters>(initialFilters || {});
    const createAlert = useSweetAlert()

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const queryParams = new URLSearchParams();
            if (filters.status) queryParams.append('status', filters.status);
            if (filters.paymentStatus) queryParams.append('paymentStatus', filters.paymentStatus);
            if (filters.dateRange) queryParams.append('dateRange', filters.dateRange);
            if (filters.searchQuery) queryParams.append('search', filters.searchQuery);

            const response = await fetch(`/api/admin/orders?${queryParams}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch orders');
            }

            setOrders(data.orders);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            createAlert("error", err instanceof Error ? err.message : 'Failed to fetch orders'
            );
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const updateOrder = async (id: string, data: UpdateOrderData) => {
        try {
            const response = await fetch(`/api/admin/orders/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to update order');
            }

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === id ? { ...order, ...data } : order
                )
            );

            createAlert("success",
                "Order updated successfully"
            );

            return result;
        } catch (err) {
            createAlert("error",
                err instanceof Error ? err.message : 'Failed to update order',
            );
            throw err;
        }
    };

    const deleteOrder = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/orders/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete order');
            }

            setOrders(prevOrders => prevOrders.filter(order => order.id !== id));

            createAlert("success",
                "Order deleted successfully");
        } catch (err) {
            createAlert("error",
                err instanceof Error ? err.message : 'Failed to delete order',
            );
            throw err;
        }
    };

    const updateFilters = useCallback((newFilters: Partial<OrderFilters>) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
        }));
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return {
        orders,
        loading,
        error,
        filters,
        updateFilters,
        updateOrder,
        deleteOrder,
        refetch: fetchOrders,
    };
};