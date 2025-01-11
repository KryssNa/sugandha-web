"use client";
import OfferCard from "@/components/shared/cards/offerCard";
import { ProductSlider } from "@/components/shared/sliders/productSlider";
import { RootState } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { fetchProducts } from "@/store/slices/productSlice";
import Link from "next/link";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

export const NewArrivals: React.FC = () => {
  const dispatch = useAppDispatch();

  const { products, loading, metadata } = useSelector(
    (state: RootState) => state.product
  );
  // Fetch products when component mounts or filters change
  useEffect(() => {
    dispatch(fetchProducts({}));  // Dispatch the action to fetch products with filters
  }, [dispatch]);

  return (
    <div className='px-4 md:px-12 xl:px-24 py-6 md:py-16 space-y-6 bg-white'>
      <div className='w-full h-11 relative flex max-sm:flex-col max-sm:pb-24 max-sm:gap-4 max-sm:px-0 justify-between items-center'>
        <h1 className='text-[#121535] text-2xl font-bold uppercase font-quicksand'>
          New Arrivals
        </h1>
        <Link
          className='border border-[#bdbdbd] text-[#121535] rounded-md pt-[6px] pb-2 px-4 hover:bg-[#fa6800] hover:text-white cursor-pointer'
          href='/'
        >
          View All
        </Link>
      </div>

      {/* Right slide section */}
      <div className='flex flex-col justify-between md:flex-row gap-4'>
        <div className='offercard flex flex-col justify-center items-center'>
          <OfferCard
            backgroundImage='/assets/images/products/image3.png'
            modelImage='/assets/images/bg/offerimage.svg'
            discount='85%'
            onShopNow={() => console.log("Shop Now clicked")}
          />
        </div>
        <div className='w-full md:w-[40%] lg:w-[51%] xl:w-[60%] 2xl:w-[67%]'>
          <ProductSlider products={products} position='right' />
        </div>
      </div>

      {/* Left slide section */}
      <div className='flex flex-col justify-between md:flex-row gap-4'>
        <div className='w-full md:w-[40%] lg:w-[50%] xl:w-[60%] 2xl:w-[67%]'>
          <ProductSlider products={products} position='left' />
        </div>
        <div className='offercard flex flex-col justify-center items-center'>
          <OfferCard
            backgroundImage='/assets/images/products/image3.png'
            modelImage='/assets/images/bg/offerimage.svg'
            discount='85%'
            onShopNow={() => console.log("Shop Now clicked")}
          />
        </div>
      </div>
    </div>
  );
};

export default NewArrivals;
