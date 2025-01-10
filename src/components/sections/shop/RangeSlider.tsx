"use client";

import { RangeSliderProps } from '@/components/shared/types/filterTypes';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const RangeSlider: React.FC<RangeSliderProps> = ({
  range,
  onChange,
  formatValue = (value) => `₹${value.toLocaleString()}`,
  step = 100
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const [showTooltip, setShowTooltip] = useState<number | null>(null);
  const [values, setValues] = useState<[number, number]>(range.current);

  const calculatePosition = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return 0;

      const { left, width } = sliderRef.current.getBoundingClientRect();
      const percentage = Math.min(Math.max((clientX - left) / width, 0), 1);
      const value = Math.round(((range.max - range.min) * percentage + range.min) / step) * step;
      return value;
    },
    [range.max, range.min, step]
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent, handleIndex: number) => {
      event.preventDefault();
      setIsDragging(handleIndex);
    },
    []
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (isDragging === null) return;

      const newValue = calculatePosition(event.clientX);
      setValues(prev => {
        const newValues: [number, number] = [...prev];
        newValues[isDragging] = newValue;

        // Ensure handles don't cross
        if (isDragging === 0 && newValue > prev[1]) {
          newValues[0] = prev[1];
        } else if (isDragging === 1 && newValue < prev[0]) {
          newValues[1] = prev[0];
        }

        return newValues as [number, number];
      });
    },
    [isDragging, calculatePosition]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging !== null) {
      setIsDragging(null);
      onChange(values);
    }
  }, [isDragging, onChange, values]);

  useEffect(() => {
    if (isDragging !== null) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const getLeft = (value: number) =>
    ((value - range.min) / (range.max - range.min)) * 100;

  return (
    <div className="relative pt-8 pb-4 px-2">
      {/* Range Track */}
      <div
        ref={sliderRef}
        className="h-2 bg-gray-200 rounded-full relative"
      >
        {/* Selected Range */}
        <div
          className="absolute h-full bg-orange-500 rounded-full"
          style={{
            left: `${getLeft(values[0])}%`,
            right: `${100 - getLeft(values[1])}%`
          }}
        />

        {/* Handles */}
        {[0, 1].map((handleIndex) => (
          <motion.div
            key={handleIndex}
            className="absolute top-1/2 -mt-3 -ml-3 w-6 h-6 bg-white rounded-full 
              shadow-md border-2 border-orange-500 cursor-pointer hover:scale-110 
              transition-transform duration-200"
            style={{ left: `${getLeft(values[handleIndex])}%` }}
            onMouseDown={(e) => handleMouseDown(e, handleIndex)}
            onMouseEnter={() => setShowTooltip(handleIndex)}
            onMouseLeave={() => setShowTooltip(null)}
            whileTap={{ scale: 1.2 }}
          >
            <AnimatePresence>
              {showTooltip === handleIndex && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: -40 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute -top-2 left-1/2 transform -translate-x-1/2 
                    bg-gray-900 text-white px-2 py-1 rounded text-sm whitespace-nowrap"
                >
                  {formatValue(values[handleIndex])}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Value Labels */}
      <div className="flex justify-between mt-6">
        <div className="relative p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
          <span className="text-sm font-medium text-gray-700">{formatValue(values[0])}</span>
        </div>
        <div className="relative p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
          <span className="text-sm font-medium text-gray-700">{formatValue(values[1])}</span>
        </div>
      </div>
    </div>
  );
};

export default RangeSlider;