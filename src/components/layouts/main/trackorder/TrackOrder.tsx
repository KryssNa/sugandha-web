"use client"
import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  Search, 
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

// Types
interface OrderTrackingStep {
  title: string;
  description: string;
  date: string;
  completed: boolean;
}

interface OrderTrackingData {
  orderNumber: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  estimatedDelivery: string;
  currentLocation?: string;
  trackingSteps: OrderTrackingStep[];
}

// Utility function for status colors
const getStatusColor = (status: OrderTrackingData['status']) => {
  switch (status) {
    case 'processing': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'shipped': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'delivered': return 'text-green/40 bg-green/5 border-green/80';
    case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
  }
};

// Mock tracking data service (replace with actual API call)
const fetchOrderTracking = async (orderNumber: string): Promise<OrderTrackingData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Validation
  if (!/^[A-Z0-9]{6,10}$/.test(orderNumber)) {
    throw new Error('Invalid order number format');
  }

  // Mock tracking data
  return {
    orderNumber,
    status: 'shipped',
    estimatedDelivery: '25 Jan 2024',
    currentLocation: 'In Transit - Mumbai Sorting Center',
    trackingSteps: [
      {
        title: 'Order Placed',
        description: 'Your order has been successfully placed',
        date: '20 Jan 2024, 10:30 AM',
        completed: true
      },
      {
        title: 'Order Processing',
        description: 'Your order is being prepared',
        date: '21 Jan 2024, 2:15 PM',
        completed: true
      },
      {
        title: 'Shipped',
        description: 'Order has left our warehouse',
        date: '22 Jan 2024, 9:45 AM',
        completed: true
      },
      {
        title: 'In Transit',
        description: 'Order is on its way to you',
        date: '23 Jan 2024, 3:20 PM',
        completed: true
      },
      {
        title: 'Out for Delivery',
        description: 'Your package is near your location',
        date: '25 Jan 2024, 7:00 AM',
        completed: false
      },
      {
        title: 'Delivered',
        description: 'Package will be delivered to you',
        date: 'Expected 25 Jan 2024',
        completed: false
      }
    ]
  };
};

interface TrackOrderPageProps {
  orderNumbers?: string;
}

const TrackOrderPage: React.FC<TrackOrderPageProps> = ({ orderNumbers }) => {
  const [orderNumber, setOrderNumber] = useState(orderNumbers || '');
  const [orderTracking, setOrderTracking] = useState<OrderTrackingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // start tracking order if order number is provided
  React.useEffect(() => {
    if (orderNumbers) {
      handleTrackOrder({
        preventDefault: () => {},
        stopPropagation: () => {},
        currentTarget: null,
        target: null,
        nativeEvent: new Event('submit'),
        isDefaultPrevented: () => false,
        isPropagationStopped: () => false,
        persist: () => {}
      } as unknown as FormEvent);
    }
  }, [orderNumbers]);

  const handleTrackOrder = async (e: FormEvent) => {
    e.preventDefault();
    
    // Reset previous state
    setOrderTracking(null);
    setError(null);

    // Validate input
    if (!orderNumber.trim()) {
      setError('Please enter an order number');
      return;
    }

    setIsLoading(true);

    try {
      const trackingData = await fetchOrderTracking(orderNumber);
      setOrderTracking(trackingData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to track order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-xl rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center">
                  <Package className="w-7 h-7 mr-3" />
                  Order Tracking
                </h1>
                <p className="text-white/80 mt-2">
                  Track your Sugandha order in real-time
                </p>
              </div>
              <Truck className="w-12 h-12 text-white/20" />
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleTrackOrder} className="p-6">
            <div className="relative">
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                placeholder="Enter Order Number (e.g., SG12345)"
                maxLength={10}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-orange-500 
                  focus:border-transparent transition duration-300"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <button
                type="submit"
                disabled={isLoading}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 
                  px-4 py-2 rounded-lg transition-colors ${
                    isLoading 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
              >
                {isLoading ? 'Tracking...' : 'Track'}
              </button>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-center"
                >
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Order Tracking Details */}
          <AnimatePresence>
            {orderTracking && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-6"
              >
                {/* Order Status Summary */}
                <div className="mb-6">
                  <div 
                    className={`inline-flex items-center px-4 py-2 rounded-full border ${getStatusColor(orderTracking.status)}`}
                  >
                    <Truck className="w-5 h-5 mr-2" />
                    <span className="font-medium capitalize">
                      {orderTracking.status}
                    </span>
                  </div>
                  
                  <div className="mt-4 space-y-2 text-gray-700">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-orange-500" />
                      <span>{orderTracking.currentLocation}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-orange-500" />
                      <span>
                        Estimated Delivery: {orderTracking.estimatedDelivery}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tracking Timeline */}
                <div className="relative pl-6 border-l-2 border-gray-200">
                  {orderTracking.trackingSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className={`mb-6 pl-6 relative ${
                        step.completed ? 'opacity-100' : 'opacity-50'
                      }`}
                    >
                      {/* Timeline Dot */}
                      <div 
                        className={`absolute left-[-26px] top-0 w-4 h-4 rounded-full border-4 
                          ${step.completed 
                            ? 'bg-green/50 border-green/80' 
                            : 'bg-gray-300 border-gray-200'
                          }`}
                      />
                      
                      {/* Step Content */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          {step.title}
                          {step.completed && (
                            <CheckCircle className="w-4 h-4 ml-2 text-green/50" />
                          )}
                        </h3>
                        <p className="text-gray-600">{step.description}</p>
                        <p className="text-sm text-gray-500 mt-1">{step.date}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Additional Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start text-blue-700">
                  <Info className="w-5 h-5 mr-3 flex-shrink-0 mt-1" />
                  <p className="text-sm">
                    Having trouble tracking your order? Contact our customer support 
                    at support@sugandha.com or call +91 9876 543210.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default TrackOrderPage;