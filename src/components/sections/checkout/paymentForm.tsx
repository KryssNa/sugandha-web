// components/checkout/PaymentForm.tsx
import CustomInput from "@/components/shared/input/customInput";
import { CheckoutFormData } from "@/components/shared/types/checkout";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Banknote,
  CheckCircle,
  CreditCard,
  Info,
  Shield,
  Wallet,
} from "lucide-react";
import React from "react";

interface PaymentFormProps {
  formData: CheckoutFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onBackStep: () => void;
  orderTotal: number;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  formData,
  handleInputChange,
  handleSubmit,
  onBackStep,
  orderTotal,
}) => {
  const paymentMethods = [
    {
      id: "credit-card",
      label: "Credit Card",
      icon: <CreditCard className='w-6 h-6' />,
      description: "Pay securely with your credit card",
    },
    {
      id: "khalti",
      label: "Khalti",
      icon: <Wallet className='w-6 h-6' />,
      description: "Pay using Khalti digital wallet",
      color: "#5C2D91",
    },
    {
      id: "esewa",
      label: "eSewa",
      icon: <Wallet className='w-6 h-6' />,
      description: "Quick payment with eSewa",
      color: "#60BB46",
    },
    {
      id: "cash-on-delivery",
      label: "Cash on Delivery",
      icon: <Banknote className='w-6 h-6' />,
      description: "Pay when you receive your order",
      color: "#2563EB", // blue-600
      badge: "Extra charge applies",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Navigation Header */}
        <div className='flex items-center justify-between mb-6'>
          <motion.button
            type='button'
            whileHover={{ scale: 1.02, x: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBackStep}
            className='flex items-center text-gray-600 hover:text-orange-500 
              transition-colors group'
          >
            <ArrowLeft className='w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform' />
            <span>Back to Shipping</span>
          </motion.button>

          <div className='bg-gray-100 px-4 py-2 rounded-lg'>
            <span className='text-sm text-gray-600'>Total Amount: </span>
            <span className='font-semibold text-orange-500'>
              Rs{orderTotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Header Section */}
        <div className='bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl'>
          <h2 className='text-2xl font-bold text-gray-900'>Payment Method</h2>
          <p className='text-gray-600 text-sm mt-1'>
            Choose your preferred payment method
          </p>
          <div
            className='mt-4 flex items-center text-sm text-orange-600 bg-white 
            rounded-lg p-3 border border-orange-200'
          >
            <AlertCircle className='w-4 h-4 mr-2' />
            Your personal and payment information is protected
          </div>
        </div>

        {/* Payment Methods */}
        <div className='space-y-4 mt-6'>
          {paymentMethods.map((method) => (
            <motion.label
              key={method.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`flex items-center p-6 border-2 rounded-xl cursor-pointer 
                transition-all duration-200 relative overflow-hidden
                ${formData.paymentMethod === method.id
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 hover:border-orange-200"
                }`}
            >
              {/* Selected Background Effect */}
              {formData.paymentMethod === method.id && (
                <motion.div
                  className='absolute inset-0 bg-orange-500 opacity-5'
                  initial={{ scale: 0 }}
                  animate={{ scale: 20 }}
                  transition={{ duration: 0.5 }}
                />
              )}

              <input
                type='radio'
                name='paymentMethod'
                value={method.id}
                checked={formData.paymentMethod === method.id}
                onChange={handleInputChange}
                className='w-5 h-5 text-orange-500 border-gray-300 focus:ring-orange-500'
                placeholder='paymentMethod'
              />

              <div className='ml-6 flex items-center flex-1 relative z-10'>
                <div
                  className='w-12 h-12 rounded-lg flex items-center justify-center 
                    transition-transform duration-200 transform group-hover:scale-110'
                  style={{
                    backgroundColor: method.color || "rgb(255, 237, 213)",
                  }}
                >
                  <div
                    className={method.color ? "text-white" : "text-orange-500"}
                  >
                    {method.icon}
                  </div>
                </div>
                <div className='ml-4'>
                  <p className='text-base font-semibold text-gray-900'>
                    {method.label}
                  </p>
                  <p className='text-sm text-gray-500 mt-1'>
                    {method.description}
                  </p>
                </div>
              </div>

              {formData.paymentMethod === method.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className='w-6 h-6 bg-orange-500 rounded-full flex items-center 
                    justify-center ml-4 relative z-10'
                >
                  <CheckCircle className='w-4 h-4 text-white' />
                </motion.div>
              )}
            </motion.label>
          ))}
        </div>

        {/* Payment Details */}
        <AnimatePresence mode='wait'>
          {formData.paymentMethod === "credit-card" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className='space-y-6 bg-white p-6 rounded-xl border border-gray-200 mt-6'
            >
              <div className='space-y-4'>
                <CustomInput
                  label='Card Number'
                  name='cardNumber'
                  value={formData.cardNumber || ""}
                  onChange={handleInputChange}
                  placeholder='1234 5678 9012 3456'
                  required
                />
                <div className='grid grid-cols-2 gap-4'>
                  <CustomInput
                    label='Expiry Date'
                    name='expiryDate'
                    value={formData.expiryDate || ""}
                    onChange={handleInputChange}
                    placeholder='MM/YY'
                    required
                  />
                  <CustomInput
                    label='CVV'
                    name='cvv'
                    value={formData.cvv || ""}
                    onChange={handleInputChange}
                    placeholder='123'
                    required
                  />
                </div>
              </div>

              <div className='flex items-center bg-blue-50 p-4 rounded-lg'>
                <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                  <Shield className='w-5 h-5 text-blue-500' />
                </div>
                <p className='ml-4 text-sm text-blue-700'>
                  Your payment information is encrypted and secure. We never
                  store your credit card details.
                </p>
              </div>
            </motion.div>
          )}

          {formData.paymentMethod === "khalti" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className='bg-purple-50 p-6 rounded-xl border border-purple-100 mt-6'
            >
              <div className='flex items-center'>
                <div className='w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center'>
                  <Wallet className='w-5 h-5 text-purple-500' />
                </div>
                <p className='ml-4 text-sm text-purple-700'>
                  You will be redirected to Khalti to complete your payment
                  securely.
                </p>
              </div>
            </motion.div>
          )}

          {formData.paymentMethod === "esewa" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className='bg-green-50 p-6 rounded-xl border border-green-100 mt-6'
            >
              <div className='flex items-center'>
                <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center'>
                  <Wallet className='w-5 h-5 text-green-500' />
                </div>
                <p className='ml-4 text-sm text-green-700'>
                  You will be redirected to eSewa to complete your payment
                  securely.
                </p>
              </div>
            </motion.div>
          )}

          {formData.paymentMethod === "cash-on-delivery" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className='space-y-6 bg-blue-50 p-6 rounded-xl border border-blue-100 mt-6'
            >
              <div className='flex items-center space-x-4'>
                <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                  <Info className='w-5 h-5 text-blue-500' />
                </div>
                <div className='flex-1'>
                  <h3 className='font-medium text-blue-800'>
                    Cash on Delivery Details
                  </h3>
                  <p className='text-sm text-blue-600 mt-1'>
                    Please have the exact amount ready at the time of delivery
                  </p>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg'>
                <div className='flex items-center space-x-3'>
                  <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                    <Banknote className='w-4 h-4 text-blue-500' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-900'>
                      COD Charge
                    </p>
                    <p className='text-xs text-gray-500'>Additional NPR 50</p>
                  </div>
                </div>

                <div className='flex items-center space-x-3'>
                  <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                    <Shield className='w-4 h-4 text-blue-500' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-900'>
                      Secure Delivery
                    </p>
                    <p className='text-xs text-gray-500'>
                      Verified delivery partners
                    </p>
                  </div>
                </div>
              </div>

              <div className='bg-white p-4 rounded-lg'>
                <h4 className='font-medium text-gray-900 mb-2'>
                  Important Notes:
                </h4>
                <ul className='space-y-2 text-sm text-gray-600'>
                  <li className='flex items-start space-x-2'>
                    <div className='w-1 h-1 bg-gray-400 rounded-full mt-2' />
                    <span>
                      Our delivery partner will call you before delivery
                    </span>
                  </li>
                  <li className='flex items-start space-x-2'>
                    <div className='w-1 h-1 bg-gray-400 rounded-full mt-2' />
                    <span>
                      Please ensure someone is available at the delivery address
                    </span>
                  </li>
                  <li className='flex items-start space-x-2'>
                    <div className='w-1 h-1 bg-gray-400 rounded-full mt-2' />
                    <span>
                      Cash payments only - no cards accepted on delivery
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className='flex items-center justify-between pt-6'>
          <motion.button
            type='button'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBackStep}
            className='text-gray-600 hover:text-orange-500 transition-colors px-6 py-3'
          >
            <span className='flex items-center'>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Previous Step
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type='submit'
            className='bg-gradient-to-r from-orange-500 to-orange-600 text-white 
              py-4 px-8 rounded-xl hover:from-orange-600 hover:to-orange-700 
              transition-all duration-200 font-medium flex items-center justify-center 
              space-x-2 shadow-lg shadow-orange-200'
          >
            <span>Complete Order</span>
            <ArrowRight size={18} />
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};
