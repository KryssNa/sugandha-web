"use client"
import { OrderService } from '@/services/order.service';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  FileText,
  Filter,
  MapPin,
  Package,
  Search,
  Truck,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface TrackingUpdate {
  status: string;
  location: string;
  timestamp: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  totalAmount: number;
  items: OrderItem[];
  tracking?: {
    number: string;
    status: string;
    estimatedDelivery: string;
    updates: TrackingUpdate[];
  };
  paymentMethod: string;
  shippingAddress: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
}

const OrderCard = ({ order, onClick }: { order: Order; onClick: () => void }) => {
  const getStatusDetails = (status: Order['status']) => {
    switch (status) {
      case 'processing':
        return {
          color: 'bg-yellow-100 text-yellow-700',
          icon: Clock,
          text: 'Processing'
        };
      case 'shipped':
        return {
          color: 'bg-blue-100 text-blue-700',
          icon: Truck,
          text: 'Shipped'
        };
      case 'delivered':
        return {
          color: 'bg-green-100 text-green-700',
          icon: CheckCircle,
          text: 'Delivered'
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-700',
          icon: AlertCircle,
          text: 'Cancelled'
        };
    }
  };

  const statusDetails = getStatusDetails(order.status);
  const StatusIcon = statusDetails?.icon;

  return (
    <motion.div
      layoutId={`order-${order.id}`}
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-6 cursor-pointer 
        hover:border-orange-500 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">#{order.orderNumber}</h3>
              <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDetails?.color}`}>
                <span className="flex items-center gap-1">
                  {StatusIcon && <StatusIcon className="w-3 h-3" />}
                  {statusDetails?.text}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{new Date(order.date).toLocaleDateString()}</span>
              <span className="text-gray-300">•</span>
              <span>{order.items.length} items</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="block font-semibold text-gray-900">Rs{order.totalAmount.toFixed(2)}</span>
            <span className="text-sm text-gray-500">{order.paymentMethod}</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          {order.items.map((item) => (
            <div key={item.id} className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover"
                crossOrigin="anonymous"
              />
              {item.quantity > 1 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white 
                  text-xs rounded-full flex items-center justify-center">
                  {item.quantity}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const OrdersPage = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await OrderService.getUserOrders();

      if (response.success) {
        setLoading(false);
        setOrders(response.data.orders.orders);
        setTotalOrders(response.data.orders.total);
        setLoading(false);
      };
      setLoading(false);

    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchQuery ?
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (loading) return <p>Loading...</p>;

  

  return (
    <div className="max-w-6xl mx-auto ">
      {/* Filters Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by number or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-orange-500 bg-white"
            >
              <option value="all">All Orders</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-orange-50 text-orange-500 rounded-lg hover:bg-orange-100 
                transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </motion.button>
          </div>
        </div>
      </div>
      {/* Empty State */ }
  {
    filteredOrders.length === 0 && (
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
            {searchQuery
              ? `No orders match "${searchQuery}"`
              : 'Try adjusting your search or filters'}
          </p>
        </motion.div>
      </div>
    )
  }
      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onClick={() => setSelectedOrder(order)}
          />
        ))}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setSelectedOrder(null)}
            />
            <motion.div
              layoutId={`order-${selectedOrder.id}`}
              className="fixed inset-y-0 inset-x-0 m-auto h-fit
  w-[95%] max-w-3xl bg-white rounded-xl shadow-xl z-50 overflow-y-auto max-h-[80vh] lg:max-h-[90vh] custom-scrollbar"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Order #{selectedOrder.orderNumber}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Order Progress */}
                {selectedOrder.tracking && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
                    <div className="relative">
                      <div className="absolute left-6 top-0 h-full w-0.5 bg-gray-200" />
                      <div className="space-y-6">
                        {selectedOrder.tracking.updates.map((update, index) => (
                          <div key={index} className="flex gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center 
                      ${index === 0 ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}>
                              {index === 0 ? <Truck className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{update.status}</p>
                              <p className="text-sm text-gray-500">{update.location}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(update.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Shipping Details */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">Delivery Address</p>
                        <p className="text-gray-600">{selectedOrder.shippingAddress.street}</p>
                        <p className="text-gray-600">
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}
                        </p>
                        <p className="text-gray-600">{selectedOrder.shippingAddress.country}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                          crossOrigin="anonymous"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Quantity: {item.quantity} × Rs{item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            Rs{(item.quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-200 pt-4 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-900">Rs{selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">Rs{selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 flex items-center gap-2 text-gray-700 border border-gray-200 
                  rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Download Invoice</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 flex items-center gap-2 bg-orange-500 text-white 
                  rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Track Order</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersPage;