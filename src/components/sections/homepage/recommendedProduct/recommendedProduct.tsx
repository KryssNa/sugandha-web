"use client";
import { ProductSlider } from "@/components/shared/sliders/productSlider";
import { RootState } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { fetchProducts } from "@/store/slices/productSlice";
import Link from "next/link";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";


export const RecommendedProducts: React.FC = () => {
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
          Recommended Product
        </h1>
        <Link
          className='border border-[#bdbdbd] text-[#121535] rounded-md pt-[6px] pb-2 px-4 hover:bg-[#fa6800] hover:text-white cursor-pointer'
          href='/'
        >
          View All
        </Link>
      </div>
      <ProductSlider products={products} position='left' />
    </div>
  );
};
