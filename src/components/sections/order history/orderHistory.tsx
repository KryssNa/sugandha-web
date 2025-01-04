"use client";
import { CustomButton } from '@/components/shared/buttons/customButtons';
import CustomInput from '@/components/shared/input/customInput';
import { CustomSelect } from '@/components/shared/select/customSelect';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowUpDown,
    Calendar,
    CheckCircle,
    Clock,
    Download,
    Eye,
    Package,
    RefreshCw,
    Search,
    XCircle
} from 'lucide-react';
import React, { useState } from 'react';
import { Order } from './types';
import { PaginationExample } from '@/components/shared/pagination/customPagination';
import { TableExample } from '@/components/shared/customTable/customTable';



const Badge: React.FC<{
    variant: Order['status'];
    children: React.ReactNode;
}> = ({ variant, children }) => {
    const variantStyles = {
        processing: "bg-yellow-100 text-yellow-800 border-yellow-200",
        shipped: "bg-blue-100 text-blue-800 border-blue-200",
        delivered: "bg-green-100 text-green-800 border-green-200",
        cancelled: "bg-red-100 text-red-800 border-red-200"
    };

    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm border ${variantStyles[variant]}`}>
            {children}
        </span>
    );
};

// Mock data
const mockOrders: Order[] = [
    {
        id: "ORD-2024-001",
        date: "2024-01-01",
        status: "delivered",
        total: 229.99,
        items: [
            { name: "Product 1", quantity: 1, price: 99.99, image: "/api/placeholder/80/80" },
            { name: "Product 2", quantity: 1, price: 130.00, image: "/api/placeholder/80/80" }
        ],
        trackingNumber: "TRK123456789",
        estimatedDelivery: "2024-01-04"
    },
    {
        id: "ORD-2024-002",
        date: "2024-01-03",
        status: "processing",
        total: 159.99,
        items: [
            { name: "Product 3", quantity: 1, price: 159.99, image: "/api/placeholder/80/80" }
        ],
        estimatedDelivery: "2024-01-07"
    }
];

const OrderHistorySection: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>(mockOrders);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [dateSort, setDateSort] = useState<'asc' | 'desc'>('desc');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const getStatusIcon = (status: Order['status']) => {
        switch (status) {
            case 'processing':
                return <Clock className="w-4 h-4" />;
            case 'shipped':
                return <Package className="w-4 h-4" />;
            case 'delivered':
                return <CheckCircle className="w-4 h-4" />;
            case 'cancelled':
                return <XCircle className="w-4 h-4" />;
            default:
                return null;
        }
    };

    const filteredOrders = orders
        .filter(order => {
            const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateSort === 'asc' ? dateA - dateB : dateB - dateA;
        });

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    {/* <h1 className="text-2xl font-bold text-gray-900">Order History</h1> */}
                    <p className="text-gray-500">View and manage your previous orders</p>
                </div>

                <CustomButton
                    variant="outline"
                    onClick={() => setOrders(mockOrders)}
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Orders
                </CustomButton>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <CustomInput
                            name='search'
                            placeholder="Search orders..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <CustomSelect
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={[
                            { value: 'all', label: 'All Orders' },
                            { value: 'processing', label: 'Processing' },
                            { value: 'shipped', label: 'Shipped' },
                            { value: 'delivered', label: 'Delivered' },
                            { value: 'cancelled', label: 'Cancelled' }
                        ]}
                    />

                    <CustomButton
                        variant="outline"
                        onClick={() => setDateSort(prev => prev === 'asc' ? 'desc' : 'asc')}
                    >
                        <Calendar className="w-4 h-4 mr-2" />
                        Sort by Date
                        <ArrowUpDown className="w-4 h-4 ml-2" />
                    </CustomButton>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Order ID</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(order.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={order.status}>
                                            {getStatusIcon(order.status)}
                                            <span className="ml-1 capitalize">{order.status}</span>
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">${order.total.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <CustomButton
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                Details
                                            </CustomButton>

                                            <CustomButton
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Download className="w-4 h-4 mr-1" />
                                                Invoice
                                            </CustomButton>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                        onClick={() => setSelectedOrder(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                        title='Close'
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Order Info */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Order ID</p>
                                            <p className="font-medium">{selectedOrder.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Order Date</p>
                                            <p className="font-medium">
                                                {new Date(selectedOrder.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {selectedOrder.trackingNumber && (
                                            <div>
                                                <p className="text-sm text-gray-500">Tracking Number</p>
                                                <p className="font-medium">{selectedOrder.trackingNumber}</p>
                                            </div>
                                        )}
                                        {selectedOrder.estimatedDelivery && (
                                            <div>
                                                <p className="text-sm text-gray-500">Estimated Delivery</p>
                                                <p className="font-medium">
                                                    {new Date(selectedOrder.estimatedDelivery).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Order Items */}
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-3">Order Items</h3>
                                        <div className="space-y-3">
                                            {selectedOrder.items.map((item, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100
                            transition-colors duration-200"
                                                >
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-16 h-16 rounded-md object-cover"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-900 truncate">{item.name}</p>
                                                        <p className="text-sm text-gray-500">
                                                            Quantity: {item.quantity} × ${item.price.toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <p className="font-medium text-gray-900 whitespace-nowrap">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between items-center">
                                                <p className="text-gray-500">Subtotal</p>
                                                <p className="font-medium text-gray-900">
                                                    ${selectedOrder.total.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className="text-gray-500">Shipping</p>
                                                <p className="font-medium text-gray-900">Free</p>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                                <p className="font-medium text-gray-900">Total Amount</p>
                                                <p className="text-xl font-bold text-orange-500">
                                                    ${selectedOrder.total.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                                        <CustomButton
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => setSelectedOrder(null)}
                                        >
                                            Close
                                        </CustomButton>
                                        <CustomButton
                                            variant="primary"
                                            className="flex-1"
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Download Invoice
                                        </CustomButton>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Empty State */}
            {filteredOrders.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl border border-gray-200 p-12 text-center"
                >
                    <div className="max-w-md mx-auto">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No orders found
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {searchQuery || statusFilter !== 'all'
                                ? "Try adjusting your filters or search terms"
                                : "When you make a purchase, your orders will appear here"}
                        </p>
                        {(searchQuery || statusFilter !== 'all') && (
                            <CustomButton
                                variant="primary"
                                onClick={() => {
                                    setSearchQuery('');
                                    setStatusFilter('all');
                                }}
                            >
                                Clear Filters
                            </CustomButton>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Pagination */}
            {filteredOrders.length > 0 && (
                <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
                    <div className="flex flex-1 items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">1</span> to{' '}
                            <span className="font-medium">{filteredOrders.length}</span> of{' '}
                            <span className="font-medium">{orders.length}</span> orders
                        </div>
                        <div className="flex gap-2">
                            <CustomButton
                                variant="outline"
                                size="sm"
                                className="disabled:opacity-50"
                                disabled
                            >
                                Previous
                            </CustomButton>
                            <CustomButton
                                variant="outline"
                                size="sm"
                                className="disabled:opacity-50"
                                disabled
                            >
                                Next
                            </CustomButton>
                        </div>
                    </div>
                </div>
            )}
            <PaginationExample />
            <TableExample />
        </div>
    );
};

export default OrderHistorySection;