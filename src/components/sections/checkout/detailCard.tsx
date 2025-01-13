// components/checkout/DetailCard.tsx
import { motion } from "framer-motion";
import {
  AlertCircle,
  Banknote,
  Building,
  Calendar,
  CircleDollarSign,
  CreditCard,
  Edit,
  Info,
  Mail,
  MapPin,
  Phone,
  Receipt,
} from "lucide-react";

// More robust type definitions
interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state?: string;
  country?: string;
  postalCode: string;
}

interface OrderSummary {
  total: number;
  subtotal?: number;
  shipping?: number;
  tax?: number;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface PaymentDetails {
  method: 'credit-card' | 'khalti' | 'esewa' | 'cash-on-delivery';
  cardDetails?: {
    lastFourDigits?: string;
  };
}

interface OrderAndShippingDetailsProps {
  shippingAddress: ShippingAddress;
  paymentDetails: PaymentDetails;
  orderNumber: string;
  orderSummary: OrderSummary;
  onEditAddress?: () => void;
}

export const OrderAndShippingDetails: React.FC<OrderAndShippingDetailsProps> = ({
  shippingAddress,
  paymentDetails,
  orderNumber,
  orderSummary,
  onEditAddress
}) => {
  // Calculate COD charge
  const isCashOnDelivery = paymentDetails.method === "cash-on-delivery";
  const COD_CHARGE = 50; // NPR 50 for COD
  const totalWithCOD = isCashOnDelivery
    ? orderSummary.total + COD_CHARGE
    : orderSummary.total;

  // Payment method icons mapping
  const paymentMethodIcons = {
    'credit-card': <CreditCard className='w-4 h-4 text-gray-400' />,
    'khalti': <Banknote className='w-4 h-4 text-purple-500' />,
    'esewa': <Banknote className='w-4 h-4 text-green-500' />,
    'cash-on-delivery': <Banknote className='w-4 h-4 text-blue-500' />
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
      {/* Order Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300'
      >
        <div className='flex items-center mb-4'>
          <div className='w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center'>
            <Receipt className='w-5 h-5 text-orange-500' />
          </div>
          <h2 className='text-xl font-bold text-gray-900 ml-3'>Order Details</h2>
        </div>

        <div className='space-y-4'>
          {/* Order Number */}
          <div className='flex justify-between items-center pb-4 border-b border-gray-100'>
            <span className='text-gray-600'>Order Number</span>
            <span className='font-mono bg-gray-100 px-3 py-1 rounded'>
              {orderNumber}
            </span>
          </div>

          {/* Order Date */}
          <div className='flex justify-between items-center pb-4 border-b border-gray-100'>
            <span className='text-gray-600'>Order Date</span>
            <div className='flex items-center space-x-2'>
              <Calendar className='w-4 h-4 text-gray-400' />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className='flex justify-between items-center pb-4 border-b border-gray-100'>
            <span className='text-gray-600'>Payment Method</span>
            <div className='flex items-center space-x-2'>
              {paymentMethodIcons[paymentDetails.method]}
              <span className='capitalize'>
                {paymentDetails.method.replace("-", " ")}
              </span>
            </div>
          </div>

          {/* COD Charge (if applicable) */}
          {isCashOnDelivery && (
            <div className='flex justify-between items-center pb-4 border-b border-gray-100'>
              <span className='text-gray-600'>COD Charge</span>
              <div className='flex items-center space-x-2 text-blue-500'>
                <Info className='w-4 h-4' />
                <span>NPR {COD_CHARGE.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Total Amount */}
          <div className='flex justify-between items-center'>
            <span className='text-gray-600'>Total Amount</span>
            <div className='flex items-center space-x-2 text-orange-500'>
              <CircleDollarSign className='w-5 h-5' />
              <span className='text-lg font-bold'>
                ${totalWithCOD.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* COD Instructions */}
        {isCashOnDelivery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100'
          >
            <h3 className='font-medium text-blue-800 flex items-center mb-2'>
              <Info className='w-4 h-4 mr-2' />
              Cash on Delivery Instructions
            </h3>
            <ul className='space-y-2 text-sm text-blue-600'>
              <li className='flex items-start space-x-2'>
                <div className='w-1 h-1 bg-blue-400 rounded-full mt-2' />
                <span>Please keep exact change ready: ${totalWithCOD.toFixed(2)}</span>
              </li>
              <li className='flex items-start space-x-2'>
                <div className='w-1 h-1 bg-blue-400 rounded-full mt-2' />
                <span>Our delivery partner will call before arrival</span>
              </li>
              <li className='flex items-start space-x-2'>
                <div className='w-1 h-1 bg-blue-400 rounded-full mt-2' />
                <span>Cash payments only - cards not accepted on delivery</span>
              </li>
            </ul>
          </motion.div>
        )}
      </motion.div>

      {/* Shipping Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300'
      >
        <div className='flex items-center mb-4'>
          <div className='w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center'>
            <Building className='w-5 h-5 text-orange-500' />
          </div>
          <h2 className='text-xl font-bold text-gray-900 ml-3'>Shipping Details</h2>
        </div>

        <div className='space-y-6'>
          {/* Shipping Address */}
          <div className='flex items-start space-x-3 bg-gray-50 p-4 rounded-lg'>
            <MapPin className='w-5 h-5 text-gray-400 mt-1' />
            <div className='flex-1'>
              <div className='flex items-center justify-between'>
                <p className='font-medium text-gray-900'>
                  {shippingAddress.firstName} {shippingAddress.lastName}
                </p>
                {onEditAddress && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onEditAddress}
                    className='text-orange-500 hover:text-orange-600'
                  >
                    <Edit className='w-4 h-4' />
                  </motion.button>
                )}
              </div>
              <p className='text-gray-600 mt-1'>{shippingAddress.address}</p>
              <p className='text-gray-600'>
                {shippingAddress.city}, {shippingAddress.postalCode}
                {shippingAddress.state && `, ${shippingAddress.state}`}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className='space-y-3'>
            <div className='flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200'>
              <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                <Phone className='w-4 h-4 text-blue-500' />
              </div>
              <div>
                <p className='text-sm text-gray-500'>Phone Number</p>
                <p className='text-gray-600 font-medium'>{shippingAddress.phone}</p>
              </div>
            </div>

            <div className='flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200'>
              <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
                <Mail className='w-4 h-4 text-green-500' />
              </div>
              <div>
                <p className='text-sm text-gray-500'>Email Address</p>
                <p className='text-gray-600 font-medium'>{shippingAddress.email}</p>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className='space-y-3'>
            <div className='text-sm text-gray-500 bg-orange-50 p-3 rounded-lg border border-orange-100'>
              <div className='flex items-center mb-2'>
                <AlertCircle className='w-4 h-4 text-orange-500 mr-2' />
                <span className='font-medium text-orange-700'>
                  Delivery Information
                </span>
              </div>
              <p>Estimated delivery time: 2-3 business days</p>
              {isCashOnDelivery && (
                <p className='mt-2 text-orange-600'>
                  *Delivery partner will contact you for payment collection
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};