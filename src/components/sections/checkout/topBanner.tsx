import { motion } from "framer-motion";
import { Gift } from "lucide-react";

// components/checkout/TopBanner.jsx
export const TopBanner = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className='bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-6 mb-8'
  >
    <div className='flex items-center justify-between'>
      <div className='flex items-center space-x-4'>
        <div className='bg-white p-2 rounded-full'>
          <Gift className='w-6 h-6 text-orange-500' />
        </div>
        <div>
          <h3 className='text-gray-800 font-medium'>Save on your order</h3>
          <p className='text-sm text-gray-600'>
            Have a coupon?{" "}
            <button className='text-orange-500 font-medium hover:underline'>
              Click here to enter your code
            </button>
          </p>
        </div>
      </div>
      <div className='hidden md:block'>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className='bg-white px-6 py-2 rounded-lg text-gray-700 font-medium shadow-sm hover:shadow-md
              transition-all duration-200 border border-orange-200'
        >
          Apply Coupon
        </motion.button>
      </div>
    </div>
  </motion.div>
);
