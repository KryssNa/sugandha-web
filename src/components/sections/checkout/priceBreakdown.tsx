
import React from 'react';
import {motion} from 'framer-motion';
import { Shield } from 'lucide-react';

// components/checkout/PriceBreakdown.jsx
interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export const PriceBreakdown = ({ orderSummary }: { orderSummary: OrderSummary }) => (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-medium">Rs{orderSummary.subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Shipping</span>
        <span className="font-medium">Rs{orderSummary.shipping.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Tax</span>
        <span className="font-medium">Rs{orderSummary.tax.toFixed(2)}</span>
      </div>
      <motion.div
        className="flex justify-between items-center font-bold text-lg border-t border-dashed border-gray-200 pt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span>Total</span>
        <div className="flex items-center space-x-2">
          <span className="text-orange-500">Rs{orderSummary.total.toFixed(2)}</span>
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center"
          >
            <Shield className="w-3 h-3 text-orange-500" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
  