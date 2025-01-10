"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { FilterAccordionProps, FilterCheckboxProps } from '@/components/shared/types/filterTypes';

export const FilterCheckbox: React.FC<FilterCheckboxProps> = ({
  label,
  checked,
  onChange,
  count,
  indent = false
}) => (
  <label className={`flex items-center justify-between py-1.5 cursor-pointer group 
    ${indent ? 'ml-4' : ''}`}>
    <div className="flex items-center">
      <motion.div
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center
          transition-colors duration-200 ${
            checked
              ? 'bg-orange-500 border-orange-500'
              : 'border-gray-300 group-hover:border-orange-300'
          }`}
        whileTap={{ scale: 0.9 }}
      >
        <motion.svg
          initial={false}
          animate={checked ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-3 h-3 text-white"
          viewBox="0 0 14 14"
        >
          <motion.path
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2 7L5.5 10.5L12 4"
          />
        </motion.svg>
      </motion.div>
      <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
        {label}
      </span>
    </div>
    {count !== undefined && (
      <span className="text-xs text-gray-500 group-hover:text-gray-700">
        ({count})
      </span>
    )}
  </label>
);

export const FilterAccordion: React.FC<FilterAccordionProps> = ({
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
      <motion.button
        type="button"
        onClick={onToggle}
        className="w-full py-4 flex items-center justify-between text-left group"
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-900 group-hover:text-orange-600">
            {title}
          </span>
          {badge && (
            <span className="px-2 py-0.5 text-xs font-medium text-orange-600 bg-orange-100 
              rounded-full">
              {badge}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-500 group-hover:text-orange-600"
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div ref={contentRef} className="pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterAccordion;