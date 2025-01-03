import Image from "next/image";
import React from "react";

export const GiftSection: React.FC = () => {
  return (
    <div className='px-4 md:px-12 xl:px-24 py-6 md:py-16 bg-white'>
      <div className='flex flex-row items-center justify-between bg-slate-100 p-6 rounded-sm max-md:bg-gift bg-cover'>
        <div className='px-6 space-y-4'>
          <h1 className='text-[#121535] text-3xl font-extrabold uppercase font-quicksand'>
            Gift Certificate
          </h1>
          <button
            title='gift'
            className='text-[#121535] uppercase font-bold text-sm border-2 border-[#121535] hover:border-[#121535] transition-colors py-2 px-3'
          >
            Get a Gift Certificate
          </button>
        </div>
        <div className='rounded-sm max-md:hidden'>
          <Image
            src={"/assets/images/additional/gift.svg"}
            alt='gift'
            width={800}
            height={300}
            className='object-cover rounded-md'
          />
        </div>
      </div>
      <div className='flex flex-col sm:flex-row gap-12  mt-6 '>
        <div className='flex flex-row items-center justify-between max-lg:bg-luxury p-6 rounded-sm w-full sm:w-1/2 border-2 border-[#F5F6F6]'>
          <div className='relative flex flex-col w-full  lg:w-64  space-y-1'>
            <div className='  text-black text-base font-normal uppercase'>
              Join Our
            </div>
            <div className='  text-black text-2xl font-extrabold uppercase'>
              Subscription Club
            </div>
            <div className=' text-black text-sm font-light py-2'>
              as low as $9.95/month
            </div>
            <div className=' w-48 h-12 flex justify-center items-center bg-[#be5b75]'>
              <span className='text-white text-sm font-bold uppercase'>
                Learn More
              </span>
            </div>
          </div>
          <div className='relative flex'>
            <Image
              src={"/assets/images/additional/luxury.svg"}
              alt='gift wrapper'
              width={1}
              height={1}
              className='object-cover rounded-md max-lg:hidden xl:h-40 2xl:h-56 w-auto'
            />
            <Image
              src={"/assets/images/additional/scent_bg.svg"}
              alt='gift wrapper'
              width={1}
              height={1}
              className='absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md h-full w-auto'
            />
          </div>
        </div>
        <div className='flex flex-row items-center justify-between max-lg:bg-giftwrapper bg-opacity-75 object-cover p-6 rounded-sm w-full sm:w-1/2 border-2 border-[#F5F6F6]'>
          <div className='relative flex flex-col w-64  space-y-1'>
            <div className='  text-black text-2xl font-extrabold uppercase'>
              Win a $250 Spopping spree
            </div>
            <div className=' text-black text-sm font-light py-2'>
              Monthy Giveway
            </div>
            <div className=' w-48 h-12 flex justify-center items-center bg-[#4D2952]'>
              <span className='text-white text-sm font-bold uppercase'>
                Learn More
              </span>
            </div>
          </div>
          <div className='max-lg:hidden relative flex'>
            <Image
              src={"/assets/images/additional/gift_wrapper.svg"}
              alt='gift wrapper'
              width={1}
              height={1}
              className='object-cover rounded-md h-56 w-auto xl:pr-12 2xl:pr-24'
            />
          </div>
        </div>
      </div>
    </div>
  );
};
