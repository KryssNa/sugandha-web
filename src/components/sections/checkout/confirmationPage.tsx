"use client"
// src/components/checkout/ConfirmationPage.tsx
import { OrderService, useOrderConfirmation } from "@/services/order.service";
import { useAppDispatch } from "@/store/hooks";
import { resetCheckout } from "@/store/slices/checkoutSlice";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Loader2,
  Mail,
  Package,
  PrinterIcon,
  Share2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { OrderAndShippingDetails } from "./detailCard";


interface OrderStep {
  title: string;
  date: string;
  status: "completed" | "current" | "upcoming";
}

const OrderTimeline: React.FC<{ steps: OrderStep[] }> = ({ steps }) => (
  <div className="relative">
    <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200" />
    {steps.map((step, index) => (
      <motion.div
        key={step.title}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.2 }}
        className="flex items-start mb-8 last:mb-0 relative"
      >
        <div className="flex items-center">
          <motion.div
            className={`w-8 h-8 rounded-full flex items-center justify-center z-10
                ${step.status === "completed"
                ? "bg-primaryLight"
                : step.status === "current"
                  ? "bg-orange-500"
                  : "bg-gray-200"
              }`}
            whileHover={{ scale: 1.1 }}
          >
            {step.status === "completed" ? (
              <CheckCircle className="w-5 h-5 text-white" />
            ) : step.status === "current" ? (
              <Clock className="w-5 h-5 text-white" />
            ) : (
              <Package className="w-5 h-5 text-gray-400" />
            )}
          </motion.div>
        </div>
        <div className="ml-6">
          <div className="flex items-center">
            <p className="font-medium text-gray-900">{step.title}</p>
            {step.status === "current" && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full"
              >
                In Progress
              </motion.span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">{step.date}</p>
          {step.status === "current" && (
            <div className="mt-2 text-sm text-gray-600 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Estimated completion time: 2-3 hours
            </div>
          )}
        </div>
      </motion.div>
    ))}
  </div>
);

