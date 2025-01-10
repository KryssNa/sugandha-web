// src/components/checkout/ConfirmationPage.tsx
import { OrderSummary } from "@/components/shared/types/checkout";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Mail,
  MapPin,
  Package,
  Phone,
  PrinterIcon,
  Share2,
} from "lucide-react";
import { OrderAndShippingDetails } from "./detailCard";
import { useAppDispatch } from "@/store/hooks";
import { resetCheckout } from "@/store/slices/checkoutSlice";
import { useRouter } from "next/navigation";



interface ConfirmationPageProps {
  formData: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    phone: string;
    paymentMethod: "credit-card" | "khalti" | "esewa";
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  } ;
  orderSummary: OrderSummary;
  orderNumber: string;
  onBackStep: () => void;
  currentStep: number;
}

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
                ${
                  step.status === "completed"
                    ? "bg-green-500"
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

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({
  formData,
  orderSummary,
  orderNumber,
  currentStep,
  onBackStep,

}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const orderSteps: OrderStep[] = [
    {
      title: "Order Confirmed",
      date: "Just now",
      status: "completed",
    },
    {
      title: "Processing Order",
      date: "Estimated: Today",
      status: "current",
    },
    {
      title: "Shipping",
      date: "Estimated: Tomorrow",
      status: "upcoming",
    },
    {
      title: "Delivery",
      date: "Estimated: In 2-3 days",
      status: "upcoming",
    },
  ];

  const orderActions = [
    { icon: <Mail />, label: "Email Order" },
    { icon: <Download />, label: "Download PDF" },
    { icon: <PrinterIcon />, label: "Print Order" },
    { icon: <Share2 />, label: "Share Order" },
  ];

  const handleContinueShopping = () => {
    dispatch(resetCheckout());
    router.push('/shop'); // Adjust the route as needed
  };

  return (
    <div className="space-y-8">
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
          className="inline-flex items-center justify-center w-24 h-24 bg-green-100 
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
          <CheckCircle className="w-12 h-12 text-green-500" />
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
        formData={formData}
        orderNumber={orderNumber}
        orderSummary={orderSummary}
      />

{/* Timeline Section */}
<motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Order Timeline</h2>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              Estimated Delivery:{" "}
              {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </span>
          </div>
        </div>
        <OrderTimeline steps={orderSteps} />
      </motion.div>

      {/* Order Items Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Order Items</h2>
          <span className="text-sm text-gray-600">
            Total Items: {orderSummary.items.reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        </div>
        <div className="space-y-4">
          <AnimatePresence>
            {orderSummary.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg
                    hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 
                      rounded-full flex items-center justify-center text-white text-xs">
                    {item.quantity}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    Unit Price: ${item.price.toFixed(2)}
                  </p>
                </div>
                <p className="font-medium text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Quick Actions */}
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
            className="flex flex-col items-center p-6 bg-white rounded-xl border 
                border-gray-200 shadow-sm hover:shadow-md transition-all duration-200
                hover:border-orange-200"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-50 
                rounded-full flex items-center justify-center mb-3">
              <div className="w-6 h-6 text-orange-500">{action.icon}</div>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {action.label}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Footer Actions */}
      <div className="flex justify-center pt-8 border-t border-gray-200">
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
  );
};

export default ConfirmationPage;