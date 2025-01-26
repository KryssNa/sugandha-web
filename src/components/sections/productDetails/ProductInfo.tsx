import { Product } from '@/components/shared/types/product.types';
import { useAppDispatch } from '@/store/hooks';
import { addItemToCart } from '@/store/slices/cartSlice';
import { motion } from 'framer-motion';
import { Heart, MessagesSquareIcon, Shield, ShoppingBasket, ShoppingCart, Timer, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
    const [timeLeft] = useState({
        hours: 6,
        minutes: 12,
        seconds: 11,
    });
    const handleWhatsApp = () => {
        //redirect to whatsapp with product details
        const url = `https://wa.me/9864836697?text=I%20want%20to%20buy%20${product.title}%20from%20your%20store.%20Please%20let%20me%20know%20more%20details.`;
        window.open(url, '_blank');
    }

    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleBuyNow = async () => {
        // redirect to checkout page with product details
        await dispatch(addItemToCart({
            product: product,
            productId: product.id as string,
            quantity: 1
        }));
        // Save cart state to local storage or backend here if needed
        router.push('/checkout');
    }
    return (
        <div className="lg:w-1/2 space-y-6">
            {/* Product Title and Rating */}
            <div>
                {/* Special Offer Timer */}
                <div className=" bg-gradient-to-r from-orange-500 to-orange-600 
          rounded-lg p-3 text-white flex items-center justify-between">
                    <span className="font-medium">Special Offer</span>
                    <div className="flex gap-2">
                        <Timer className="w-5 h-5" />
                        <span>{`${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`}</span>
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <motion.svg
                                key={i}
                                whileHover={{ scale: 1.2 }}
                                className={`w-5 h-5 ${i < Math.floor(product?.rating?.average ?? 0)
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
                            {product.rating ? product.rating.average.toFixed(1) : 'N/A'} ({product.reviews?.length ?? 0} reviews)
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
                        Rs{product.basePrice}
                    </span>
                    {product.originalPrice > product.basePrice && (
                        <span className="text-lg text-gray-500 line-through">
                            Rs{product.originalPrice}
                        </span>
                    )}
                </div>
                {(product.discountPercentage ?? 0) > 0 && (
                    <span className="px-2.5 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                        {product.discountPercentage}% OFF
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
                <div className="py-4 w-full flex max-sm:flex-col gap-2">
                    <button
                        onClick={handleBuyNow}
                        className="flex-1 w-full flex items-center justify-center px-6 py-3 
                      bg-orange-500 text-white rounded-lg hover:bg-orange-600 
                      transition-colors space-x-2"
                    >
                        <ShoppingBasket className="w-5 h-5" />
                        <span>Buy Now</span>
                    </button>
                    <button
                        onClick={handleWhatsApp}
                        className="flex-1 w-full flex items-center justify-center px-6 py-3 
                      bg-[#3acb3e] text-white rounded-lg hover:bg-[#248027] 
                      transition-colors space-x-2"
                    >
                        <MessagesSquareIcon className="w-5 h-5" />
                        <span>WhatsApp Now</span>
                    </button>

                </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-200 py-6">
                <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-orange-500" />
                    <div>
                        <p className="text-sm font-medium">Free Shipping</p>
                        <p className="text-xs text-gray-500">Orders over Rs5000</p>
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