const ConfirmationPage: React.FC<{ orderId: string }> = ({ orderId }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { orderDetails, loading, error } = useOrderConfirmation(orderId);
  console.log("orderDetails", orderDetails);

  // Determine order steps based on current status
  const orderSteps: OrderStep[] = useMemo(() => {
    if (!orderDetails?.order) return [];

    const statusMap: Record<string, OrderStep['status']> = {
      'pending': 'current',
      'processing': 'current',
      'shipped': 'upcoming',
      'delivered': 'completed',
      'paid': 'completed'
    };

    return [
      {
        title: "Order Confirmed",
        date: new Date(orderDetails.order.createdAt).toLocaleString(),
        status: orderDetails.order.status === 'pending' ? 'completed' : 'completed'
      },
      {
        title: "Processing Order",
        date: "Estimated: Today",
        status: orderDetails.order.status === 'processing' ? 'current' :
          orderDetails.order.status === 'pending' ? 'upcoming' : 'completed'
      },
      {
        title: "Shipping",
        date: "Estimated: Tomorrow",
        status: orderDetails.order.status === 'shipped' ? 'current' :
          ['processing', 'pending'].includes(orderDetails.order.status) ? 'upcoming' : 'completed'
      },
      {
        title: "Delivery",
        date: orderDetails.order.estimatedDelivery,
        status: orderDetails.order.status === 'delivered' ? 'completed' :
          ['shipped', 'processing', 'pending'].includes(orderDetails.order.status) ? 'upcoming' : 'upcoming'
      }
    ];
  }, [orderDetails]);

  // Handle order actions
  const handleDownloadInvoice = () => {
    if (orderId) {
      OrderService.downloadInvoice(orderId);
    }
  };

  const handleShareOrder = () => {
    if (orderId) {
      OrderService.shareOrder(orderId);
    }
  };

  const handleContinueShopping = () => {
    dispatch(resetCheckout());
    router.push('/products');
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-12 h-12 text-orange-500" />
      </div>
    );
  }

  // Error state
  if (error || !orderDetails) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Order Details Unavailable
        </h2>
        <p className="text-gray-600 mb-6">{error || 'Unable to retrieve order information'}</p>
        <button
          onClick={() => router.push('/orders')}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
        >
          View Orders
        </button>
      </div>
    );
  }


  const orderActions = [
    {
      icon: <Mail />,
      label: "Email Order",
      onClick: () => {
        if (orderDetails) {
          OrderService.emailOrderReceipt(orderDetails.order.id)
            .then(() => toast.success('Order receipt sent to email'))
            .catch(() => toast.error('Failed to send order receipt'));
        }
      }
    },
    {
      icon: <Download />,
      label: "Download PDF",
      onClick: handleDownloadInvoice // Already defined earlier in the component
    },
    {
      icon: <PrinterIcon />,
      label: "Print Order",
      onClick: () => {
        window.print(); // Browser's native print functionality
      }
    },
    {
      icon: <Share2 />,
      label: "Share Order",
      onClick: handleShareOrder // Already defined earlier in the component
    }
  ];


  return (
    <div className="flex justify-center">
      <div className="space-y-8 w-full max-w-7xl p-6">
        {/* Navigation Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="text-sm text-gray-500 flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Order Time: {new Date().toLocaleTimeString()}
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative"
        >
          <motion.div
            className="inline-flex items-center justify-center w-24 h-24 bg-secondaryLight 
              rounded-full mb-6 relative"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 1.5,
              times: [0, 0.5, 1],
              repeat: 0,
            }}
          >
            <CheckCircle className="w-12 h-12 text-[#e7eec2]" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Successfully Placed!
          </h1>
          <p className="text-gray-600">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>

          {/* Order Status Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-orange-50 border border-orange-100 rounded-lg p-4 flex items-center justify-center"
          >
            <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
            <p className="text-orange-700">
              Our team is preparing your order. Track your order status below.
            </p>
          </motion.div>
        </motion.div>

        {/* Order Information */}
        <OrderAndShippingDetails
          shippingAddress={{
            firstName: orderDetails.order.shippingAddress?.firstName,
            lastName: orderDetails.order.shippingAddress?.lastName,
            email: orderDetails.order.shippingAddress?.email,
            phone: orderDetails.order.shippingAddress?.phone,
            address: orderDetails.order.shippingAddress?.street,
            city: orderDetails.order.shippingAddress?.city,
            state: orderDetails.order.shippingAddress?.state,
            country: orderDetails.order.shippingAddress?.country,
            postalCode: orderDetails.order.shippingAddress?.postalCode
          }}
          paymentDetails={{
            method: orderDetails.order.paymentMethod,
            cardDetails: orderDetails.order.paymentMethod === 'credit-card'
              ? {
                lastFourDigits: orderDetails.cardDetails?.lastFourDigits
              }
              : undefined
          }}
          orderNumber={orderDetails.order.orderNumber}
          orderSummary={{
            items: orderDetails.order.items.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price
            })),
            total: orderDetails.order.totalAmount,
            subtotal: orderDetails.order.subtotal,
            shipping: orderDetails.order.shippingCost,
            tax: orderDetails.order.tax
          }}
          onEditAddress={() => {
            router.push(`/orders/${orderDetails.order.id}/edit-address`);
          }}
        />

        {/* Timeline Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm"
        >
          {/* Main header with estimated delivery */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                Estimated Delivery:{" "}
                {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Grid layout for items and timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-between">
            {/* Order Items Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              {orderDetails.order.items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden
            hover:shadow-md transition-all duration-300"
                >
                  <div className="p-4">
                    <div className="flex items-center space-x-4">
                      {/* Product Image with Quantity Badge */}
                      <motion.div
                        className="relative w-20 h-20 group"
                        whileHover={{ scale: 1.05 }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="rounded-lg object-cover w-full h-full"
                          crossOrigin="anonymous"
                        />
                        <motion.div
                          className="absolute -top-2 -right-2 h-6 px-2 min-w-[24px] bg-orange-500 
                    rounded-full flex items-center justify-center text-white text-xs font-medium
                    shadow-lg shadow-orange-200"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          whileHover={{ scale: 1.1 }}
                        >
                          {item.quantity}
                        </motion.div>
                      </motion.div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-900 hover:text-orange-500 
                    cursor-pointer transition-colors"
                          >
                            {item.name}
                          </h4>
                        </div>

                        <div className="mt-1 flex items-center justify-between">
                          <p className="text-sm text-gray-500">
                            Rs{item.price.toFixed(2)} per unit
                          </p>
                          <p className="font-bold text-gray-900">
                            Rs{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Timeline Section */}
            <div className="flex justify-end space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h3>
                <OrderTimeline steps={orderSteps} /></div>
            </div>
          </div>
        </motion.div>
        {/* Order Items Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >

          {orderActions.map((action, index) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.onClick}
              className="flex flex-col items-center p-6 bg-white rounded-xl border 
        border-gray-200 shadow-sm hover:shadow-md transition-all duration-200
        hover:border-orange-200 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-50 
        rounded-full flex items-center justify-center mb-3 group-hover:rotate-6 
        transition-transform duration-300">
                <div className="w-6 h-6 text-orange-500">{action.icon}</div>
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 
        transition-colors">
                {action.label}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Order Actions Section */}
        <div className="flex max-sm:flex-col items-center justify-between pt-8 border-t border-gray-200">
          {/* Track Order Button */}
          <motion.button
            whileHover={{ scale: 1.02, x: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(`/track-order/${orderDetails.order.orderNumber}`)}
            className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-orange-500 
      transition-colors duration-200 border border-orange-200 rounded-lg"
          >
            <Package className="w-5 h-5" />
            <span>Track Order</span>
          </motion.button>

          {/* Continue Shopping Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinueShopping}
            className="flex items-center px-8 py-4 bg-orange-500 text-white 
      rounded-lg hover:bg-orange-600 transition-colors duration-200
      shadow-lg shadow-orange-200"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="ml-2 w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;