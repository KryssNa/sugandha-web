"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { Heart, Star } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface ProductCardProps {
  title: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  isVisible: boolean;
}

interface DotPosition {
  top?: string;
  left: string;
  bottom?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  originalPrice,
  image,
  rating,
  reviews,
  isVisible,
}) => (
  <div
    className={`transition-all duration-300 absolute transform 
      ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }
      w-full p-4 border border-gray-100 hover:border-orange-600 max-w-sm rounded-lg bg-white 
      -translate-x-1/2 rotate-3 min-w-max`}
    style={{
      bottom: isVisible ? "100%" : "80%",
      left: "50%",
    }}
  >
    <div className='rounded-lg bg-gray-50 relative flex items-center justify-center'>
      <Link
        href='/product-details'
        className='w-[240px] h-auto flex items-center justify-center'
      >
        <img src={image} alt={title} className='w-auto' />
      </Link>
      <button
        className='absolute right-4 top-4 text-gray-600 text-xl hover:text-orange-600 transition-colors'
        title='heart'
      >
        <Heart className='h-6 w-6' />
      </button>
    </div>
    <div className='mt-4 w-full'>
      <h6 className='text-xl font-semibold my-2'>
        <Link
          href='/product-details'
          className='hover:text-orange-600 transition-colors line-clamp-2'
        >
          {title}
        </Link>
      </h6>
      <div className='mt-2 mb-2'>
        <span className='text-gray-600 text-lg font-semibold'>
          NPR{price.toFixed(2)}
        </span>
        <span className='text-gray-400 text-lg font-semibold line-through ml-2'>
          NPR{originalPrice.toFixed(2)}
        </span>
      </div>
      <div className='flex items-center gap-1.5'>
        <span className='text-yellow-500'>
          <Star className='h-5 w-5 fill-current' />
        </span>
        <span className='text-lg font-medium text-gray-500'>{rating}</span>
        <span className='text-lg font-medium text-gray-500'>({reviews})</span>
      </div>
    </div>
  </div>
);

const products = [
  {
    title: "Armani Code Perfume",
    price: 2400,
    originalPrice: 2500,
    image: "/assets/images/products/armani.png",
    rating: 4.8,
    reviews: 12000,
    position: { top: "80%", left: "20%" } as DotPosition,
  },
  {
    title: "Creed Aventus Perfume",
    price: 2400,
    originalPrice: 2500,
    image: "/assets/images/products/creed.png",
    rating: 4.8,
    reviews: 12000,
    position: { top: "48%", left: "72%" } as DotPosition,
  },
  {
    title: "Dior Sauvage Perfume",
    price: 2400,
    originalPrice: 2500,
    image: "/assets/images/products/image3.png",
    rating: 4.8,
    reviews: 12000,
    position: { top: "50%", left: "35%" } as DotPosition,
  },
];

const DealsSection: React.FC = () => {
  const timeLeft = useCountdown("2025-01-01T00:00:00");
  const [activeProduct, setActiveProduct] = useState<number | null>(null);

  return (
    <section className='py-6 md:py-16 bg-white'>
      <div className='container mx-auto px-4'>
        <div className='bg-gradient-to-r from-[#e9dfd1] via-[#b5a388] to-[#826740] rounded-[48px]'>
          <div className='grid lg:grid-cols-2 gap-4 items-center'>
            {/* Products Column */}
            <div className='block'>
              <div className='relative px-6'>
                {/* Interactive Dots */}
                <div className='relative w-full h-[440px] md:h-[700px]'>
                  {products.map((product, index) => (
                    <div
                      key={index}
                      className='absolute z-10'
                      style={{
                        top: product.position.top,
                        left: product.position.left,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      {/* Dot button */}
                      <div
                        className='relative group'
                        onClick={() =>
                          setActiveProduct(
                            activeProduct === index ? null : index
                          )
                        }
                      >
                        <span className='w-8 h-8 border-2 border-white rounded-full flex items-center justify-center relative overflow-hidden bg-white/30 backdrop-blur cursor-pointer transition-transform duration-300 hover:scale-110'>
                          <span className='w-3 h-3 rounded-full bg-white' />
                        </span>

                        {/* Product Card */}
                        <ProductCard
                          {...product}
                          isVisible={activeProduct === index}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Center Image */}
                  <div className='absolute top-1/2 left-1/2 md:left-2/3 w-[70%] md:w-full h-max transform -translate-x-1/2 -translate-y-1/2'>
                    <img
                      src='/assets/images/bg/girl.svg'
                      alt='Deals Cover'
                      className='h-auto w-[440px]'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Countdown Column */}
            <div className='p-6 md:p-14'>
              <div className='text-center border border-white rounded-[80px] rounded-tr-none md:p-14'>
                <div className='p-6 md:p-12 bg-white rounded-[80px] rounded-tr-none'>
                  <div className='max-w-md mx-auto'>
                    <span className='inline-block text-white bg-neutral-600 py-2 px-4 rounded-full font-medium text-sm mb-4 md:mb-6 uppercase'>
                      Only For Today
                    </span>
                    <h3 className='mb-4 md:pb-6 font-bold font-quicksand text-3xl uppercase'>
                      Deal of The Day
                    </h3>
                    <p className='text-neutral-600'>
                      Deal of the day for deals on consumer fashion clothes for
                      many other great daily offers
                    </p>
                  </div>
                  <div className='mt-6 md:mt-10'>
                    <div className='flex justify-center flex-wrap gap-2 md:gap-6'>
                      {[
                        { value: timeLeft.days, label: "Days" },
                        { value: timeLeft.hours, label: "Hour" },
                        { value: timeLeft.minutes, label: "Min" },
                        { value: timeLeft.seconds, label: "Sec" },
                      ].map((unit, index) => (
                        <div key={index} className='text-center'>
                          <span className='flex items-center justify-center w-12 h-12 md:w-14 md:h-14 font-semibold text-white rounded-lg bg-orange-600 text-xl'>
                            {String(unit.value).padStart(2, "0")}
                          </span>
                          <span className='mt-2 text-neutral-600 text-base uppercase font-medium block'>
                            {unit.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealsSection;
