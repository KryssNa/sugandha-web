"use client";
import { ProductSlider } from "@/components/shared/sliders/productSlider";
import { Product } from "@/components/shared/types/productTypes";
import Link from "next/link";
import React from "react";

const dummyProducts: Product[] = [
  {
    slug: "creed-aventus-edp-100ml",
    primaryImage: "/assets/images/products/armani.png",
    secondaryImage: "/assets/images/products/image3.png",
    title: "Creed Aventus EDP 100ml",
    price: 12500,
    originalPrice: 15000,
    discount: 29,
    rating: 4.8,
    reviews: 12000,
    isHot: true,
    brand: "Armani",
    category: "Perfume",
    inStock: true,
  },
  {
    slug: "creed-aventus-edp-100ml",
    primaryImage: "/assets/images/products/armani.png",
    secondaryImage: "/assets/images/products/image3.png",
    title: "Creed Aventus EDP 100ml",
    price: 12500,
    originalPrice: 15000,
    discount: 29,
    rating: 4.8,
    reviews: 12000,
    isHot: true,
    brand: "Armani",
    category: "Perfume",
    inStock: true,
  },
  {
    slug: "creed-aventus-edp-100ml",
    primaryImage: "/assets/images/products/armani.png",
    secondaryImage: "/assets/images/products/image3.png",
    title: "Creed Aventus EDP 100ml",
    price: 12500,
    originalPrice: 15000,
    discount: 29,
    rating: 4.8,
    reviews: 12000,
    isHot: true,
    brand: "Armani",
    category: "Perfume",
    inStock: true,
  },
  {
    slug: "creed-aventus-edp-100ml",
    primaryImage: "/assets/images/products/armani.png",
    secondaryImage: "/assets/images/products/image3.png",
    title: "Creed Aventus EDP 100ml",
    price: 12500,
    originalPrice: 15000,
    discount: 29,
    rating: 4.8,
    reviews: 12000,
    isHot: true,
    brand: "Armani",
    category: "Perfume",
    inStock: true,
  },
  {
    slug: "creed-aventus-edp-100ml",
    primaryImage: "/assets/images/products/armani.png",
    secondaryImage: "/assets/images/products/image3.png",
    title: "Creed Aventus EDP 100ml",
    price: 12500,
    originalPrice: 15000,
    discount: 29,
    rating: 4.8,
    reviews: 12000,
    isHot: true,
    brand: "Armani",
    category: "Perfume",
    inStock: true,
  },
  // Add more products as needed
];

export const RecommendedProducts: React.FC = () => {
  return (
    <div className='px-4 md:px-12 xl:px-24 py-6 md:py-16 space-y-6 bg-white'>
      <div className='w-full h-11 relative flex max-sm:flex-col max-sm:pb-24 max-sm:gap-4 max-sm:px-0 justify-between items-center'>
        <h1 className='text-[#121535] text-2xl font-bold uppercase font-quicksand'>
          Recommended Product
        </h1>
        <Link
          className='border border-[#bdbdbd] text-[#121535] rounded-md pt-[6px] pb-2 px-4 hover:bg-[#fa6800] hover:text-white cursor-pointer'
          href='/'
        >
          View All
        </Link>
      </div>
      <ProductSlider products={dummyProducts} position='left' />
    </div>
  );
};
