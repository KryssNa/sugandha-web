// // "use client";

// // import { addToCart } from "@/store/slices/cartSlice";
// // import { AnimatePresence, motion } from "framer-motion";
// // import {
// //   Heart,
// //   MessageSquare,
// //   Share2,
// //   Shield,
// //   ShoppingCart,
// //   Timer,
// //   Truck,
// // } from "lucide-react";
// // import Image from "next/image";
// // import React, { useState } from "react";
// // import { useDispatch } from "react-redux";

// // // Types
// // interface ProductImage {
// //   id: string;
// //   url: string;
// //   alt: string;
// // }

// // interface ProductSpec {
// //   label: string;
// //   value: string;
// // }

// // interface ProductDetails {
// //   id: string;
// //   name: string;
// //   brand: string;
// //   sku: string;
// //   rating: number;
// //   reviews: number;
// //   description: string;
// //   price: number;
// //   originalPrice: number;
// //   discount: number;
// //   stock: number;
// //   images: ProductImage[];
// //   specifications: ProductSpec[];
// //   features: string[];
// //   ingredients: string[];
// //   madeIn: string;
// //   category: string;
// // }

// // const ProductDetailsSection: React.FC = () => {
// //   // State
// //   const [selectedImage, setSelectedImage] = useState<number>(0);
// //   const [quantity, setQuantity] = useState<number>(1);
// //   const [activeTab, setActiveTab] = useState<"description" | "reviews">(
// //     "description"
// //   );
// //   const [isZoomed, setIsZoomed] = useState(false);

// //   // Sample product data
// //   const product: ProductDetails = {
// //     id: "creed-aventus-100ml",
// //     name: "Creed Aventus EDP 100ml",
// //     brand: "Creed",
// //     sku: "EB4DRP",
// //     rating: 4.7,
// //     reviews: 2,
// //     description:
// //       "Discover the legendary Creed Aventus Eau de Parfum 100ml, a chypre fruity fragrance for men that embodies strength, vision, and success...",
// //     price: 1500,
// //     originalPrice: 1650,
// //     discount: 10,
// //     stock: 21,
// //     images: [
// //       {
// //         id: "1",
// //         url: "/assets/images/products/armani.png",
// //         alt: "Creed Aventus Main Image",
// //       },
// //       {
// //         id: "1",
// //         url: "/assets/images/products/image3.png",
// //         alt: "Creed Aventus Main Image",
// //       },
// //       // Add more images
// //     ],
// //     specifications: [
// //       {
// //         label: "Product Type",
// //         value: "Perfume",
// //       },
// //       {
// //         label: "Brand",
// //         value: "Creed",
// //       },
// //       {
// //         label: "Size",
// //         value: "100ml",
// //       },
// //       // Add more specifications
// //     ],
// //     features: [
// //       "Exceptional Longevity: 8-10 hours",
// //       "Versatile Wear",
// //       "Timeless Appeal",
// //       "Authentic Luxury",
// //     ],
// //     ingredients: ["Bergamot", "Blackcurrant", "Apple", "Pineapple"],
// //     madeIn: "USA",
// //     category: "Perfume",
// //   };

// //   // Timer for special offer
// //   const [timeLeft, setTimeLeft] = useState({
// //     hours: 6,
// //     minutes: 12,
// //     seconds: 11,
// //     milliseconds: 40,
// //   });

// //   // Handlers
// //   const handleQuantityChange = (type: "increase" | "decrease") => {
// //     setQuantity((prev) => {
// //       if (type === "decrease") return prev > 1 ? prev - 1 : 1;
// //       return prev < product.stock ? prev + 1 : prev;
// //     });
// //   };

// //   const dispatch = useDispatch();

// //   const handleAddToCart = () => {
// //      dispatch(addToCart(product));
// //     console.log("Added to cart:", { product, quantity });
// //   };

// //   const handleBuyNow = () => {
// //     console.log("Buy now:", { product, quantity });
// //   };

// //   return (
// //     <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
// //       {/* Product Overview Section */}
// //       <div className='flex flex-col lg:flex-row gap-8'>
// //         {/* Image Gallery */}
// //         <div className='lg:w-1/2 space-y-4'>
// //           <div className='relative h-[600px] rounded-2xl border border-gray-200 overflow-hidden'>
// //             <motion.div
// //               className='relative w-full h-full'
// //               whileHover={{ scale: isZoomed ? 1.1 : 1 }}
// //               transition={{ duration: 0.3 }}
// //               onHoverStart={() => setIsZoomed(true)}
// //               onHoverEnd={() => setIsZoomed(false)}
// //             >
// //               <Image
// //                 src={product.images[selectedImage].url}
// //                 alt={product.images[selectedImage].alt}
// //                 fill
// //                 className='object-contain'
// //                 quality={100}
// //               />
// //             </motion.div>

// //             {/* Special Offer Banner */}
// //             <div
// //               className='absolute top-4 left-4 right-4 bg-gradient-to-r from-orange-500 to-orange-600 
// //               rounded-lg p-3 text-white flex items-center justify-between'
// //             >
// //               <span className='font-medium'>Special Offer</span>
// //               <div className='flex gap-2'>
// //                 <Timer className='w-5 h-5' />
// //                 <span>
// //                   {`${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`}
// //                 </span>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Thumbnail Gallery */}
// //           <div className='flex gap-4 overflow-x-auto pb-2'>
// //             {product.images.map((image, index) => (
// //               <motion.button
// //                 key={image.id}
// //                 whileHover={{ scale: 1.05 }}
// //                 whileTap={{ scale: 0.95 }}
// //                 onClick={() => setSelectedImage(index)}
// //                 className={`relative w-24 h-24 rounded-lg border-2 
// //                   ${
// //                     selectedImage === index
// //                       ? "border-orange-500"
// //                       : "border-gray-200"
// //                   }`}
// //               >
// //                 <Image
// //                   src={image.url}
// //                   alt={image.alt}
// //                   fill
// //                   className='object-cover rounded-lg'
// //                 />
// //               </motion.button>
// //             ))}
// //           </div>
// //         </div>

// // {/* Product Info */}
// // <div className='lg:w-1/2 space-y-6'>
// //   <div>
// //     <h1 className='text-3xl font-bold text-gray-900'>{product.name}</h1>
// //     <div className='mt-2 flex items-center gap-4'>
// //       <div className='flex items-center'>
// //         {[...Array(5)].map((_, i) => (
// //           <motion.svg
// //             key={i}
// //             whileHover={{ scale: 1.2 }}
// //             className={`w-5 h-5 ${
// //               i < Math.floor(product.rating)
// //                 ? "text-yellow-400"
// //                 : "text-gray-300"
// //             }`}
// //             fill='currentColor'
// //             viewBox='0 0 20 20'
// //           >
// //             <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
// //           </motion.svg>
// //         ))}
// //         <span className='ml-2 text-sm text-gray-600'>
// //           {product.rating} ({product.reviews} reviews)
// //         </span>
// //       </div>
// //       <span className='text-sm text-gray-500'>|</span>
// //       <span className='text-sm text-gray-600'>SKU: {product.sku}</span>
// //     </div>
// //   </div>

// //   {/* Price */}
// //   <div className='flex items-center gap-4'>
// //     <div className='flex items-center gap-2'>
// //       <span className='text-3xl font-bold text-gray-900'>
// //         ₹{product.price}
// //       </span>
// //       <span className='text-lg text-gray-500 line-through'>
// //         ₹{product.originalPrice}
// //       </span>
// //     </div>
// //     <span className='px-2.5 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium'>
// //       {product.discount}% OFF
// //     </span>
// //   </div>

// //           {/* Stock and Quantity */}
// //           <div className='space-y-4'>
// //             <p className='text-sm text-gray-600'>
// //               Stock: {product.stock} units available
// //             </p>
// //             <div className='flex items-center gap-4'>
// //               <label className='text-sm text-gray-600'>Quantity:</label>
// //               <div className='flex items-center border border-gray-200 rounded-lg'>
// //                 <button
// //                   onClick={() => handleQuantityChange("decrease")}
// //                   className='p-2 hover:bg-gray-100 transition-colors'
// //                 >
// //                   -
// //                 </button>
// //                 <span className='px-4 py-2 border-x border-gray-200'>
// //                   {quantity}
// //                 </span>
// //                 <button
// //                   onClick={() => handleQuantityChange("increase")}
// //                   className='p-2 hover:bg-gray-100 transition-colors'
// //                 >
// //                   +
// //                 </button>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Action Buttons */}
// //           <div className='space-y-4'>
// //             <div className='grid grid-cols-2 gap-4'>
// //               <motion.button
// //                 whileHover={{ scale: 1.02 }}
// //                 whileTap={{ scale: 0.98 }}
// //                 onClick={handleAddToCart}
// //                 className='flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 
// //                   text-white rounded-lg hover:bg-orange-600 transition-colors'
// //               >
// //                 <ShoppingCart className='w-5 h-5' />
// //                 Add to Cart
// //               </motion.button>
// //               <motion.button
// //                 whileHover={{ scale: 1.02 }}
// //                 whileTap={{ scale: 0.98 }}
// //                 onClick={handleBuyNow}
// //                 className='flex items-center justify-center gap-2 px-6 py-3 border-2 
// //                   border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors'
// //               >
// //                 Buy Now
// //               </motion.button>
// //             </div>
// //             <motion.button
// //               whileHover={{ scale: 1.02 }}
// //               whileTap={{ scale: 0.98 }}
// //               className='w-full flex items-center justify-center gap-2 px-6 py-3 
// //                 bg-green text-white rounded-lg hover:bg-green transition-colors'
// //             >
// //               Order on WhatsApp
// //             </motion.button>
// //           </div>

