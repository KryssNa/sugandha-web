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

const DetailCard = ({ title, icon: Icon, children }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2 }}
    className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm 
      hover:shadow-md transition-all duration-300'
  >
    <div className='flex items-center mb-4'>
      <div className='w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center'>
        <Icon className='w-5 h-5 text-orange-500' />
      </div>
      <h2 className='text-xl font-bold text-gray-900 ml-3'>{title}</h2>
    </div>
    {children}
  </motion.div>
);

const DetailRow = ({ label, value, divider = true }) => (
  <div
    className={`flex justify-between items-center ${
      divider ? "pb-4 border-b border-gray-100" : ""
    }`}
  >
    <span className='text-gray-600'>{label}</span>
    <span className='font-medium text-gray-900'>{value}</span>
  </div>
);

export const OrderAndShippingDetails = ({
  formData,
  orderNumber,
  orderSummary,
}) => {
  const isCashOnDelivery = formData.paymentMethod === "cash-on-delivery";
  const codCharge = 50; // NPR 50 for COD
  const totalWithCOD = isCashOnDelivery
    ? orderSummary.total + codCharge
    : orderSummary.total;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
      {/* Order Details Card */}
      <DetailCard title='Order Details' icon={Receipt}>
        <div className='space-y-4'>
          <DetailRow
            label='Order Number'
            value={
              <div className='flex items-center'>
                <span className='font-mono bg-gray-100 px-3 py-1 rounded'>
                  {orderNumber}
                </span>
              </div>
            }
          />
          <DetailRow
            label='Order Date'
            value={
              <div className='flex items-center space-x-2'>
                <Calendar className='w-4 h-4 text-gray-400' />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            }
          />
          <DetailRow
            label='Payment Method'
            value={
              <div className='flex items-center space-x-2'>
                {isCashOnDelivery ? (
                  <Banknote className='w-4 h-4 text-blue-500' />
                ) : (
                  <CreditCard className='w-4 h-4 text-gray-400' />
                )}
                <span className='capitalize'>
                  {formData.paymentMethod.replace("-", " ")}
                </span>
              </div>
            }
          />
          {isCashOnDelivery && (
            <DetailRow
              label='COD Charge'
              value={
                <div className='flex items-center space-x-2 text-blue-500'>
                  <Info className='w-4 h-4' />
                  <span>NPR {codCharge.toFixed(2)}</span>
                </div>
              }
            />
          )}
          <DetailRow
            label='Total Amount'
            value={
              <div className='flex items-center space-x-2 text-orange-500'>
                <CircleDollarSign className='w-5 h-5' />
                <span className='text-lg font-bold'>
                  ${totalWithCOD.toFixed(2)}
                </span>
              </div>
            }
            divider={false}
          />
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
                <span>
                  Please keep exact change ready: ${totalWithCOD.toFixed(2)}
                </span>
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
      </DetailCard>

      {/* Shipping Details Card */}
      <DetailCard title='Shipping Details' icon={Building}>
        <div className='space-y-6'>
          {/* Address Section */}
          <div className='flex items-start space-x-3 bg-gray-50 p-4 rounded-lg'>
            <MapPin className='w-5 h-5 text-gray-400 mt-1' />
            <div className='flex-1'>
              <div className='flex items-center justify-between'>
                <p className='font-medium text-gray-900'>
                  {formData.firstName} {formData.lastName}
                </p>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className='text-orange-500 hover:text-orange-600'
                >
                  <Edit className='w-4 h-4' />
                </motion.button>
              </div>
              <p className='text-gray-600 mt-1'>{formData.address}</p>
              <p className='text-gray-600'>
                {formData.city}, {formData.postalCode}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className='space-y-3'>
            <div
              className='flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg 
              transition-colors duration-200'
            >
              <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                <Phone className='w-4 h-4 text-blue-500' />
              </div>
              <div>
                <p className='text-sm text-gray-500'>Phone Number</p>
                <p className='text-gray-600 font-medium'>{formData.phone}</p>
              </div>
            </div>

            <div
              className='flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg 
              transition-colors duration-200'
            >
              <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
                <Mail className='w-4 h-4 text-green-500' />
              </div>
              <div>
                <p className='text-sm text-gray-500'>Email Address</p>
                <p className='text-gray-600 font-medium'>{formData.email}</p>
              </div>
            </div>
          </div>

          {/* Delivery Note with COD Info */}
          <div className='space-y-3'>
            <div
              className='text-sm text-gray-500 bg-orange-50 p-3 rounded-lg border 
              border-orange-100'
            >
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
      </DetailCard>
    </div>
  );
};
