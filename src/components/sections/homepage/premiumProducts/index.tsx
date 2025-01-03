"use client";
import { ProductCard } from "@/components/shared/cards/productCard";
import { Product } from "@/components/shared/types/productTypes";
import React, { useState } from "react";

interface DummyProducts {
  onSale: Product[];
  featured: Product[];
  bestRated: Product[];
}

const dummyProducts: DummyProducts = {
  onSale: [
    {
      slug: "/",
      primaryImage: "/assets/images/products/armani.png",
      secondaryImage: "/assets/images/products/image3.png",
      title: "Creed Aventus EDP 100ml",
      price: 12500,
      originalPrice: 15000,
      discount: 29,
      rating: 4.8,
      reviews: 12000,
      isHot: true,
      brand: "Brand Name",
      category: "Category Name",
      inStock: true,
      endDate: new Date("2024-12-31"),
    },
    // Add more products as needed
  ],
  featured: [
    {
      slug: "/",
      primaryImage: "/assets/images/products/armani.png",
      secondaryImage: "/assets/images/products/image3.png",
      title: "Creed Aventus EDP 100ml",
      price: 12500,
      originalPrice: 15000,
      discount: 29,
      rating: 4.8,
      reviews: 12000,
      isHot: true,
      brand: "Brand Name",
      category: "Category Name",
      inStock: true,
      endDate: new Date("2024-12-31"),
    },
    {
      slug: "/",
      primaryImage: "/assets/images/products/armani.png",
      secondaryImage: "/assets/images/products/image3.png",
      title: "Creed Aventus EDP 100ml",
      price: 12500,
      originalPrice: 15000,
      discount: 29,
      rating: 4.8,
      reviews: 12000,
      isHot: true,
      brand: "Brand Name",
      category: "Category Name",
      inStock: true,
      endDate: new Date("2024-12-31"),
    },
    {
      slug: "/",
      primaryImage: "/assets/images/products/armani.png",
      secondaryImage: "/assets/images/products/image3.png",
      title: "Creed Aventus EDP 100ml",
      price: 12500,
      originalPrice: 15000,
      discount: 29,
      rating: 4.8,
      reviews: 12000,
      isHot: true,
      brand: "Brand Name",
      category: "Category Name",
      inStock: true,
      endDate: new Date("2024-12-31"),
    },
  ],
  bestRated: [
    {
      slug: "/",
      primaryImage: "/assets/images/products/armani.png",
      secondaryImage: "/assets/images/products/image3.png",
      title: "Creed Aventus EDP 100ml",
      price: 12500,
      originalPrice: 15000,
      discount: 29,
      rating: 4.8,
      reviews: 12000,
      isHot: true,
      brand: "Brand Name",
      category: "Category Name",
      inStock: true,
      endDate: new Date("2024-12-31"),
    },
    {
      slug: "/",
      primaryImage: "/assets/images/products/armani.png",
      secondaryImage: "/assets/images/products/image3.png",
      title: "Creed Aventus EDP 100ml",
      price: 12500,
      originalPrice: 15000,
      discount: 29,
      rating: 4.8,
      reviews: 12000,
      isHot: true,
      brand: "Brand Name",
      category: "Category Name",
      inStock: true,
      endDate: new Date("2024-12-31"),
    },
    {
      slug: "/",
      primaryImage: "/assets/images/products/armani.png",
      secondaryImage: "/assets/images/products/image3.png",
      title: "Creed Aventus EDP 100ml",
      price: 12500,
      originalPrice: 15000,
      discount: 29,
      rating: 4.8,
      reviews: 12000,
      isHot: true,
      brand: "Brand Name",
      category: "Category Name",
      inStock: true,
      endDate: new Date("2024-12-31"),
    },
  ],
};

export const PremiumProducts: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<keyof DummyProducts>("onSale");

  const handleTabSelect = (tab: keyof DummyProducts) => {
    setSelectedTab(tab);
  };

  return (
    <div className='px-4 md:px-12 xl:px-24 py-6 space-y-6 bg-white'>
      <div className='w-full  h-11 relative flex max-sm:flex-col max-sm:pb-24 max-sm:gap-4 max-sm:px-0 justify-between items-center'>
        <h1 className='text-[#121535] text-2xl font-bold uppercase font-quicksand'>
          Premium Products
        </h1>
        <div className='flex gap-2'>
          <span
            className={`cursor-pointer ${
              selectedTab === "onSale"
                ? "bg-[#fa6800] text-white border-[#fa6800]"
                : "border border-[#bdbdbd] text-[#121535]"
            } rounded-full pt-[6px] pb-2 px-4`}
            onClick={() => handleTabSelect("onSale")}
          >
            On Sale
          </span>
          <span
            className={`cursor-pointer ${
              selectedTab === "featured"
                ? "bg-[#fa6800] text-white border-[#fa6800]"
                : "border border-[#bdbdbd] text-[#121535]"
            } rounded-full pt-[6px] pb-2 px-4`}
            onClick={() => handleTabSelect("featured")}
          >
            Featured Products
          </span>
          <span
            className={`cursor-pointer ${
              selectedTab === "bestRated"
                ? "bg-[#fa6800] text-white border-[#fa6800]"
                : "border border-[#bdbdbd] text-[#121535]"
            } rounded-full pt-[6px] pb-2 px-4`}
            onClick={() => handleTabSelect("bestRated")}
          >
            Best Rated
          </span>
        </div>
      </div>

      <div className='flex flex-wrap gap-4 justify-center'>
        {dummyProducts[selectedTab].map((product, i) => (
          <ProductCard
            key={i}
            slug={product.slug}
            primaryImage={product.primaryImage}
            secondaryImage={product.secondaryImage}
            title={product.title}
            price={product.price}
            originalPrice={product.originalPrice}
            discount={product.discount}
            rating={product.rating}
            reviews={product.reviews}
            isHot={product.isHot}
            endDate={product.endDate}
            onAddToWishlist={() => console.log("Added to wishlist")}
            onQuickView={() => console.log("Quick view opened")}
            onCompare={() => console.log("Added to compare")}
            onAddToCart={() => console.log("Added to cart")}
            className='w-[360px]'
          />
        ))}
      </div>
    </div>
  );
};
