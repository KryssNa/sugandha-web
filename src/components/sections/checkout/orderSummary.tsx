import { Product } from "@/components/shared/types/product.types";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Minus, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";



interface OrderSummaryItemProps {
  item: Product;
  index: number;
  onUpdateQuantity?: (id: string, newQuantity: number) => void;
  onRemove?: (id: string) => void;
  onSaveForLater?: (id: string) => void;
}

export const OrderSummaryItem: React.FC<OrderSummaryItemProps> = ({
  item,
  index,
  onUpdateQuantity,
  onRemove,
  onSaveForLater,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, item.quantity + change);
    if (item.id) {
      onUpdateQuantity?.(item.id, newQuantity);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden
        hover:shadow-md transition-all duration-300"
    >
      <div className="p-4">
        <div className="flex items-center space-x-4">
          {/* Product Image with Quantity Badge */}
          <motion.div
            className="relative w-24 h-24 group"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={item.thumbnail}
              alt={item.title}
              className="rounded-lg object-cover w-full h-full"
              crossOrigin="anonymous"
            />
            <motion.div
              className="absolute -top-2 -right-2 h-6 px-2 min-w-[24px] bg-orange-500 
                rounded-full flex items-center justify-center text-white text-xs font-medium
                shadow-lg shadow-orange-200"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
            >
              {item.quantity}
            </motion.div>

            {/* Stock Status */}
            {item.inStock ? (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2
                bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                In Stock
              </div>
            ) : (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2
                bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                Out of Stock
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900 hover:text-orange-500 
                  cursor-pointer transition-colors"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {item.title}
                </h4>
                {item.brand && (
                  <p className="text-sm text-gray-500">{item.brand}</p>
                )}
              </div>
              <p className="font-bold text-gray-900">
                Rs{(item.basePrice * item.quantity).toFixed(2)}
              </p>
            </div>

            {/* Price Per Unit */}
            <div className="mt-1 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Rs{item.basePrice.toFixed(2)} per unit
              </p>
            </div>

            {/* Quantity Controls */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleQuantityChange(-1)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center
                    hover:bg-orange-100 transition-colors"
                >
                  <Minus size={16} className="text-gray-600" />
                </motion.button>

                <span className="w-8 text-center font-medium">{item.quantity}</span>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleQuantityChange(1)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center
                    hover:bg-orange-100 transition-colors"
                >
                  <Plus size={16} className="text-gray-600" />
                </motion.button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => item.id && onSaveForLater?.(item.id)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center
                    hover:bg-pink-100 transition-colors"
                >
                  <Heart size={16} className="text-gray-600 hover:text-pink-500" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => item.id && onRemove?.(item.id)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center
                    hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} className="text-gray-600 hover:text-red-500" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Description */}
        <AnimatePresence>
          {showDetails && item.description && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 pt-4 border-t border-gray-100"
            >
              <p className="text-sm text-gray-600">{item.description}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtotal Bar on Hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-gray-50 p-3 border-t border-gray-100"
          >
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Subtotal ({item.quantity} items):</span>
              <span className="font-bold text-orange-500">
                Rs{(item.basePrice * item.quantity).toFixed(2)}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};