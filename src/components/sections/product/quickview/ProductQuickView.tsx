import { showToast } from '@/components/shared/toast/showAlet';
import { Product } from '@/components/shared/types/product.types';
import { RootState } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addItemToCart } from '@/store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '@/store/slices/wishlistSlice';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Heart,
    MessagesSquareIcon,
    Minus,
    Plus,
    ShoppingBasket,
    ShoppingCart,
    Star,
    X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface ProductQuickViewProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (product: Product, quantity: number, size: number) => void;
}

const ProductQuickView: React.FC<ProductQuickViewProps> = ({
    product,
    isOpen,
    onClose,
    onAddToCart
}) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(0);
    const dispatch = useAppDispatch();

    const wishlistItems = useAppSelector((state: RootState) => state.wishlist.items);
    const checkWishlist = (product: Product) => {
        return wishlistItems.some(item => item.id === product.id);
    }
    const handleToggleWishlist = ({ product }: { product: Product }) => {
        const isInWishlist = wishlistItems.some(item => item.id === product.id);
        if (isInWishlist) {
            if (product.id) {
                showToast("success", "Item removed from wishlist");
                dispatch(removeFromWishlist(product.id));
            }
        } else {
            showToast("success", "Item added to wishlist");
            dispatch(addToWishlist(product));
        }
    };


    const handleAddToCart = () => {
        onAddToCart(product, quantity, selectedSize);
    };
    const handleWhatsApp = () => {
        //redirect to whatsapp with product details
        const url = `https://wa.me/9864836697?text=I%20want%20to%20buy%20${product.title}%20from%20your%20store.%20Please%20let%20me%20know%20more%20details.`;
        window.open(url, '_blank');
    }
    const router = useRouter();

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

    const calculateDiscount = () => {
        if (product.originalPrice) {
            return Math.round(((product.originalPrice - product.basePrice) / product.originalPrice) * 100);
        }
        return 0;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full max-w-5xl mx-4 bg-white rounded-xl shadow-2xl grid grid-cols-1 md:grid-cols-2"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            <X className="w-6 h-6 text-gray-600" />
                        </button>

                        {/* Product Images */}
                        <div className="relative">
                            <button
                                onClick={() => handleToggleWishlist({ product })}
                                className="absolute right-8 top-8 text-gray-500 hover:text-red-500 transition-colors"
                            >
                                <Heart className="w-9 h-9" color='orange' fill={`${checkWishlist(product) ? "red" : "none"}`} />
                            </button>
                            <motion.img
                                key={product.images[selectedImage].id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                src={product.images[selectedImage].url}
                                alt={product.title}
                                className="w-full h-72 py-6 md:h-full object-cover rounded-l-xl"
                            />

                            {/* Image Thumbnails */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all 
                      ${selectedImage === index
                                                ? 'border-orange-500'
                                                : 'border-transparent hover:border-gray-300'}`}
                                    >
                                        <img
                                            src={image.url}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="p-6 md:p-8 flex flex-col justify-between">
                            <div>
                                {/* Product Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">{product.title}</h2>
                                        <p className="text-gray-600">{product.brand}</p>
                                    </div>
                                    <button className="text-gray-500 hover:text-red-500 transition-colors">
                                        <Heart className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center mb-4">
                                    <div className="flex text-yellow-400 mr-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-5 h-5 ${i < (product.rating?.average ?? 0) ? 'fill-current' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-gray-600 ml-2">({product.rating?.average}/5)</span>
                                </div>

                                {/* Description */}
                                <p className="text-gray-700 mb-4">{product.description}</p>

                                {/* Scent Notes */}
                                <div className="mb-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">Scent Notes</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.scentNotes && product.scentNotes.map((note, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                            >
                                                {note.notes.join(', ')} ({note.type})
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Price and Discount */}
                                <div className="mb-4 flex items-center">
                                    <span className="text-2xl font-bold text-orange-600">
                                        ₹{product.basePrice.toFixed(2)}
                                    </span>
                                    {product.originalPrice && (
                                        <>
                                            <span className="line-through text-gray-500 ml-3">
                                                ₹{product.originalPrice.toFixed(2)}
                                            </span>
                                            <span className="ml-3 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                                                {calculateDiscount()}% OFF
                                            </span>
                                        </>
                                    )}
                                </div>

                                {/* Size Selection */}
                                {/* <div className="mb-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">Size</h3>
                                    <div className="flex space-x-2">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-4 py-2 rounded-lg border transition-all ${selectedSize === size
                                                        ? 'bg-orange-500 text-white border-orange-500'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                                                    }`}
                                            >
                                                {size} ml
                                            </button>
                                        ))}
                                    </div>
                                </div> */}

                                {/* Quantity and Add to Cart */}
                                <div className="flex flex-col items-center">
                                    <div className="flex max-sm:flex-col w-full gap-2">
                                        <div className="flex  w-full sm:w-1/2 gap-4">
                                            <div className="flex items-center border rounded-lg gap-2">
                                                <button
                                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                    className="p-2 text-gray-600 hover:bg-gray-100"
                                                >
                                                    <Minus className="w-5 h-5" />
                                                </button>
                                                <span className="px-4 text-gray-900">{quantity}</span>
                                                <button
                                                    onClick={() => setQuantity(quantity + 1)}
                                                    className="p-2 text-gray-600 hover:bg-gray-100"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                            </div>
                                            {/* wishlist icon button */}
                                        </div>

                                        <button
                                            onClick={handleAddToCart}
                                            className="w-full sm:w-1/2 flex items-center justify-center px-6 py-3 
                      bg-orange-500 text-white rounded-lg hover:bg-orange-600 
                      transition-colors space-x-2"
                                        >
                                            <ShoppingCart className="w-5 h-5" />
                                            <span>Add to Cart</span>
                                        </button>
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
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProductQuickView;
