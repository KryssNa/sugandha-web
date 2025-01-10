"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  removeFromCart,
  updateQuantity,
  setCouponCode,
  updateTotals,
} from "@/store/slices/cartSlice";
import { useRouter } from "next/navigation";

// Cart Item Component
const CartItem = ({ 
  item, 
  onUpdateQuantity, 
  onRemoveItem 
}: { 
  item: any; 
  onUpdateQuantity: (id: string, change: number) => void;
  onRemoveItem: (id: string) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -100 }}
    className="grid grid-cols-6 gap-4 p-4 border-b border-gray-200 items-center"
  >
    {/* Product Info */}
    <div className="col-span-3 flex gap-4">
      <button
        onClick={() => onRemoveItem(item.id)}
        className="p-2 hover:bg-red-50 rounded-full transition-colors"
        title="Remove Item"
      >
        <Trash2 className="w-5 h-5 text-red-500" />
      </button>

      <div className="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden">
        <Image
          src={item.thumbnail || '/api/placeholder/100/100'}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col">
        <h3 className="font-medium text-gray-900">{item.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-600">
              {item.rating.average.toFixed(1)}
            </span>
          </div>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-600">
            {item.reviews.length} Reviews
          </span>
        </div>
        <div className="flex gap-2 mt-2">
          {item.tags?.map((tag: string) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* Price */}
    <div className="text-center">${item.basePrice.toFixed(2)}</div>

    {/* Quantity */}
    <div className="flex items-center justify-center">
      <div className="flex border border-gray-200 rounded-lg">
        <button
          onClick={() => onUpdateQuantity(item.id, -1)}
          className="p-2 hover:bg-gray-100 transition-colors"
          title="Decrease Quantity"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="w-12 flex items-center justify-center border-x border-gray-200">
          {item.quantity}
        </div>
        <button
          onClick={() => onUpdateQuantity(item.id, 1)}
          className="p-2 hover:bg-gray-100 transition-colors"
          title="Increase Quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>

    {/* Subtotal */}
    <div className="text-right font-medium">
      ${((item.quantity || 1) * item.basePrice).toFixed(2)}
    </div>
  </motion.div>
);

// Cart Totals Component
const CartTotals = ({
  totals,
  onCheckout,
  disabled
}: {
  totals: any;
  onCheckout: () => void;
  disabled: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-lg border border-gray-200 p-6"
  >
    <h2 className="text-xl font-bold text-gray-900 mb-6">Cart Totals</h2>

    {/* Summary */}
    <div className="space-y-4 mb-6">
      <div className="flex justify-between py-3 bg-gray-50 px-4 rounded-lg">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-medium">
          ${totals.subtotal.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between py-3 bg-gray-50 px-4 rounded-lg">
        <span className="text-gray-600">Estimated Delivery</span>
        <span className="font-medium text-green-500">Free</span>
      </div>
      <div className="flex justify-between py-3 bg-gray-50 px-4 rounded-lg">
        <span className="text-gray-600">Estimated Tax</span>
        <span className="font-medium">${totals.tax.toFixed(2)}</span>
      </div>
    </div>

    {/* Total */}
    <div className="flex justify-between py-4 px-4 bg-gray-50 rounded-lg mb-6">
      <span className="text-lg font-semibold text-gray-900">Total</span>
      <span className="text-lg font-bold text-gray-900">
        ${totals.total.toFixed(2)}
      </span>
    </div>

    {/* Checkout Button */}
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onCheckout}
      className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 
        transition-colors duration-200 font-medium disabled:bg-gray-300 
        disabled:cursor-not-allowed"
      disabled={disabled}
    >
      Proceed to Checkout
    </motion.button>
  </motion.div>
);

// Main Cart Section Component
const CartSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { items: cartItems, couponCode, totals: cartTotals } = useAppSelector(
    (state) => state.cart
  );

  // Update totals whenever cart items change
  useEffect(() => {
    dispatch(updateTotals());
  }, [cartItems, dispatch]);

  // Handlers
  const handleUpdateQuantity = (id: string, change: number) => {
    dispatch(updateQuantity({ id, change }));
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleApplyCoupon = () => {
    // Add coupon logic here
    console.log("Applying coupon:", couponCode);
  };

  const handleProceedToCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-12 xl:px-24 2xl:px-32 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items Section */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-6 gap-4 p-4 border-b border-gray-200 bg-gray-50">
              <div className="col-span-3">Product</div>
              <div className="text-center">Price</div>
              <div className="text-center">Quantity</div>
              <div className="text-right">Subtotal</div>
            </div>

            {/* Cart Items */}
            <AnimatePresence>
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                />
              ))}
            </AnimatePresence>

            {/* Empty State */}
            {cartItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 text-center"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  Your cart is empty
                </h3>
                <p className="mt-1 text-gray-500">
                  Add some items to your cart to continue shopping
                </p>
              </motion.div>
            )}

            {/* Cart Actions */}
            <div className="p-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => dispatch(setCouponCode(e.target.value))}
                  placeholder="Coupon code"
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                    focus:ring-2 focus:ring-orange-500"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 
                    transition-colors duration-200"
                >
                  Apply Coupon
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cart Totals Section */}
        <div className="lg:w-1/3">
          <CartTotals
            totals={cartTotals}
            onCheckout={handleProceedToCheckout}
            disabled={cartItems.length === 0}
          />
        </div>
      </div>
    </div>
  );
};

export default CartSection;