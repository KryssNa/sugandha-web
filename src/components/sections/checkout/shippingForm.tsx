import CustomInput from "@/components/shared/input/customInput";
import { motion } from "framer-motion";
import { ArrowRight, Info } from "lucide-react";
import React, { FormEvent } from "react";

interface ShippingFormProps {
  formData: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    saveInfo?: boolean;
    specialNotes?: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleSubmit: (e: FormEvent) => void;
}

export const ShippingForm: React.FC<ShippingFormProps> = ({
  formData,
  handleInputChange,
  handleSubmit,
}) => {
  // Country options - can be expanded
  const countries = [
    { code: "NP", name: "Nepal" },
    { code: "IN", name: "India" },
    { code: "US", name: "United States" },
    // Add more countries as needed
  ];

  // Nepal states
  const states = [
    "Bagmati",
    "Gandaki",
    "Karnali",
    "Lumbini",
    "Province 1",
    "Province 2",
    "Sudurpashchim",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className='space-y-8'>
        {/* Header Section */}
        <div className='bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl'>
          <h2 className='text-2xl font-bold text-gray-900'>
            Shipping Information
          </h2>
          <p className='text-gray-600 text-sm mt-2'>
            Please enter your shipping details for delivery
          </p>
        </div>

        {/* Contact Information */}
        <div className='bg-white p-6 rounded-xl border border-gray-200 space-y-6'>
          <h3 className='text-lg font-semibold text-gray-900'>
            Contact Information
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <CustomInput
              label='Email Address'
              type='email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder='your@email.com'
              tooltipText="We'll send order updates to this email"
            />
            <CustomInput
              label='Phone Number'
              type='tel'
              name='phone'
              value={formData.phone}
              onChange={handleInputChange}
              required
              placeholder='+977 98XXXXXXXX'
              tooltipText='For delivery coordination'
            />
          </div>
        </div>

        {/* Personal Information */}
        <div className='bg-white p-6 rounded-xl border border-gray-200 space-y-6'>
          <h3 className='text-lg font-semibold text-gray-900'>
            Personal Information
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <CustomInput
              label='First Name'
              name='firstName'
              value={formData.firstName}
              onChange={handleInputChange}
              required
              placeholder='John'
            />
            <CustomInput
              label='Last Name'
              name='lastName'
              value={formData.lastName}
              onChange={handleInputChange}
              required
              placeholder='Doe'
            />
            <div className='md:col-span-2'>
              <CustomInput
                label='Company Name (Optional)'
                name='companyName'
                value={formData.companyName || ""}
                onChange={handleInputChange}
                placeholder='Your Company Ltd.'
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className='bg-white p-6 rounded-xl border border-gray-200 space-y-6'>
          <h3 className='text-lg font-semibold text-gray-900'>
            Delivery Address
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='md:col-span-2'>
              <CustomInput
                label='Street Address'
                name='address'
                value={formData.address}
                onChange={handleInputChange}
                required
                placeholder='123 Street Name'
              />
            </div>
            <div className='md:col-span-2'>
              <CustomInput
                label='Apartment, suite, unit, etc. (Optional)'
                name='apartment'
                value={formData.apartment || ""}
                onChange={handleInputChange}
                placeholder='Apartment 4B'
              />
            </div>
            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Country/Region
              </label>
              <select
                name='country'
                value={formData.country}
                onChange={handleInputChange}
                required
                className='w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none 
                  focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200'
                title='Select your country'
              >
                <option value=''>Select Country</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <CustomInput
              label='City'
              name='city'
              value={formData.city}
              onChange={handleInputChange}
              required
              placeholder='Your City'
            />
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                State/Province
              </label>
              <select
                name='state'
                value={formData.state}
                onChange={handleInputChange}
                required
                className='w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none 
                  focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200'
                title='Select your state'
              >
                <option value=''>Select State</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <CustomInput
              label='Postal Code'
              name='postalCode'
              value={formData.postalCode}
              onChange={handleInputChange}
              required
              placeholder='44600'
            />
          </div>
        </div>

        {/* Additional Information */}
        <div className='bg-white p-6 rounded-xl border border-gray-200 space-y-6'>
          <h3 className='text-lg font-semibold text-gray-900'>
            Additional Information
          </h3>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Special Notes (Optional)
              </label>
              <textarea
                name='specialNotes'
                value={formData.specialNotes}
                onChange={handleInputChange}
                rows={3}
                placeholder='Any special instructions for delivery'
                className='w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none 
                  focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200'
              />
            </div>
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                name='saveInfo'
                checked={formData.saveInfo}
                onChange={(e) =>
                  handleInputChange({
                    target: { name: "saveInfo", value: e.target.checked },
                  } as any)
                }
                placeholder='Save this information for next time'
                className='w-4 h-4 text-orange-500 border-gray-300 rounded 
                  focus:ring-orange-500'
              />
              <label className='text-sm text-gray-600'>
                Save this information for next time
              </label>
            </div>
          </div>
        </div>

        {/* Information Notice */}
        <div className='bg-blue-50 p-4 rounded-lg flex items-start space-x-3'>
          <Info className='w-5 h-5 text-blue-500 mt-0.5' />
          <p className='text-sm text-blue-700'>
            Your personal data will be used to process your order, support your
            experience throughout this website, and for other purposes described
            in our privacy policy.
          </p>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type='submit'
          className='w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 
            rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 
            font-medium flex items-center justify-center space-x-2 shadow-lg shadow-orange-200'
        >
          <span>Continue to Payment</span>
          <ArrowRight size={18} />
        </motion.button>
      </form>
    </motion.div>
  );
};
