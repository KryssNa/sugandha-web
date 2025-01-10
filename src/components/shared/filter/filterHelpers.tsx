"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Product } from "../types/productTypes";
import { 
  FilterAccordionProps, 
  ProductFilterProps, 
  RangeSliderProps, 
  FilterCheckboxProps 
} from "../types/filterTypes";
import { Search, X } from "lucide-react";

// Format currency utility
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

// Custom Range Slider
export const CustomSlider: React.FC<RangeSliderProps> = ({
  range,
  onChange,
  step = 100,
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleInteraction = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.min(Math.max(x / rect.width, 0), 1);
      const newValue = Math.round(((range.max - range.min) * percentage) / step) * step + range.min;
      onChange([Math.min(Math.max(newValue, range.min), range.max), range.max]);
    },
    [range, step, onChange]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleInteraction(e.clientX);
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleInteraction]);

  const percentage = ((range.max - range.min) / (range.max - range.min)) * 100;

  return (
    <div className="relative py-4">
      <div
        ref={sliderRef}
        className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
        onMouseDown={() => setIsDragging(true)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div
          className="absolute h-full bg-orange-500 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
        <div
          className="absolute w-5 h-5 bg-white border-2 border-orange-500 rounded-full -mt-1.5 
            transform -translate-x-1/2 hover:scale-110 transition-transform shadow-md"
          style={{ left: `${percentage}%` }}
        >
          {showTooltip && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white 
              px-2 py-1 rounded text-xs whitespace-nowrap z-10">
              {formatCurrency(range.min)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Checkbox Component
export const CustomCheckbox: React.FC<FilterCheckboxProps> = ({
  label,
  checked,
  onChange,
  count,
  indent = false,
}) => (
  <label className={`flex items-center justify-between py-1.5 cursor-pointer group 
    ${indent ? 'ml-4' : ''}`}>
    <div className="flex items-center">
      <div
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
          ${checked 
            ? "bg-orange-500 border-orange-500" 
            : "border-gray-300 group-hover:border-orange-500"
          }`}
        onClick={() => onChange(!checked)}
      >
        {checked && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 14 14">
            <path
              d="M2 7L5.5 10.5L12 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        )}
      </div>
      <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
    </div>
    {count !== undefined && (
      <span className="text-xs text-gray-500 group-hover:text-gray-700">({count})</span>
    )}
  </label>
);

// Accordion Component
export const CustomAccordion: React.FC<FilterAccordionProps> = ({
  title,
  children,
  isOpen,
  onToggle,
  badge
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        if (contentRef.current) {
          setHeight(contentRef.current.scrollHeight);
        }
      });

      resizeObserver.observe(contentRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full py-4 flex items-center justify-between text-left group"
      >
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-900 group-hover:text-orange-600">
            {title}
          </span>
          {badge && (
            <span className="px-2 py-0.5 text-xs font-medium text-orange-600 bg-orange-100 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 transition-transform duration-200 text-gray-500 group-hover:text-orange-600
            ${isOpen ? "transform rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        style={{
          height: isOpen ? height : 0,
          overflow: "hidden",
          transition: "height 0.3s ease-in-out",
        }}
      >
        <div ref={contentRef}>{children}</div>
      </div>
    </div>
  );
};

// Main Product Filter Component
// const ProductFilter: React.FC<ProductFilterProps> = ({
//   products,
//   onFilterChange,
//   className = "",
// }) => {
//   // State
//   const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
//   const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [selectedRating, setSelectedRating] = useState<number | undefined>();
//   const [selectedAvailability, setSelectedAvailability] = useState<
//     "all" | "inStock" | "outOfStock"
//   >("all");
//   const [openSection, setOpenSection] = useState<string>("price");

//   // Calculate min and max prices from products
//   const maxPrice = Math.max(...products.map((p) => p.basePrice));
//   const minPrice = Math.min(...products.map((p) => p.basePrice));

//   useEffect(() => {
//     setPriceRange([minPrice, maxPrice]);
//   }, [minPrice, maxPrice]);

//   // Calculate unique brands and categories
//   const brands = [...new Set(products.map((p) => p.brand))].sort();
//   const categories = [...new Set(products.map((p) => p.category))].sort();

//   // Calculate counts
//   const brandCounts = brands.reduce((acc, brand) => {
//     acc[brand] = products.filter((p) => p.brand === brand).length;
//     return acc;
//   }, {} as Record<string, number>);

//   const categoryCounts = categories.reduce((acc, category) => {
//     acc[category] = products.filter((p) => p.category === category).length;
//     return acc;
//   }, {} as Record<string, number>);

//   // Rating counts
//   const ratingCounts = [4, 3, 2, 1].reduce((acc, rating) => {
//     acc[rating] = products.filter((p) => p.rating >= rating).length;
//     return acc;
//   }, {} as Record<number, number>);

//   // Availability counts
//   const availabilityCounts = {
//     inStock: products.filter((p) => p.inStock).length,
//     outOfStock: products.filter((p) => !p.inStock).length,
//   };

//   const handlePriceChange = (value: number, index: number) => {
//     const newRange: [number, number] = [...priceRange];
//     newRange[index] = value;
//     if (index === 0 && value > newRange[1]) {
//       newRange[1] = value;
//     } else if (index === 1 && value < newRange[0]) {
//       newRange[0] = value;
//     }
//     setPriceRange(newRange);
//   };

//   const handleBrandToggle = (brand: string) => {
//     setSelectedBrands((prev) =>
//       prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
//     );
//   };

//   const handleCategoryToggle = (category: string) => {
//     setSelectedCategories((prev) =>
//       prev.includes(category)
//         ? prev.filter((c) => c !== category)
//         : [...prev, category]
//     );
//   };

//   const handleRatingChange = (rating: number) => {
//     setSelectedRating(selectedRating === rating ? undefined : rating);
//   };

//   const handleAvailabilityChange = (
//     availability: "all" | "inStock" | "outOfStock"
//   ) => {
//     setSelectedAvailability(availability);
//   };

//   const clearAllFilters = () => {
//     setPriceRange([minPrice, maxPrice]);
//     setSelectedBrands([]);
//     setSelectedCategories([]);
//     setSearchQuery("");
//     setSelectedRating(undefined);
//     setSelectedAvailability("all");
//   };

//   useEffect(() => {
//     onFilterChange({
//       priceRange,
//       brands: selectedBrands,
//       categories: selectedCategories,
//       search: searchQuery,
//       rating: selectedRating,
//       availability: selectedAvailability,
//     });
//   }, [
//     priceRange,
//     selectedBrands,
//     selectedCategories,
//     searchQuery,
//     selectedRating,
//     selectedAvailability,
//     onFilterChange,
//   ]);

//   return (
//     <div
//       className={`bg-white p-4 rounded-lg border border-gray-200 space-y-6 ${className}`}
//     >
//       {/* Header */}
//       <div className='flex items-center justify-between'>
//         <h2 className='text-lg font-semibold text-gray-900'>Filters</h2>
//         <button
//           onClick={clearAllFilters}
//           className='text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 
//               transition-colors duration-200'
//           type='button'
//         >
//           Clear All
//           <span className='text-lg'>×</span>
//         </button>
//       </div>

//       {/* Search */}
//       <div className='relative'>
//         <input
//           type='text'
//           placeholder='Search products...'
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className='w-full px-4 py-2 border border-gray-200 rounded-lg pl-10 
//               focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
//               transition-shadow duration-200'
//         />
//         <svg
//           className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4'
//           fill='none'
//           stroke='currentColor'
//           viewBox='0 0 24 24'
//         >
//           <path
//             strokeLinecap='round'
//             strokeLinejoin='round'
//             strokeWidth={2}
//             d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
//           />
//         </svg>
//       </div>

//       {/* Price Range */}
//       <CustomAccordion
//         title='Price Range'
//         isOpen={openSection === "price"}
//         onToggle={() => setOpenSection(openSection === "price" ? "" : "price")}
//       >
//         <div className='p-4 space-y-4'>
//           <div className='space-y-6'>
//             <CustomSlider
//               value={priceRange[0]}
//               onChange={(value) => handlePriceChange(value, 0)}
//               min={minPrice}
//               max={maxPrice}
//               step={100}
//             />
//             <CustomSlider
//               value={priceRange[1]}
//               onChange={(value) => handlePriceChange(value, 1)}
//               min={minPrice}
//               max={maxPrice}
//               step={100}
//             />
//           </div>
//           <div className='flex justify-between text-sm text-gray-600'>
//             <span>{formatCurrency(priceRange[0])}</span>
//             <span>{formatCurrency(priceRange[1])}</span>
//           </div>
//         </div>
//       </CustomAccordion>

//       {/* Brands */}
//       <CustomAccordion
//         title='Brands'
//         isOpen={openSection === "brands"}
//         onToggle={() =>
//           setOpenSection(openSection === "brands" ? "" : "brands")
//         }
//       >
//         <div className='p-4 space-y-2'>
//           {brands.map((brand) => (
//             <CustomCheckbox
//               key={brand}
//               label={brand}
//               checked={selectedBrands.includes(brand)}
//               onChange={() => handleBrandToggle(brand)}
//               count={brandCounts[brand]}
//             />
//           ))}
//         </div>
//       </CustomAccordion>

//       {/* Categories */}
//       <CustomAccordion
//         title='Categories'
//         isOpen={openSection === "categories"}
//         onToggle={() =>
//           setOpenSection(openSection === "categories" ? "" : "categories")
//         }
//       >
//         <div className='p-4 space-y-2'>
//           {categories.map((category) => (
//             <CustomCheckbox
//               key={category}
//               label={category}
//               checked={selectedCategories.includes(category)}
//               onChange={() => handleCategoryToggle(category)}
//               count={categoryCounts[category]}
//             />
//           ))}
//         </div>
//       </CustomAccordion>

//       {/* Rating */}
//       <CustomAccordion
//         title='Rating'
//         isOpen={openSection === "rating"}
//         onToggle={() =>
//           setOpenSection(openSection === "rating" ? "" : "rating")
//         }
//       >
//         <div className='p-4 space-y-2'>
//           {[4, 3, 2, 1].map((rating) => (
//             <div
//               key={rating}
//               className='flex items-center justify-between cursor-pointer'
//               onClick={() => handleRatingChange(rating)}
//             >
//               <div className='flex items-center space-x-2'>
//                 <div className='flex'>
//                   {Array.from({ length: 5 }).map((_, index) => (
//                     <svg
//                       key={index}
//                       className={`w-4 h-4 ${
//                         index < rating ? "text-yellow-400" : "text-gray-300"
//                       }`}
//                       fill='currentColor'
//                       viewBox='0 0 20 20'
//                     >
//                       <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
//                     </svg>
//                   ))}
//                 </div>
//                 <span className='text-sm text-gray-600'>& Up</span>
//               </div>
//               <span className='text-xs text-gray-500'>
//                 ({ratingCounts[rating]})
//               </span>
//             </div>
//           ))}
//         </div>
//       </CustomAccordion>

//       {/* Availability */}
//       <CustomAccordion
//         title='Availability'
//         isOpen={openSection === "availability"}
//         onToggle={() =>
//           setOpenSection(openSection === "availability" ? "" : "availability")
//         }
//       >
//         <div className='p-4 space-y-2'>
//           <CustomCheckbox
//             label='In Stock'
//             checked={selectedAvailability === "inStock"}
//             onChange={() => handleAvailabilityChange("inStock")}
//             count={availabilityCounts.inStock}
//           />
//           <CustomCheckbox
//             label='Out of Stock'
//             checked={selectedAvailability === "outOfStock"}
//             onChange={() => handleAvailabilityChange("outOfStock")}
//             count={availabilityCounts.outOfStock}
//           />
//         </div>
//       </CustomAccordion>
//       {/* Active Filters */}
//       {(selectedBrands.length > 0 ||
//         selectedCategories.length > 0 ||
//         selectedRating ||
//         selectedAvailability !== "all") && (
//         <div className='space-y-2'>
//           <h3 className='text-sm font-medium text-gray-900'>Active Filters</h3>
//           <div className='flex flex-wrap gap-2'>
//             {selectedBrands.map((brand) => (
//               <span
//                 key={brand}
//                 className='inline-flex items-center px-2 py-1 rounded-full text-xs 
//                   font-medium bg-orange-50 text-orange-700 group'
//               >
//                 {brand}
//                 <button
//                   onClick={() => handleBrandToggle(brand)}
//                   className='ml-1 text-orange-500 hover:text-orange-700 transition-colors'
//                   type='button'
//                 >
//                   ×
//                 </button>
//               </span>
//             ))}
//             {selectedCategories.map((category) => (
//               <span
//                 key={category}
//                 className='inline-flex items-center px-2 py-1 rounded-full text-xs 
//                   font-medium bg-orange-50 text-orange-700 group'
//               >
//                 {category}
//                 <button
//                   onClick={() => handleCategoryToggle(category)}
//                   className='ml-1 text-orange-500 hover:text-orange-700 transition-colors'
//                   type='button'
//                 >
//                   ×
//                 </button>
//               </span>
//             ))}
//             {selectedRating && (
//               <span
//                 className='inline-flex items-center px-2 py-1 rounded-full text-xs 
//                 font-medium bg-orange-50 text-orange-700 group'
//               >
//                 {selectedRating}★ & Up
//                 <button
//                   onClick={() => setSelectedRating(undefined)}
//                   className='ml-1 text-orange-500 hover:text-orange-700 transition-colors'
//                   type='button'
//                 >
//                   ×
//                 </button>
//               </span>
//             )}
//             {selectedAvailability !== "all" && (
//               <span
//                 className='inline-flex items-center px-2 py-1 rounded-full text-xs 
//                 font-medium bg-orange-50 text-orange-700 group'
//               >
//                 {selectedAvailability === "inStock"
//                   ? "In Stock"
//                   : "Out of Stock"}
//                 <button
//                   onClick={() => setSelectedAvailability("all")}
//                   className='ml-1 text-orange-500 hover:text-orange-700 transition-colors'
//                   type='button'
//                 >
//                   ×
//                 </button>
//               </span>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Mobile Apply Filters Button */}
//       <div className='md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50'>
//         <div className='flex space-x-4 max-w-md mx-auto'>
//           <button
//             onClick={clearAllFilters}
//             className='w-1/2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 
//               hover:bg-gray-50 transition-colors duration-200'
//             type='button'
//           >
//             Clear All
//           </button>
//           <button
//             onClick={() => setOpenSection("")}
//             className='w-1/2 px-4 py-2 bg-orange-500 text-white rounded-lg 
//               hover:bg-orange-600 transition-colors duration-200'
//             type='button'
//           >
//             Apply Filters
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductFilter;