// //           {/* Features */}
// //           <div className='grid grid-cols-2 gap-4 border-t border-b border-gray-200 py-6'>
// //             <div className='flex items-center gap-3'>
// //               <Truck className='w-5 h-5 text-orange-500' />
// //               <div>
// //                 <p className='text-sm font-medium'>Free Shipping</p>
// //                 <p className='text-xs text-gray-500'>Orders over ₹500</p>
// //               </div>
// //             </div>
// //             <div className='flex items-center gap-3'>
// //               <Shield className='w-5 h-5 text-orange-500' />
// //               <div>
// //                 <p className='text-sm font-medium'>Secure Payment</p>
// //                 <p className='text-xs text-gray-500'>100% Protected</p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Tabs Section */}
// //       <div className='mt-12'>
// //         <div className='border-b border-gray-200'>
// //           <div className='flex space-x-8'>
// //             <button
// //               onClick={() => setActiveTab("description")}
// //               className={`py-4 px-1 relative ${
// //                 activeTab === "description"
// //                   ? "text-orange-500"
// //                   : "text-gray-500 hover:text-gray-700"
// //               }`}
// //             >
// //               Description
// //               {activeTab === "description" && (
// //                 <motion.div
// //                   layoutId='activeTab'
// //                   className='absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500'
// //                 />
// //               )}
// //             </button>
// //             <button
// //               onClick={() => setActiveTab("reviews")}
// //               className={`py-4 px-1 relative ${
// //                 activeTab === "reviews"
// //                   ? "text-orange-500"
// //                   : "text-gray-500 hover:text-gray-700"
// //               }`}
// //             >
// //               Reviews
// //               {activeTab === "reviews" && (
// //                 <motion.div
// //                   layoutId='activeTab'
// //                   className='absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500'
// //                 />
// //               )}
// //             </button>
// //           </div>
// //         </div>

// //         <AnimatePresence mode='wait'>
// //           {activeTab === "description" ? (
// //             <motion.div
// //               key='description'
// //               initial={{ opacity: 0, y: 20 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               exit={{ opacity: 0, y: -20 }}
// //               className='py-6 space-y-6'
// //             >
// //               <div className='prose max-w-none'>
// //                 <h3 className='text-xl font-bold mb-4'>Product Description</h3>
// //                 <p className='text-gray-600'>{product.description}</p>
// //               </div>

// //               <div>
// //                 <h3 className='text-xl font-bold mb-4'>Specifications</h3>
// //                 <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
// //                   {product.specifications.map((spec) => (
// //                     <div key={spec.label} className='flex items-center gap-3'>
// //                       <div className='w-2 h-2 rounded-full bg-orange-500' />
// //                       <span className='text-gray-600'>{spec.label}:</span>
// //                       <span className='font-medium'>{spec.value}</span>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>

// //               {/* Features Section */}
// //               <div className='space-y-4'>
// //                 <h3 className='text-xl font-bold'>Key Features</h3>
// //                 <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
// //                   {product.features.map((feature, index) => (
// //                     <div
// //                       key={index}
// //                       className='flex items-start gap-3 p-4 bg-gray-50 rounded-lg'
// //                     >
// //                       <div className='w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0'>
// //                         <div className='w-3 h-3 rounded-full bg-orange-500' />
// //                       </div>
// //                       <span className='text-gray-700'>{feature}</span>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>

// //               {/* Ingredients Section */}
// //               <div className='space-y-4'>
// //                 <h3 className='text-xl font-bold'>Ingredients</h3>
// //                 <div className='flex flex-wrap gap-2'>
// //                   {product.ingredients.map((ingredient, index) => (
// //                     <span
// //                       key={index}
// //                       className='px-3 py-1 bg-gray-100 rounded-full text-gray-700 text-sm'
// //                     >
// //                       {ingredient}
// //                     </span>
// //                   ))}
// //                 </div>
// //               </div>

// //               {/* Additional Information */}
// //               <div className='space-y-4 border-t border-gray-200 pt-6'>
// //                 <div className='flex items-center gap-2'>
// //                   <span className='text-gray-600'>Made in:</span>
// //                   <span className='font-medium'>{product.madeIn}</span>
// //                 </div>
// //                 <div className='flex items-center gap-2'>
// //                   <span className='text-gray-600'>Category:</span>
// //                   <span className='font-medium'>{product.category}</span>
// //                 </div>
// //               </div>
// //             </motion.div>
// //           ) : (
// //             <motion.div
// //               key='reviews'
// //               initial={{ opacity: 0, y: 20 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               exit={{ opacity: 0, y: -20 }}
// //               className='py-6'
// //             >
// //               {/* Reviews Section */}
// //               <div className='space-y-6'>
// //                 <div className='flex items-center justify-between'>
// //                   <h3 className='text-xl font-bold'>Customer Reviews</h3>
// //                   <motion.button
// //                     whileHover={{ scale: 1.05 }}
// //                     whileTap={{ scale: 0.95 }}
// //                     className='px-4 py-2 bg-orange-500 text-white rounded-lg 
// //                       hover:bg-orange-600 transition-colors flex items-center gap-2'
// //                   >
// //                     <MessageSquare className='w-4 h-4' />
// //                     Write a Review
// //                   </motion.button>
// //                 </div>

