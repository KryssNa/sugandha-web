// hooks/useDashboard.ts
import { Order } from '@/components/sections/order history/types';
import { ActivityItem, DashboardData } from '@/components/shared/types/dashboard.types';
import { dashboardService } from '@/services/dashboard.service';
import { useEffect, useState } from 'react';
import useToast from './useToast';

export const useDashboard = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await dashboardService.getDashboardData();
            setData(response);
            setError(null);
        } catch (err) {
            setError('Failed to load dashboard data');
            toast('error', 'Failed to load dashboard data'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return { data, loading, error, refetch: fetchDashboardData };
};

// hooks/useOrders.ts
export const useOrders = (initialParams?: {
    page?: number;
    limit?: number;
    status?: string;
    sortBy?: string;
}) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [params, setParams] = useState(initialParams || {
        page: 1,
        limit: 10,
    });
    const toast = useToast();

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await dashboardService.getOrders(params);
            setOrders(response.orders);
            setTotal(response.total);
            setError(null);
        } catch (err) {
            setError('Failed to load orders');
            toast(
                'error',
                'Failed to load orders',
            );
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (orderId: string, reason?: string) => {
        try {
            await dashboardService.cancelOrder(orderId, reason);
            toast('success',
                'Order cancelled successfully',
            );
            fetchOrders();
        } catch (err) {
            toast('error',
                'Failed to cancel order'
            );
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [params]);

    return {
        orders,
        total,
        loading,
        error,
        params,
        setParams,
        refetch: fetchOrders,
        cancelOrder,
    };
};

// hooks/useActivity.ts
export const useActivity = (initialParams?: {
    page?: number;
    limit?: number;
    type?: string;
}) => {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [params, setParams] = useState(initialParams || {
        page: 1,
        limit: 10,
    });
    const toast = useToast();

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const response = await dashboardService.getActivityLog(params);
            setActivities(response.activities);
            setTotal(response.total);
            setError(null);
        } catch (err) {
            setError('Failed to load activity log');
            toast('error', 'Failed to load activity log'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, [params]);

    return {
        activities,
        total,
        loading,
        error,
        params,
        setParams,
        refetch: fetchActivities,
    };
};