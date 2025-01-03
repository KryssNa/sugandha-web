import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, CreditCard, Package, Truck } from "lucide-react";
import { JSX } from "react";

interface ProgressStepsProps {
  step: number;
}

interface StepConfig {
  label: string;
  icon: JSX.Element;
  description: string;
  color: string;
}

export const ProgressSteps = ({ step }: ProgressStepsProps) => {
  const steps: StepConfig[] = [
    {
      label: "Shipping",
      icon: <Truck className='w-6 h-6' />,
      description: "Delivery details",
      color: "rgb(249, 115, 22)", // orange-500
    },
    {
      label: "Payment",
      icon: <CreditCard className='w-6 h-6' />,
      description: "Payment method",
      color: "rgb(249, 115, 22)",
    },
    {
      label: "Confirmation",
      icon: <Package className='w-6 h-6' />,
      description: "Order complete",
      color: "rgb(249, 115, 22)",
    },
  ];

  return (
    <motion.div
      className='mb-12 bg-gradient-to-b from-white to-gray-50 rounded-xl p-8 shadow-sm border border-gray-100'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='relative'>
        <div className='flex justify-between items-center'>
          {steps.map(({ label, icon, description, color }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className='flex flex-col items-center relative z-10 group'
            >
              <motion.div
                className={`relative w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center
                  transition-all duration-300 cursor-pointer
                  ${
                    step > index + 1
                      ? "border-orange-500 bg-orange-500"
                      : step === index + 1
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 bg-white"
                  }
                  group-hover:shadow-lg group-hover:scale-105`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={step > index + 1 ? "completed" : "current"}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                    className={`${
                      step > index + 1
                        ? "text-white"
                        : step === index + 1
                        ? "text-orange-500"
                        : "text-gray-400"
                    }`}
                  >
                    {step > index + 1 ? (
                      <CheckCircle className='w-8 h-8' />
                    ) : (
                      icon
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Pulse Effect for Current Step */}
                {step === index + 1 && (
                  <motion.div
                    className='absolute inset-0 rounded-full border-4 border-orange-500'
                    initial={{ opacity: 0.5, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.2 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                )}

                <motion.div
                  className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 
                    bg-white text-xs font-bold w-6 h-6 rounded-full border-2 
                    flex items-center justify-center
                    ${
                      step > index + 1
                        ? "border-green/20 bg-green/border-green/20 text-blue-950"
                        : step === index + 1
                        ? "border-green/20 text-green/border-green/20"
                        : "border-gray-200 text-gray-400"
                    }`}
                >
                  {index + 1}
                </motion.div>
              </motion.div>

              <div className='mt-4 text-center'>
                <span
                  className={`block text-sm font-bold mb-1
                    ${step >= index + 1 ? "text-orange-500" : "text-gray-400"}`}
                >
                  {label}
                </span>
                <span className='text-xs text-gray-500'>{description}</span>
              </div>

              {/* Hover Tooltip */}
              <motion.div
                className='absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 
                  text-white px-3 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100
                  transition-opacity duration-200'
                initial={{ scale: 0.8 }}
                whileHover={{ scale: 1 }}
              >
                {step > index + 1
                  ? "Completed"
                  : step === index + 1
                  ? "Current Step"
                  : "Upcoming"}
                <div
                  className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 
                  border-t-4 border-l-4 border-r-4 border-transparent border-t-gray-800'
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Progress Line */}
        <div className='absolute top-10 left-0 right-0'>
          <div className='h-1 bg-gray-200 rounded-full'>
            <motion.div
              className='h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full'
              initial={{ width: "0%" }}
              animate={{ width: `${(step - 1) * 50}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