//       //           {/* Rating Summary */}
//       //           <div className='flex items-center gap-6 p-6 bg-gray-50 rounded-lg'>
//       //             <div className='text-center'>
//       //               <div className='text-4xl font-bold text-gray-900'>
//       //                 {product.rating}
//       //               </div>
//       //               <div className='flex items-center justify-center mt-2'>
//       //                 {[...Array(5)].map((_, i) => (
//       //                   <svg
//       //                     key={i}
//       //                     className={`w-4 h-4 ${
//       //                       i < Math.floor(product.rating)
//       //                         ? "text-yellow-400"
//       //                         : "text-gray-300"
//       //                     }`}
//       //                     fill='currentColor'
//       //                     viewBox='0 0 20 20'
//       //                   >
//       //                     <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
//       //                   </svg>
//       //                 ))}
//       //               </div>
//       //               <div className='text-sm text-gray-500 mt-1'>
//       //                 Based on {product.reviews} reviews
//       //               </div>
//       //             </div>

//       //             <div className='flex-1 space-y-2'>
//       //               {[5, 4, 3, 2, 1].map((stars) => (
//       //                 <div key={stars} className='flex items-center gap-2'>
//       //                   <span className='text-sm text-gray-600 w-8'>
//       //                     {stars} star
//       //                   </span>
//       //                   <div className='flex-1 h-2 bg-gray-200 rounded-full overflow-hidden'>
//       //                     <div
//       //                       className='h-full bg-yellow-400'
//       //                       style={{
//       //                         width: `${(product.reviews > 0
//       //                           ? Math.random() * 100
//       //                           : 0
//       //                         ).toFixed(0)}%`,
//       //                       }}
//       //                     />
//       //                   </div>
//       //                   <span className='text-sm text-gray-600 w-8'>
//       //                     {Math.floor(Math.random() * product.reviews)}
//       //                   </span>
//       //                 </div>
//       //               ))}
//       //             </div>
//       //           </div>
//       //         </div>
//       //       </motion.div>
//       //     )}
//       //   </AnimatePresence>
//       // </div>

// //       {/* Fixed Bottom Bar for Mobile */}
// //       <motion.div
// //         initial={{ y: 100 }}
// //         animate={{ y: 0 }}
// //         className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden'
// //       >
// //         <div className='flex items-center justify-between gap-4 max-w-7xl mx-auto'>
// //           <div>
// //             <div className='text-sm text-gray-500'>Total Price</div>
// //             <div className='text-lg font-bold text-gray-900'>
// //               ₹{(product.price * quantity).toLocaleString()}
// //             </div>
// //           </div>
// //           <motion.button
// //             whileHover={{ scale: 1.02 }}
// //             whileTap={{ scale: 0.98 }}
// //             onClick={handleAddToCart}
// //             className='flex-1 flex items-center justify-center gap-2 px-6 py-3 
// //               bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors'
// //           >
// //             <ShoppingCart className='w-5 h-5' />
// //             Add to Cart
// //           </motion.button>
// //         </div>
// //       </motion.div>

// //       {/* Share & Wishlist Floating Buttons */}
// //       <div className='fixed right-4 top-1/2 transform -translate-y-1/2 space-y-4'>
// //         <motion.button
// //           whileHover={{ scale: 1.1 }}
// //           whileTap={{ scale: 0.9 }}
// //           className='w-12 h-12 flex items-center justify-center bg-white rounded-full 
// //             shadow-lg hover:shadow-xl transition-shadow'
// //         >
// //           <Share2 className='w-5 h-5 text-gray-600' />
// //         </motion.button>
// //         <motion.button
// //           whileHover={{ scale: 1.1 }}
// //           whileTap={{ scale: 0.9 }}
// //           className='w-12 h-12 flex items-center justify-center bg-white rounded-full 
// //             shadow-lg hover:shadow-xl transition-shadow'
// //         >
// //           <Heart className='w-5 h-5 text-gray-600' />
// //         </motion.button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProductDetailsSection;
// "use client"
// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { motion, AnimatePresence } from "framer-motion";
// import Image from "next/image";
// import {
//   Heart,
//   MessageSquare,
//   Share2,
//   Shield,
//   ShoppingCart,
//   Timer,
//   Truck,
// } from "lucide-react";
// import { addToCart } from "@/store/slices/cartSlice";
// import { addToWishlist, removeFromWishlist } from "@/store/slices/wishlistSlice";
// import type { RootState } from "@/store";
// import { Product } from "@/components/shared/types/productTypes";

// interface ProductDetailsProps {
//   product: Product;
// }

// const ProductDetailsSection: React.FC<ProductDetailsProps> = ({ product }) => {
//   // Redux
//   const dispatch = useDispatch();
//   const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
//   const isInWishlist = wishlistItems.some(item => item.id === product.id);

//   // Local state
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");
//   const [isZoomed, setIsZoomed] = useState(false);
//   const [timeLeft, setTimeLeft] = useState({
//     hours: 6,
//     minutes: 12,
//     seconds: 11,
//   });

