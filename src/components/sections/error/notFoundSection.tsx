"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// 404 Not Found Page
export const NotFoundSection = () => {
  return (
    <div className='min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-2xl w-full text-center space-y-8 relative'
      >
        {/* Background Decoration */}
        <div className='absolute inset-0 -z-10'>
          <div
            className='absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,165,0,0.1)_1px,transparent_1px)] 
            bg-[length:20px_20px]'
          />
        </div>

        {/* 404 Image or Animation */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className='relative h-64 mx-auto'
        >
          {/* <Image
            src='/assets/images/404.svg'
            alt='404 Illustration'
            fill
            className='object-contain'
          /> */}
        </motion.div>

        {/* Content */}
        <div className='space-y-4 px-4'>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='text-4xl md:text-5xl font-bold text-gray-900'
          >
            Page Not Found
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className='text-lg text-gray-600 max-w-md mx-auto'
          >
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </motion.p>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className='flex flex-col sm:flex-row gap-4 justify-center px-4'
        >
          <Link
            href='/'
            className='inline-flex items-center justify-center px-6 py-3 bg-orange-500 
              text-white rounded-lg hover:bg-orange-600 transition-colors duration-200'
          >
            <Home className='w-5 h-5 mr-2' />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className='inline-flex items-center justify-center px-6 py-3 border border-gray-200 
              rounded-lg hover:bg-gray-50 transition-colors duration-200'
          >
            <ArrowLeft className='w-5 h-5 mr-2' />
            Go Back
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};
