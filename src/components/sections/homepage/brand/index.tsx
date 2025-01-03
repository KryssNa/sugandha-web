"use client";

import { animate, motion, useMotionValue } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface NavigationButtonProps {
  direction: "left" | "right";
  onClick: () => void;
  children: React.ReactNode;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({
  direction,
  onClick,
  children,
}) => (
  <motion.button
    whileHover={{ scale: 1.1, backgroundColor: "#FA6800" }}
    whileTap={{ scale: 0.95 }}
    className={`
      hidden lg:flex items-center justify-center
      w-10 h-10 rounded-full
      border border-gray-200
      text-gray-600 hover:text-white
      transition-colors duration-300
      ${direction === "left" ? "mr-2" : "ml-2"}
    `}
    onClick={onClick}
  >
    {children}
  </motion.button>
);

const brands = [
  { id: 1, name: "Chanel", image: "/assets/images/brand/chanel.png" },
  { id: 2, name: "Creed", image: "/assets/images/brand/creed.png" },
  { id: 3, name: "Dior", image: "/assets/images/brand/dior.png" },
  { id: 4, name: "Gucci", image: "/assets/images/brand/gucci.png" },
  { id: 5, name: "YSL", image: "/assets/images/brand/YvesSaintLaurent.png" },
  { id: 6, name: "Dior", image: "/assets/images/brand/dior.png" },
  { id: 7, name: "Chanel", image: "/assets/images/brand/chanel.png" },
  { id: 8, name: "Dior", image: "/assets/images/brand/dior.png" },
  { id: 9, name: "Creed", image: "/assets/images/brand/creed.png" },
];

const Brand = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(8);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(0);
  const autoScrollInterval = 3000;
  const sliderRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  // Handle responsive sizing
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width > 1599) setItemsToShow(8);
      else if (width > 1399) setItemsToShow(7);
      else if (width > 992) setItemsToShow(6);
      else if (width > 575) setItemsToShow(5);
      else if (width > 424) setItemsToShow(4);
      else if (width > 359) setItemsToShow(3);
      else setItemsToShow(2);

      if (sliderRef.current) {
        setSliderWidth(
          sliderRef.current.scrollWidth - sliderRef.current.offsetWidth
        );
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (sliderRef.current) {
      setSliderWidth(
        sliderRef.current.scrollWidth - sliderRef.current.offsetWidth
      );
    }
  }, [itemsToShow]);

  const slideLeft = useCallback(() => {
    const newX = Math.min(x.get() + sliderWidth / brands.length, 0);
    animate(x, newX, { type: "spring", stiffness: 200, damping: 30 });
    setCurrentIndex((prev) =>
      prev === 0 ? brands.length - itemsToShow : prev - 1
    );
  }, [itemsToShow, sliderWidth, x]);

  const slideRight = useCallback(() => {
    const newX = Math.max(x.get() - sliderWidth / brands.length, -sliderWidth);
    animate(x, newX, { type: "spring", stiffness: 200, damping: 30 });
    setCurrentIndex((prev) =>
      prev === brands.length - itemsToShow ? 0 : prev + 1
    );
  }, [itemsToShow, sliderWidth, x]);

  // Auto-scroll functionality
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (!isHovered && !isDragging) {
      intervalId = setInterval(() => {
        slideRight();
      }, autoScrollInterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isHovered, isDragging, slideRight]);

  const handleDragStart = () => {
    setIsDragging(true);
    setIsHovered(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setIsHovered(false);
  };



  return (
    <div className='overflow-hidden bg-white py-12'>
      <div className='container mx-auto px-4'>
        <div className='border border-gray-100 rounded-2xl p-6 md:p-8'>
          <div className='flex items-center justify-between mb-6'>
            <h1 className='text-[#121535] text-2xl font-bold uppercase font-quicksand'>
              TOP Brands
            </h1>
            <div className='flex items-center'>
              <NavigationButton direction='left' onClick={slideLeft}>
                <ChevronLeft className='w-6 h-6' />
              </NavigationButton>
              <NavigationButton direction='right' onClick={slideRight}>
                <ChevronRight className='w-6 h-6' />
              </NavigationButton>
            </div>
          </div>

          <div
            className='relative overflow-hidden cursor-grab active:cursor-grabbing'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            ref={sliderRef}
          >
            <motion.div
              className='flex gap-4'
              drag='x'
              dragConstraints={{ right: 0, left: -sliderWidth }}
              dragElastic={0.1}
              dragMomentum={false}
              style={{ x }}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              {brands.map((brand) => (
                <motion.div
                  key={brand.id}
                  className={`flex-none w-1/${itemsToShow} min-w-0`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className='relative rounded-lg overflow-hidden bg-gray-50 p-4 aspect-auto flex items-center justify-center'>
                    <motion.img
                      src={brand.image}
                      alt={brand.name}
                      className='h-24 lg:h-32 w-32 object-contain'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      loading='lazy'
                      draggable={false}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brand;
