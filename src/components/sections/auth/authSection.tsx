"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";

// Security badge component
const SecurityBadge: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className='absolute top-4 right-4 flex items-center gap-2 bg-green-50 
      text-green-700 px-3 py-1 rounded-full text-sm'
  >
    <svg
      className='w-4 h-4'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
      />
    </svg>
    <span>Secure Connection</span>
  </motion.div>
);

// Enhanced Auth Layout Component
export const AuthLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className='min-h-screen py-16 md:py-24 xl:py-32 bg-gradient-to-br from-orange-50 
      to-orange-100 flex items-center justify-center p-4'
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className='w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl 
          shadow-xl overflow-hidden relative'
      >
        <SecurityBadge />

        {/* Brand Section */}
        <div
          className='hidden lg:flex flex-col items-center justify-center bg-orange-400/10 p-12 
          text-white relative overflow-hidden'
        >
          <motion.div
            className='absolute inset-0 bg-gradient-to-br from-orange-400/5 to-orange-600/5'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />

          <motion.div
            className='relative z-10'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src='/assets/logo/logo.png'
              alt='Brand Logo'
              width={400}
              height={60}
              className='mb-8 filter drop-shadow-lg'
            />

            <h2 className='text-3xl font-bold mb-4 text-center text-gray-800'>
              Welcome to Sugandha
            </h2>

            <p className='text-gray-600 text-center max-w-md'>
              Discover the finest fragrances and create your perfect scent
              journey with us.
            </p>

            {/* Decorative Elements */}
            <motion.div
              className='absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t 
                from-orange-100/10 to-transparent'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            />
          </motion.div>
        </div>

        {/* Content Section */}
        <div className='flex flex-col justify-center p-8 lg:p-12 relative'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='relative z-10'
          >
            {children}
          </motion.div>

          {/* Background Pattern */}
          <div className='absolute inset-0 z-0 opacity-5'>
            <div className='absolute inset-0 bg-gradient-to-br from-orange-200 to-orange-100' />
            <div
              className='absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] 
              bg-[length:20px_20px]'
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
