"use client";
import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SlideItem {
  id: string | number;
  content: React.ReactNode;
}

interface CustomSliderProps {
  slides: SlideItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
  containerClassName?: string;
  arrowClassName?: string;
  dotClassName?: string;
  activeDotClassName?: string;
  transitionDuration?: number;
  renderArrow?: {
    prev: React.ReactNode;
    next: React.ReactNode;
  };
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export const CustomSlider: React.FC<CustomSliderProps> = ({
  slides,
  autoPlay = true,
  autoPlayInterval = 5000,
  showArrows = true,
  showDots = true,
  className = "",
  containerClassName = "",
  arrowClassName = "",
  dotClassName = "",
  activeDotClassName = "",
  transitionDuration = 0.5,
  renderArrow
}) => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const paginate = useCallback((newDirection: number) => {
    if (!isAnimating) {
      setIsAnimating(true);
      setPage([page + newDirection, newDirection]);
      setTimeout(() => setIsAnimating(false), transitionDuration * 1000);
    }
  }, [page, isAnimating, transitionDuration]);

  const goToSlide = (index: number) => {
    if (!isAnimating) {
      const direction = index > page ? 1 : -1;
      setIsAnimating(true);
      setPage([index, direction]);
      setTimeout(() => setIsAnimating(false), transitionDuration * 1000);
    }
  };

  useEffect(() => {
    if (autoPlay) {
      const interval = setInterval(() => {
        if (!isAnimating) {
          paginate(1);
        }
      }, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, paginate, isAnimating]);

  const currentIndex = ((page % slides.length) + slides.length) % slides.length;

  const DefaultArrow = ({ direction }: { direction: "prev" | "next" }) => (
    <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-md hover:bg-white transition-colors">
      {direction === "prev" ? "←" : "→"}
    </div>
  );

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className={`relative h-full ${containerClassName}`}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: transitionDuration }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(_, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute w-full h-[90vh]"
          >
            {slides[currentIndex].content}
          </motion.div>
        </AnimatePresence>

        {showArrows && (
          <>
            <button
              onClick={() => paginate(-1)}
              className={`absolute -left-4 md:-left-10 top-1/2 -translate-y-1/2 z-10 ${arrowClassName}`}
              disabled={isAnimating}
            >
              {renderArrow?.prev || <DefaultArrow direction="prev" />}
            </button>
            <button
              onClick={() => paginate(1)}
              className={`absolute -right-6 md:-right-16 top-1/2 -translate-y-1/2 z-10 ${arrowClassName}`}
              disabled={isAnimating}
            >
              {renderArrow?.next || <DefaultArrow direction="next" />}
            </button>
          </>
        )}
      </div>

      {showDots && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentIndex === index
                  ? `bg-white ${activeDotClassName}`
                  : `bg-white/50 ${dotClassName}`
              }`}
              title="Go to slide"
            />
          ))}
        </div>
      )}
    </div>
  );
};