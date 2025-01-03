"use client";
import React, { useEffect, useState } from "react";
import { ScrollToTopIcon } from "./svgicon";

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    toggleVisibility(); // Check initial position
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <button
      onClick={scrollToTop}
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 50,
        transform: isVisible ? 'translateY(0)' : 'translateY(5rem)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 300ms ease-in-out'
      }}
      className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 
                 text-white shadow-lg hover:shadow-xl hover:scale-110 
                 focus:outline-none focus:ring-2 focus:ring-blue-400 
                 focus:ring-opacity-50"
      aria-label="Scroll to top"
    >
      <ScrollToTopIcon />
    </button>
  );
};

export default ScrollToTop;