//   // Handlers
//   const handleQuantityChange = (type: "increase" | "decrease") => {
//     setQuantity(prev => {
//       if (type === "decrease") return prev > 1 ? prev - 1 : 1;
//       return prev < (product.quantity || 0) ? prev + 1 : prev;
//     });
//   };

//   const handleAddToCart = () => {
//     dispatch(addToCart({
//       ...product,
//       quantity
//     }));
//   };

//   const toggleWishlist = () => {
//     if (isInWishlist) {
//       dispatch(removeFromWishlist(product.id));
//     } else {
//       dispatch(addToWishlist(product));
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Product Overview Section */}
//       <div className="flex flex-col lg:flex-row gap-8">
//         {/* Image Gallery */}
//         <div className="lg:w-1/2 space-y-4">
//           <div className="relative h-96 rounded-2xl border border-gray-200 overflow-hidden">
//             <motion.div
//               className="relative w-full h-full"
//               whileHover={{ scale: isZoomed ? 1.1 : 1 }}
//               transition={{ duration: 0.3 }}
//               onHoverStart={() => setIsZoomed(true)}
//               onHoverEnd={() => setIsZoomed(false)}
//             >
//               <Image
//                 src={product?.images[selectedImage]?.url || "/api/placeholder/400/400"}
//                 alt={product?.images[selectedImage]?.alt || product?.title}
//                 fill
//                 className="object-contain"
//               />
//             </motion.div>

//             {/* Special Offer Timer */}
//             <div className="absolute top-4 left-4 right-4 bg-gradient-to-r from-orange-500 to-orange-600 
//               rounded-lg p-3 text-white flex items-center justify-between">
//               <span className="font-medium">Special Offer</span>
//               <div className="flex gap-2">
//                 <Timer className="w-5 h-5" />
//                 <span>{`${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`}</span>
//               </div>
//             </div>
//           </div>

//           {/* Thumbnail Gallery */}
//           <div className="flex gap-4 overflow-x-auto pb-2">
//             {product.images?.map((image, index) => (
//               <motion.button
//                 key={image.id}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setSelectedImage(index)}
//                 className={`relative w-24 h-24 rounded-lg border-2 
//                   ${selectedImage === index ? "border-orange-500" : "border-gray-200"}`}
//               >
//                 <Image
//                   src={image.url}
//                   alt={image.alt}
//                   fill
//                   className="object-cover rounded-lg"
//                 />
//               </motion.button>
//             ))}
//           </div>
//         </div>

//         {/* Product Info */}
//         {/* Product Info */}
//         <div className='lg:w-1/2 space-y-6'>
//           <div>
//             <h1 className='text-3xl font-bold text-gray-900'>{product.title}</h1>
//             <div className='mt-2 flex items-center gap-4'>
//               <div className='flex items-center'>
//                 {[...Array(5)].map((_, i) => (
//                   <motion.svg
//                     key={i}
//                     whileHover={{ scale: 1.2 }}
//                     className={`w-5 h-5 ${i < Math.floor(product.rating.average)
//                       ? "text-yellow-400"
//                       : "text-gray-300"
//                       }`}
//                     fill='currentColor'
//                     viewBox='0 0 20 20'
//                   >
//                     <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
//                   </motion.svg>
//                 ))}
//                 <span className='ml-2 text-sm text-gray-600'>
//                   {product.rating.average.toFixed(1)} ({product.reviews.length} reviews)
//                 </span>
//               </div>
//               <span className='text-sm text-gray-500'>|</span>
//               <span className='text-sm text-gray-600'>SKU: {product.sku}</span>
//             </div>
//           </div>

//           {/* Price */}
//           <div className='flex items-center gap-4'>
//             <div className='flex items-center gap-2'>
//               <span className='text-3xl font-bold text-gray-900'>
//                 ₹{product.basePrice}
//               </span>
//               <span className='text-lg text-gray-500 line-through'>
//                 ₹{product.originalPrice}
//               </span>
//             </div>
//             <span className='px-2.5 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium'>
//               {product.discount}% OFF
//             </span>
//           </div>


//           {/* Rating Summary */}
//           <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-lg">
//             <div className="text-center">
//               <div className="text-4xl font-bold text-gray-900">
//                 {product.rating.count}
//               </div>
//               <div className="flex items-center justify-center mt-2">
//                 {[...Array(5)].map((_, i) => (
//                   <motion.svg
//                     key={i}
//                     className={`w-4 h-4 ${i < Math.floor(product.rating.average)
//                       ? "text-yellow-400"
//                       : "text-gray-300"
//                       }`}
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                   </motion.svg>
//                 ))}
//                 <span className="ml-2 text-sm text-gray-600">
//                   {product.rating.average.toFixed(1)} ({product.reviews.length} reviews)
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Price */}
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2">
//               <span className="text-3xl font-bold text-gray-900">
//                 ${product.basePrice}
//               </span>
//               {product.originalPrice && (
//                 <span className="text-lg text-gray-500 line-through">
//                   ${product.originalPrice}
//                 </span>
//               )}
//             </div>
//             {product.discount > 0 && (
//               <span className="px-2.5 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
//                 {product.discount}% OFF
//               </span>
//             )}
//           </div>

//           {/* Stock and Quantity */}
//           <div className="space-y-4">
//             <p className="text-sm text-gray-600">
//               Stock: {product.quantity} units available
//             </p>
//             <div className="flex items-center gap-4">
//               <label className="text-sm text-gray-600">Quantity:</label>
//               <div className="flex items-center border border-gray-200 rounded-lg">
//                 <motion.button
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => handleQuantityChange("decrease")}
//                   className="p-2 hover:bg-gray-100 transition-colors"
//                 >
//                   -
//                 </motion.button>
//                 <span className="px-4 py-2 border-x border-gray-200">
//                   {quantity}
//                 </span>
//                 <motion.button
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => handleQuantityChange("increase")}
//                   className="p-2 hover:bg-gray-100 transition-colors"
//                 >
//                   +
//                 </motion.button>
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={handleAddToCart}
//                 className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 
//                   text-white rounded-lg hover:bg-orange-600 transition-colors"
//               >
//                 <ShoppingCart className="w-5 h-5" />
//                 Add to Cart
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={toggleWishlist}
//                 className={`flex items-center justify-center gap-2 px-6 py-3 border-2 
//                   rounded-lg transition-colors ${isInWishlist
//                     ? "border-red-500 text-red-500 hover:bg-red-50"
//                     : "border-orange-500 text-orange-500 hover:bg-orange-50"
//                   }`}
//               >
//                 <Heart className="w-5 h-5" fill={isInWishlist ? "currentColor" : "none"} />
//                 {isInWishlist ? "Remove" : "Wishlist"}
//               </motion.button>
//             </div>
//           </div>

//           {/* Features */}
//           <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-200 py-6">
//             <div className="flex items-center gap-3">
//               <Truck className="w-5 h-5 text-orange-500" />
//               <div>
//                 <p className="text-sm font-medium">Free Shipping</p>
//                 <p className="text-xs text-gray-500">Orders over $500</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <Shield className="w-5 h-5 text-orange-500" />
//               <div>
//                 <p className="text-sm font-medium">Secure Payment</p>
//                 <p className="text-xs text-gray-500">100% Protected</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tabs Section */}
//       <div className="mt-12">
//         <div className="border-b border-gray-200">
//           <div className="flex space-x-8">
//             <button
//               onClick={() => setActiveTab("description")}
//               className={`py-4 px-1 relative ${activeTab === "description"
//                 ? "text-orange-500"
//                 : "text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//               Description
//               {activeTab === "description" && (
//                 <motion.div
//                   layoutId="activeTab"
//                   className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
//                 />
//               )}
//             </button>
//             <button
//               onClick={() => setActiveTab("reviews")}
//               className={`py-4 px-1 relative ${activeTab === "reviews"
//                 ? "text-orange-500"
//                 : "text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//               Reviews
//               {activeTab === "reviews" && (
//                 <motion.div
//                   layoutId="activeTab"
//                   className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
//                 />
//               )}
//             </button>
//           </div>
//         </div>

//         <AnimatePresence mode="wait">
//           {activeTab === "description" ? (
//             <motion.div
//               key="description"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="py-6 space-y-6"
//             >
//               <div className="prose max-w-none">
//                 <p className="text-gray-600">{product.description}</p>
//               </div>

//               {/* Specifications */}
//               {product.specifications?.length > 0 && (
//                 <div>
//                   <h3 className="text-xl font-bold mb-4">Specifications</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {product.specifications.map((spec) => (
//                       <div key={spec.label} className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-orange-500" />
//                         <span className="text-gray-600">{spec.label}:</span>
//                         <span className="font-medium">{spec.value}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Features */}
//               {product.features?.length > 0 && (
//                 <div className="space-y-4">
//                   <h3 className="text-xl font-bold">Key Features</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {product.features.map((feature, index) => (
//                       <div
//                         key={index}
//                         className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
//                       >
//                         <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center 
//                           justify-center flex-shrink-0">
//                           <div className="w-3 h-3 rounded-full bg-orange-500" />
//                         </div>
//                         <span className="text-gray-700">{feature}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </motion.div>
//           ) : (
//             <motion.div
//               key="reviews"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="py-6"
//             >
//               {/* Reviews Header */}
//               <div className="flex items-center justify-between mb-6">
//                 <div>
//                   <h3 className="text-xl font-bold">Customer Reviews</h3>
//                   <p className="text-sm text-gray-500 mt-1">
//                     What others think about this product
//                   </p>
//                 </div>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="px-4 py-2 bg-orange-500 text-white rounded-lg 
//                     hover:bg-orange-600 transition-colors flex items-center gap-2"
//                 >
//                   <MessageSquare className="w-4 h-4" />
//                   Write a Review
//                 </motion.button>
//               </div>

//               {/* Rating Distribution */}
//               <div className="bg-gray-50 rounded-xl p-6 mb-8">
//                 <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
//                   {/* Overall Rating */}
//                   <div className="md:col-span-3 text-center border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0">
//                     <div className="text-5xl font-bold text-gray-900 mb-2">
//                       {product.rating.average}
//                     </div>
//                     <div className="flex items-center justify-center gap-1 mb-2">
//                       {[...Array(5)].map((_, i) => (
//                         <svg
//                           key={i}
//                           className={`w-5 h-5 ${i < Math.floor(product.rating.average) ? "text-yellow-400" : "text-gray-300"
//                             }`}
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                         >
//                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                         </svg>
//                       ))}
//                     </div>
//                     <p className="text-sm text-gray-500">Based on {product.reviews.length} reviews</p>
//                   </div>

//                   {/* Rating Bars */}
//                   <div className="md:col-span-9 pl-6 space-y-3">
//                     {[5, 4, 3, 2, 1].map((stars) => (
//                       <div key={stars} className="flex items-center gap-4">
//                         <div className="flex items-center gap-1 w-20">
//                           <span className="text-sm font-medium">{stars}</span>
//                           <svg
//                             className="w-4 h-4 text-yellow-400"
//                             fill="currentColor"
//                             viewBox="0 0 20 20"
//                           >
//                             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                           </svg>
//                         </div>
//                         <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
//                           <motion.div
//                             initial={{ width: 0 }}
//                             animate={{
//                               width: `${(product.reviews.length > 0
//                                 ? Math.random() * 100
//                                 : 0
//                               ).toFixed(0)}%`
//                             }}
//                             transition={{ duration: 0.8, delay: stars * 0.1 }}
//                             className="h-full bg-yellow-400"
//                           />
//                         </div>
//                         <div className="w-16 text-right">
//                           <span className="text-sm text-gray-500">
//                             {Math.floor(Math.random() * product.reviews.length)}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Reviews List */}
//               <div className="space-y-6">
//                 {product.reviews.length > 0 ? (
//                   <>
//                     {/* Review Cards */}
//                     {[...Array(3)].map((_, index) => (
//                       <motion.div
//                         key={index}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: index * 0.1 }}
//                         className="bg-white rounded-xl border border-gray-200 p-6 hover:border-orange-200 
//                           hover:shadow-lg transition-all duration-300"
//                       >
//                         <div className="flex items-center justify-between mb-4">
//                           <div className="flex items-center gap-4">
//                             <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 
//                               to-orange-600 flex items-center justify-center text-white font-semibold">
//                               {index === 0 ? "JD" : index === 1 ? "SB" : "RK"}
//                             </div>
//                             <div>
//                               <h4 className="font-medium text-gray-900">
//                                 {index === 0 ? "John Doe" : index === 1 ? "Sarah Brown" : "Robert King"}
//                               </h4>
//                               <div className="flex items-center gap-2 mt-1">
//                                 <div className="flex gap-0.5">
//                                   {[...Array(5)].map((_, i) => (
//                                     <svg
//                                       key={i}
//                                       className={`w-4 h-4 ${i < (5 - index) ? "text-yellow-400" : "text-gray-300"
//                                         }`}
//                                       fill="currentColor"
//                                       viewBox="0 0 20 20"
//                                     >
//                                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                                     </svg>
//                                   ))}
//                                 </div>
//                                 <span className="text-sm text-gray-500">
//                                   Verified Purchase
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                           <span className="text-sm text-gray-500">
//                             {index === 0 ? "2 days ago" : index === 1 ? "1 week ago" : "2 weeks ago"}
//                           </span>
//                         </div>
//                         <p className="text-gray-600 mb-4">
//                           {index === 0
//                             ? "This product exceeded my expectations. The quality is outstanding and it arrived quickly. Highly recommend to anyone considering this purchase!"
//                             : index === 1
//                               ? "Great value for money. The fragrance lasts all day and the bottle design is elegant. Will definitely buy again."
//                               : "Nice scent but could last longer. The packaging is premium and delivery was fast. Overall satisfied with the purchase."
//                           }
//                         </p>
//                         <div className="flex items-center gap-4">
//                           <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2"
//                           >
//                             <span>Helpful</span>
//                             <span className="text-gray-400">
//                               ({index === 0 ? "12" : index === 1 ? "8" : "5"})
//                             </span>
//                           </motion.button>
//                           <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             className="text-sm text-gray-500 hover:text-gray-700"
//                           >
//                             Report
//                           </motion.button>
//                         </div>
//                       </motion.div>
//                     ))}

//                     {/* Load More Button */}
//                     <div className="text-center pt-4">
//                       <motion.button
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                         className="px-6 py-2 border-2 border-orange-500 text-orange-500 rounded-lg 
//                           hover:bg-orange-50 transition-colors inline-flex items-center gap-2"
//                       >
//                         Load More Reviews
//                       </motion.button>
//                     </div>
//                   </>
//                 ) : (
//                   <div className="text-center py-12">
//                     <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center 
//                       mx-auto mb-4">
//                       <MessageSquare className="w-8 h-8 text-orange-500" />
//                     </div>
//                     <h4 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h4>
//                     <p className="text-gray-500 mb-6">Be the first to review this product</p>
//                     <motion.button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 
//                         transition-colors inline-flex items-center gap-2"
//                     >
//                       <MessageSquare className="w-4 h-4" />
//                       Write a Review
//                     </motion.button>
//                   </div>
//                 )}
//               </div>

//             </motion.div>

//           )}
//         </AnimatePresence>

//         {/* Fixed Bottom Bar for Mobile */}
//         <motion.div
//           initial={{ y: 100 }}
//           animate={{ y: 0 }}
//           className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden"
//         >
//           <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
//             <div>
//               <div className="text-sm text-gray-500">Total Price</div>
//               <div className="text-lg font-bold text-gray-900">
//                 ${(product.basePrice * quantity).toFixed(2)}
//               </div>
//             </div>
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={handleAddToCart}
//               className="flex-1 flex items-center justify-center gap-2 px-6 py-3 
//               bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
//             >
//               <ShoppingCart className="w-5 h-5" />
//               Add to Cart
//             </motion.button>
//           </div>
//         </motion.div>

//         {/* Share & Wishlist Floating Buttons */}
//         <div className="fixed right-4 top-1/2 transform -translate-y-1/2 space-y-4">
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             className="w-12 h-12 flex items-center justify-center bg-white rounded-full 
//             shadow-lg hover:shadow-xl transition-shadow"
//           >
//             <Share2 className="w-5 h-5 text-gray-600" />
//           </motion.button>
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={toggleWishlist}
//             className="w-12 h-12 flex items-center justify-center bg-white rounded-full 
//             shadow-lg hover:shadow-xl transition-shadow"
//           >
//             <Heart
//               className={`w-5 h-5 ${isInWishlist ? "text-red-500" : "text-gray-600"}`}
//               fill={isInWishlist ? "currentColor" : "none"}
//             />
//           </motion.button>
//         </div>
//       </div>
//     </div>
//   );

// };

// export default ProductDetailsSection;

"use client"

import { useAppDispatch, useAppSelector } from '@/store/hooks'; // Add custom hooks
import { addItemToCart } from '@/store/slices/cartSlice';
import { fetchProductBySlug } from '@/store/slices/productSlice';
import { addToWishlist, removeFromWishlist } from '@/store/slices/wishlistSlice';
import { useEffect, useState } from 'react';

// Components
import { RootState } from '@/store';
import ImageGallery from './ImageGallery';
import { FloatingButtons, MobileBottomBar } from './MobileButtons';
import ProductInfo from './ProductInfo';
import ProductTabs from './ProductTab';
// import ProductTabs from './ProductTabs';
// import MobileBottomBar from './MobileBottomBar';
// import FloatingButtons from './FloatingButtons';

interface ProductDetailsSectionProps {
  slug: string;
}

const ProductDetailsSection = ({ slug }: ProductDetailsSectionProps) => {
  const dispatch = useAppDispatch();

  // Redux selectors
  const wishlistItems = useAppSelector((state: RootState) => state.wishlist.items);
  const { selectedProduct, loading, error } = useAppSelector(
    (state: RootState) => state.product
  );

  // Local state
  const [quantity, setQuantity] = useState(1);

  // Fetch product data
  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug))
        .unwrap()
        .catch((error) => {
          console.error('Failed to fetch product:', error);
        });
    }
  }, [dispatch, slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!selectedProduct) {
    return <div>Product not found</div>;
  }

  const product = selectedProduct;
  const isInWishlist = wishlistItems.some(item => item.id === product.id);

  // Handlers
  const handleQuantityChange = (type: "increase" | "decrease") => {
    setQuantity(prev => {
      if (type === "decrease") return prev > 1 ? prev - 1 : 1;
      return prev < (product.quantity || 0) ? prev + 1 : prev;
    });
  };

  const handleAddToCart = () => {
    dispatch(addItemToCart({
      product:product,
      productId: product.id as string,
      quantity
    }));
  };

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      if (product.id) {
        dispatch(removeFromWishlist(product.id));
      }
    } else {
      dispatch(addToWishlist(product));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Product Overview Section */}
      <div className="flex flex-col lg:flex-row gap-8">
        <ImageGallery
          images={product.images}
          title={product.title}
        />

        <ProductInfo
          product={product}
          quantity={quantity}
          isInWishlist={isInWishlist}
          onQuantityChange={handleQuantityChange}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
        />
      </div>

      {/* Tabs Section */}
      <ProductTabs product={product} />

      {/* Mobile Actions */}
      <MobileBottomBar
        price={product.basePrice}
        quantity={quantity}
        onAddToCart={handleAddToCart}
      />

      {/* Floating Buttons */}
      <FloatingButtons
        isInWishlist={isInWishlist}
        onToggleWishlist={handleToggleWishlist}
      />
    </div>
  );
};

export default ProductDetailsSection;
