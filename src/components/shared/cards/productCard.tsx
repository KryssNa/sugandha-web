import { CartIcon } from "@/utils/helpers/svgicon";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRightFromSquareIcon, ArrowUpRightIcon, ArrowUpRightSquareIcon, Eye, Heart, Plus, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { CountdownTimer } from "../countDownTimer";
import { Product } from "../types/product.types";

export interface ProductCardProps {
  primaryImage: string;
  secondaryImage?: string;
  title: string;
  price: number;
  slug: string;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviews?: number;
  isHot?: boolean;
  endDate?: Date;
  onAddToWishlist?: () => void;
  onQuickView?: () => void;
  onAddToCart?: () => void;
  checkWishlist?: (product: Product) => boolean;
  buyNow?: () => Promise<void>;
  viewMode?: 'grid' | 'list';
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  primaryImage,
  secondaryImage,
  title,
  price,
  slug,
  originalPrice,
  discount,
  rating = 0,
  reviews = 0,
  isHot = false,
  endDate,
  onAddToWishlist,
  onQuickView,
  onAddToCart,
  checkWishlist,
  buyNow,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const actionButtons = [
    { Icon: Heart, label: "Add to Wishlist", onClick: onAddToWishlist, enabled: checkWishlist },
    { Icon: Eye, label: "Quick View", onClick: onQuickView },
    // car
    { Icon: CartIcon, label: "Add to Cart", onClick: onAddToCart },
    // { Icon: Shuffle, label: "Compare", onClick: onCompare },
  ];
  


  return (
    <motion.div
      className={`relative rounded-2xl border border-[#e6e6e6] flex flex-col ${className} p-4 hover:shadow-sm hover:border-primary hover:scale-[1.01] transition-transform duration-300`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => {
        setIsHovered(false);
        setShowActions(false);
      }}
    >
      {/* Main Image Container */}
      <div className='relative bg-[#ebeaea] rounded-lg aspect-square overflow-hidden'>
        {/* Product Images */}
        <Link href={`/products/${slug}`}>
          <div className='absolute inset-0 flex items-center justify-center '>
            {/* Primary Image - Always visible */}
            <motion.img
              src={primaryImage}
              alt={title}
              className='absolute w-[70%]  object-contain'
              initial={{ opacity: 1 }}
              animate={{ opacity: isHovered && secondaryImage ? 0 : 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
            />

            {/* Secondary Image - Fades in on hover */}
            {secondaryImage && (
              <motion.img
                src={secondaryImage}
                alt={`${title} - alternate view`}
                className='absolute w-[70%] object-contain'
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
              />
            )}
          </div>
        </Link>

        {/* Discount Label */}
        {discount && (
          <div className='absolute top-4 left-4 bg-white rounded-full p-2 shadow-sm'>
            <div className='text-[#fa6800] text-xs font-semibold font-inter'>
              -{discount}%
            </div>
          </div>
        )}

        {/* Hot Label */}
        {isHot && (
          <div className='absolute top-16 left-4 bg-white rounded-full p-2 shadow-sm'>
            <div className='text-[#121535] text-xs font-semibold font-inter'>
              HOT
            </div>
          </div>
        )}

        {/* Action Buttons Container */}
        <div className='absolute top-4 right-4 z-20 '>
          {/* Toggle Button with Hover Effect */}
          <div className='relative group '>
            <motion.button
              className='p-2 bg-white rounded-full shadow-sm transition-colors duration-100 hover:bg-primary hover:text-white'
              onMouseEnter={() => {
                setIsHovered(true);
                setShowActions(true);
              }}
              // onMouseLeave={() => {
              //   setIsHovered(false);
              //   setShowActions(false);
              // }}
              whileTap={{ scale: 0.95 }}
            >
              {showActions ? <X size={16} /> : <Plus size={16} />}
            </motion.button>

            {/* Action Buttons Menu */}
            <AnimatePresence>
              {showActions && (
                <motion.div
                  className='absolute right-0 top-12 flex flex-col gap-2 pt-2'
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {actionButtons.map(({ Icon, label, onClick,enabled }, index) => (
                    <motion.button
                      key={label}
                      className={`p-2 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-200 ${enabled?"text-red":""} `}
                      onClick={onClick}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: index * 0.1 },
                      }}
                      whileTap={{ scale: 0.95 }}
                      title={label}
                    >
                      <Icon size={16} fill={enabled?"red":"none"}  />
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Countdown Timer */}
        {endDate && (
          <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 gap-2 flex items-center'>
            <CountdownTimer targetDate={endDate} />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className='pt-4 space-y-2'>
        {/* Title */}
        <Link href={`/products/${slug}`}>
          <h3 className='text-lg font-semibold font-quicksand text-[#121535] line-clamp-2 hover:text-primary'>
            {title}
          </h3>
        </Link>

        {/* Rating */}
        <div className='flex items-center gap-2'>
          <div className='flex items-center pb-[3px]'>
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-lg ${i < rating ? "text-[#FF9F29]" : "text-gray-300"
                  }`}
              >
                ★
              </span>
            ))}
          </div>
          <span className='text-[#808080] text-xs font-medium font-inter'>
            {rating}
          </span>
          <span className='text-[#808080] text-xs font-medium font-inter'>
            ({reviews > 1000 ? `${Math.floor(reviews / 1000)}K` : reviews})
          </span>
        </div>

        {/* Price */}
        <div className='flex items-center gap-2 pb-4'>
          {originalPrice && (
            <span className='text-[#999999] text-base font-semibold font-inter line-through'>
              Rs{originalPrice}
            </span>
          )}
          <span className='text-[#121535] text-base font-semibold font-inter'>
            RS{price}
          </span>
          <span className='text-[#808080] text-base font-normal font-inter'>
            /Qty
          </span>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          className='w-full py-2 px-4 bg-[#e8e8e8] rounded-lg text-center text-[#121535] text-base font-medium font-inter flex items-center justify-center gap-2'
          onClick={buyNow}
          whileHover={{ backgroundColor: "#fa6800", color: "white" }}
          whileTap={{ scale: 0.98 }}
        >
          Buy Now
          <span>
            <ArrowUpRightIcon />
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
