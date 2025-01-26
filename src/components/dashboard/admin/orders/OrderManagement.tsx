// components/admin/orders/OrdersManagement.tsx
import { AnimatePresence, motion } from 'framer-motion';
import {
    CheckCircle,
    Clock,
    Download,
    Edit,
    Eye,
    Filter,
    Search,
    Trash2,
    XCircle
} from 'lucide-react';
import React, { useState } from 'react';

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

interface OrdersManagementProps {
    orders: Order[];
    loading: boolean;
    onViewOrder: (id: string) => void;
    onEditOrder: (id: string) => void;
    onDeleteOrder: (id: string) => void;
    onUpdateStatus: (id: string, status: Order['status']) => void;
}

const OrdersManagement: React.FC<OrdersManagementProps> = ({
    orders,
    loading,
    onViewOrder,
    onEditOrder,
    onDeleteOrder,
    onUpdateStatus,
}) => {
    console.log("orders", orders);
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<Order['status'] | 'all'>('all');

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            // order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });
    console.log("filteredOrders", filteredOrders);
    const handleSelectAll = (checked: boolean) => {
        setSelectedOrders(checked ? orders.map(order => order.id) : []);
    };

    const handleSelectOrder = (orderId: string, checked: boolean) => {
        setSelectedOrders(prev =>
            checked ? [...prev, orderId] : prev.filter(id => id !== orderId)
        );
    };

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'completed':
                return 'text-green-500 bg-green-50';
            case 'cancelled':
                return 'text-red-500 bg-red-50';
            case 'processing':
                return 'text-blue-500 bg-blue-50';
            default:
                return 'text-yellow-500 bg-yellow-50';
        }
    };

    const getStatusIcon = (status: Order['status']) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-4 h-4" />;
            case 'cancelled':
                return <XCircle className="w-4 h-4" />;
            case 'processing':
                return <Clock className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold text-gray-900">Orders</h2>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 
                text-gray-400 w-4 h-4" />
                        </div>
                        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 
              rounded-lg transition-colors">
                            <Filter className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 
              rounded-lg transition-colors">
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                <input
                                    type="checkbox"
                                    checked={selectedOrders.length === orders.length}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Order Number
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Products
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Date
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredOrders.map((order) => (
                            <motion.tr
                                key={order.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                layout
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        type="checkbox"
                                        checked={selectedOrders.includes(order.id)}
                                        onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                                        className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {order.orderNumber}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{`${order.user?.firstName ?? "Guest"} ${order.user?.lastName ?? ""}`}</div>
                                    <div className="text-sm text-gray-500">{order.user?.email ?? order.shippingAddress?.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${order.totalAmount.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        <span className="ml-1 capitalize">{order.status}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="relative inline-block text-left">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="p-2 text-gray-500 hover:text-gray-700 rounded-full 
                        hover:bg-gray-100 transition-colors"
                                            onClick={() => onViewOrder(order.id)}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="p-2 text-gray-500 hover:text-gray-700 rounded-full 
                        hover:bg-gray-100 transition-colors"
                                            onClick={() => onEditOrder(order.id)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="p-2 text-red-500 hover:text-red-700 rounded-full 
                        hover:bg-red-50 transition-colors"
                                            onClick={() => onDeleteOrder(order.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {filteredOrders.length === 0 && (
                <div className="p-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-sm mx-auto"
                    >
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex 
              items-center justify-center">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                            No orders found
                        </h3>
                        <p className="text-gray-500">
                            {searchTerm
                                ? `No orders match "${searchTerm}"`
                                : 'Try adjusting your search or filters'}
                        </p>
                    </motion.div>
                </div>
            )}

            {/* Loading State */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white bg-opacity-50 flex items-center 
              justify-center"
                    >
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full border-4 border-orange-500 
                border-t-transparent animate-spin" />
                            <p className="mt-4 text-sm text-gray-500">Loading orders...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Status Update Modal - Could be implemented as a separate component */}
            {/* <StatusUpdateModal
        isOpen={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={onUpdateStatus}
      /> */}
        </div>
    );
};

export default OrdersManagement;