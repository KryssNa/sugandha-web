import { Product } from '@/components/shared/types/productTypes';
import { motion } from 'framer-motion';
import { Heart, Shield, ShoppingCart, Truck } from 'lucide-react';

interface ProductInfoProps {
    product: Product;
    quantity: number;
    isInWishlist: boolean;
    onQuantityChange: (type: "increase" | "decrease") => void;
    onAddToCart: () => void;
    onToggleWishlist: () => void;
}

const ProductInfo = ({
    product,
    quantity,
    isInWishlist,
    onQuantityChange,
    onAddToCart,
    onToggleWishlist
}: ProductInfoProps) => {
    return (
        <div className="lg:w-1/2 space-y-6">
            {/* Product Title and Rating */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <motion.svg
                                key={i}
                                whileHover={{ scale: 1.2 }}
                                className={`w-5 h-5 ${i < Math.floor(product.rating.average)
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </motion.svg>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                            {product.rating.average.toFixed(1)} ({product.reviews.length} reviews)
                        </span>
                    </div>
                    <span className="text-sm text-gray-500">|</span>
                    <span className="text-sm text-gray-600">SKU: {product.sku}</span>
                </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                        ${product.basePrice}
                    </span>
                    {product.originalPrice > product.basePrice && (
                        <span className="text-lg text-gray-500 line-through">
                            ${product.originalPrice}
                        </span>
                    )}
                </div>
                {product.discount > 0 && (
                    <span className="px-2.5 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                        {product.discount}% OFF
                    </span>
                )}
            </div>

            {/* Stock and Quantity */}
            <div className="space-y-4">
                <p className="text-sm text-gray-600">
                    Stock: {product.quantity} units available
                </p>
                <div className="flex items-center gap-4">
                    <label className="text-sm text-gray-600">Quantity:</label>
                    <div className="flex items-center border border-gray-200 rounded-lg">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onQuantityChange("decrease")}
                            className="p-2 hover:bg-gray-100 transition-colors"
                        >
                            -
                        </motion.button>
                        <span className="px-4 py-2 border-x border-gray-200">
                            {quantity}
                        </span>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onQuantityChange("increase")}
                            className="p-2 hover:bg-gray-100 transition-colors"
                        >
                            +
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onAddToCart}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 
              text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onToggleWishlist}
                        className={`flex items-center justify-center gap-2 px-6 py-3 border-2 
              rounded-lg transition-colors ${isInWishlist
                                ? "border-red-500 text-red-500 hover:bg-red-50"
                                : "border-orange-500 text-orange-500 hover:bg-orange-50"
                            }`}
                    >
                        <Heart className="w-5 h-5" fill={isInWishlist ? "currentColor" : "none"} />
                        {isInWishlist ? "Remove" : "Wishlist"}
                    </motion.button>
                </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-200 py-6">
                <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-orange-500" />
                    <div>
                        <p className="text-sm font-medium">Free Shipping</p>
                        <p className="text-xs text-gray-500">Orders over $500</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-orange-500" />
                    <div>
                        <p className="text-sm font-medium">Secure Payment</p>
                        <p className="text-xs text-gray-500">100% Protected</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductInfo;