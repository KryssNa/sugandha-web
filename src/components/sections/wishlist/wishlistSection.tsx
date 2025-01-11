"use client";

import { Product } from "@/components/shared/types/product.types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItemToCart } from "@/store/slices/cartSlice";
import { removeFromWishlist } from "@/store/slices/wishlistSlice";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";

const WishlistSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  // Handlers
  const handleRemoveFromWishlist = (id: string) => {
    dispatch(removeFromWishlist(id));
  };

  console.log("wishlist item", wishlistItems)

  const handleAddToCart = (item: Product) => {
    if (item.id) {
      dispatch(addItemToCart({ productId: item.id }));
    }
    dispatch(removeFromWishlist(item.id ? item.id : "")); // Optionally remove from wishlist after adding to cart
  };

  return (
    <div className="sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1280px] 2xl:max-w-[1500px] mx-auto p-6">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 border-b border-gray-200 bg-white text-lg font-bold">
          <div className="col-span-2 p-6">Delete</div>
          <div className="col-span-4 p-6">Product Name</div>
          <div className="col-span-2 p-6 text-center">Unit Price</div>
          <div className="col-span-2 p-6 text-center">Stock Status</div>
          <div className="col-span-2 p-6"></div>
        </div>

        {/* Wishlist Items */}
        <AnimatePresence>
          {wishlistItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-12 border-b border-gray-200"
            >
              {/* Delete Button */}
              <div className="col-span-2 p-6 flex items-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRemoveFromWishlist(item.id ? item.id : "")}
                  className="flex items-center gap-2 text-gray-500 hover:text-red-500 
                    transition-colors duration-200"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Remove</span>
                </motion.button>
              </div>

              {/* Product Info */}
              <div className="col-span-4 p-6">
                <div className="flex gap-4">
                  <div className="relative w-[150px] h-[150px] border border-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      unoptimized
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      className="object-contain p-4"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 font-semibold text-gray-900">
                          {item.rating ? item.rating.average.toFixed(1) : "N/A"}
                        </span>
                      </div>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-600">
                        {item.reviews ? item.reviews.length : 0} Reviews
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm 
                            rounded-lg"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="col-span-2 p-6 flex items-center justify-center">
                <span className="text-lg font-semibold text-gray-900">
                  Rs{item.basePrice.toFixed(2)}
                </span>
              </div>

              {/* Stock Status */}
              <div className="col-span-2 p-6 flex items-center justify-center">
                <span
                  className={`font-semibold ${item.inStock ? "text-green-600" : "text-red-500"
                    }`}
                >
                  {item.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {/* Add to Cart */}
              <div className="col-span-2 p-6 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAddToCart(item)}
                  disabled={!item.inStock}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg
                    ${item.inStock
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    } transition-colors duration-200`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {wishlistItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-12 text-center"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-600">
              Add items to your wishlist to keep track of products you love
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Loading state component
const WishlistSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="grid grid-cols-12 border-b border-gray-200 p-6">
              <div className="col-span-2">
                <div className="h-8 bg-gray-200 rounded w-24" />
              </div>
              <div className="col-span-4">
                <div className="h-[150px] bg-gray-200 rounded" />
              </div>
              <div className="col-span-2">
                <div className="h-8 bg-gray-200 rounded w-20 mx-auto" />
              </div>
              <div className="col-span-2">
                <div className="h-8 bg-gray-200 rounded w-20 mx-auto" />
              </div>
              <div className="col-span-2">
                <div className="h-12 bg-gray-200 rounded w-32 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { WishlistSkeleton };
export default WishlistSection;