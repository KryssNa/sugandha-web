'use client';

import { useAuth } from '@/hooks/useAuth';
import { useActivity, useDashboard, useOrders } from '@/hooks/useDashboard';
import { motion } from 'framer-motion';
import {
    ArrowDownRight,
    ArrowUpRight,
    Calendar,
    ChevronRight,
    Clock,
    Heart,
    LoaderIcon,
    Package,
    ShoppingCart,
    TrendingUp
} from 'lucide-react';
import Link from 'next/link';

// Quick Links Component for Dashboard
const QuickLinks = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link
            href="/products"
            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm 
        border border-gray-200 hover:border-primary/60 transition-colors"
        >
            <span className="text-gray-900 font-medium">Browse Products</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>
        <Link
            href="/cart"
            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm 
        border border-gray-200 hover:border-primary/60 transition-colors"
        >
            <span className="text-gray-900 font-medium">View Cart</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>
        <Link
            href="/auth/wishlist"
            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm 
        border border-gray-200 hover:border-primary/60 transition-colors"
        >
            <span className="text-gray-900 font-medium">My Wishlist</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>
    </div>
);

const DashboardHome = () => {
    const { user } = useAuth();
    const { data, loading: dashboardLoading } = useDashboard();
    const { orders, loading: ordersLoading } = useOrders({ limit: 5 });
    const { activities, loading: activitiesLoading } = useActivity({ limit: 5 });

    if (dashboardLoading || ordersLoading || activitiesLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoaderIcon className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }
    const metrics = [
        {
            title: 'Total Orders',
            value: '12',
            change: '+2 this month',
            trend: 'up',
            icon: Package,
            color: 'bg-blue-500'
        },
        {
            title: 'Wishlist Items',
            value: '8',
            change: '3 new items',
            trend: 'up',
            icon: Heart,
            color: 'bg-red-500'
        },
        {
            title: 'Cart Items',
            value: '2',
            change: 'Items worth $299',
            trend: 'neutral',
            icon: ShoppingCart,
            color: 'bg-green-500'
        },
        {
            title: 'Total Spent',
            value: '$1,299',
            change: '+$299 this month',
            trend: 'up',
            icon: TrendingUp,
            color: 'bg-purple-500'
        }
    ];

    const recentOrders = [
        {
            id: '1',
            product: 'Premium Fragrance',
            date: '2024-01-05',
            status: 'delivered',
            amount: 299.99
        },
        {
            id: '2',
            product: 'Luxury Perfume Set',
            date: '2024-01-03',
            status: 'processing',
            amount: 499.99
        }
    ];

    return (
        <div className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric) => (
                    <motion.div
                        key={metric.title}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${metric.color} p-3 rounded-xl text-white`}>
                                <metric.icon className="w-6 h-6" />
                            </div>
                            <span className={`flex items-center gap-1 text-sm ${metric.trend === 'up' ? 'text-green-600' :
                                    metric.trend === 'down' ? 'text-red-600' :
                                        'text-gray-600'
                                }`}>
                                {metric.trend === 'up' && <ArrowUpRight className="w-4 h-4" />}
                                {metric.trend === 'down' && <ArrowDownRight className="w-4 h-4" />}
                                {metric.change}
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
                        <p className="text-gray-600 mt-1">{metric.title}</p>
                    </motion.div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
                            <Link href="/auth/dashboard/orders" className="text-primary hover:text-primary/80 
                text-sm flex items-center gap-1">
                                View All
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-4 
                  bg-gray-50 rounded-lg">
                                    <div>
                                        <h3 className="font-medium text-gray-900">{order.product}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-500">
                                                {new Date(order.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-medium text-gray-900">${order.amount}</span>
                                        <div className={`text-sm mt-1 ${order.status === 'delivered' ? 'text-green-600' :
                                                order.status === 'processing' ? 'text-blue-600' :
                                                    'text-gray-600'
                                            }`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Activity Timeline */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="font-semibold text-gray-900">Recent Activity</h2>
                    </div>
                    <div className="p-6">
                        <div className="relative">
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                            <div className="space-y-6">
                                {[
                                    { action: 'Order Delivered', time: '2 days ago', details: 'Premium Fragrance' },
                                    { action: 'Added to Wishlist', time: '3 days ago', details: 'Luxury Perfume Set' },
                                    { action: 'Profile Updated', time: '1 week ago', details: 'Changed shipping address' }
                                ].map((activity, index) => (
                                    <div key={index} className="relative pl-8">
                                        <div className="absolute left-2 top-2 w-4 h-4 rounded-full border-2 border-primary 
                      bg-white" />
                                        <div>
                                            <h4 className="font-medium text-gray-900">{activity.action}</h4>
                                            <p className="text-sm text-gray-500 mt-1">{activity.details}</p>
                                            <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                                <Clock className="w-3 h-3" />
                                                {activity.time}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;