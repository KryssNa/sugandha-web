// "use client";

// import React from "react";
// import { motion } from "framer-motion";
// import Link from "next/link";
// import Image from "next/image";
// import { Home, RefreshCcw, ArrowLeft } from "lucide-react";

// // Error Page
// interface ErrorPageProps {
//   error: Error;
//   reset: () => void;
// }

// export const ErrorPage: React.FC<ErrorPageProps> = ({ error, reset }) => {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="max-w-2xl w-full text-center space-y-8 relative"
//       >
//         {/* Background Decoration */}
//         <div className="absolute inset-0 -z-10">
//           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1)_1px,transparent_1px)] 
//             bg-[length:20px_20px]" />
//         </div>

//         {/* Error Icon */}
//         <motion.div
//           initial={{ scale: 0.5, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ delay: 0.2, duration: 0.5 }}
//           className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center"
//         >
//           <svg
//             className="w-12 h-12 text-red-500"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//             />
//           </svg>
//         </motion.div>

//         {/* Content */}
//         <div className="space-y-4 px-4">
//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="text-4xl md:text-5xl font-bold text-gray-900"
//           >
//             Oops! Something went wrong
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.4 }}
//             className="text-lg text-gray-600 max-w-md mx-auto"
//           >
//             {error.message || "We encountered an unexpected error. Please try again."}
//           </motion.p>

//           {/* Technical Details (only in development) */}
//           {process.env.NODE_ENV === 'development' && (
//             <motion.pre
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.5 }}
//               className="mt-4 p-4 bg-gray-100 rounded-lg text-left text-sm text-gray-700 
//                 overflow-auto max-h-40"
//             >
//               {error.stack}
//             </motion.pre>
//           )}
//         </div>

//         {/* Action Buttons */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5 }}
//           className="flex flex-col sm:flex-row gap-4 justify-center px-4"
//         >
//           <button
//             onClick={reset}
//             className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 
//               text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
//           >
//             <RefreshCcw className="w-5 h-5 mr-2" />
//             Try Again
//           </button>
//           <Link
//             href="/"
//             className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 
//               rounded-lg hover:bg-gray-50 transition-colors duration-200"
//           >
//             <Home className="w-5 h-5 mr-2" />
//             Back to Home
//           </Link>
//         </motion.div>

//         {/* Support Information */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.6 }}
//           className="text-sm text-gray-500"
//         >
//           <p>
//             If the problem persists, please contact our support at{" "}
//             <a href="mailto:support@example.com" className="text-orange-500 hover:text-orange-600">
//               support@example.com
//             </a>
//           </p>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };


"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Home, RefreshCcw, ArrowLeft } from "lucide-react";

// 404 Not Found Page
export const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center space-y-8 relative"
      >
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 -z-10 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at center, #FFA500 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />

        {/* 404 Text Animation */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative"
        >
          <div className="text-9xl font-bold text-orange-500/20">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl font-bold text-orange-500">Page Not Found</div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="space-y-4 px-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 max-w-md mx-auto"
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
          className="flex flex-col sm:flex-row gap-4 justify-center px-4"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 
              text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 
              rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Error Page
interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ error, reset }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center space-y-8 relative"
      >
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 -z-10 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at center, #EF4444 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center"
        >
          <svg
            className="w-12 h-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </motion.div>

        {/* Content */}
        <div className="space-y-4 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-gray-900"
          >
            Oops! Something went wrong
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 max-w-md mx-auto"
          >
            {error.message || "We encountered an unexpected error. Please try again."}
          </motion.p>

          {/* Technical Details (only in development) */}
          {process.env.NODE_ENV === 'development' && error.stack && (
            <motion.pre
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 p-4 bg-gray-100 rounded-lg text-left text-sm text-gray-700 
                overflow-auto max-h-40"
            >
              {error.stack}
            </motion.pre>
          )}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center px-4"
        >
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 
              text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
          >
            <RefreshCcw className="w-5 h-5 mr-2" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 
              rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </motion.div>

        {/* Support Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-gray-500"
        >
          <p>
            If the problem persists, please contact our support at{" "}
            <a href="mailto:support@example.com" className="text-orange-500 hover:text-orange-600">
              support@example.com
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};