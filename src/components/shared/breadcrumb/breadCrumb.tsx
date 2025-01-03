"use client";
import { ChevronRight, Home, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BreadcrumbItem {
  title: string;
  url: string;
  bgImage?: string;
  featuredImage?: string;
  description?: string;
  fragranceNotes?: {
    top?: string[];
    middle?: string[];
    base?: string[];
  };
  collections?: Array<{
    name: string;
    url: string;
    image?: string;
  }>;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  defaultBgImage?: string;
}

export const PremiumBreadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className = "",
  defaultBgImage = "/assets/images/breadcrumb.png",
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [currentBgImage, setCurrentBgImage] = useState(defaultBgImage);

  useEffect(() => {
    if (hoveredIndex !== null && items[hoveredIndex]?.bgImage) {
      setCurrentBgImage(items[hoveredIndex].bgImage);
    } else {
      setCurrentBgImage(defaultBgImage);
    }
  }, [hoveredIndex, items, defaultBgImage]);

  return (
    <div className='relative w-full overflow-hidden min-h-[300px] group'>
      {/* Enhanced Background with Parallax Effect */}
      <div className='absolute inset-0 w-full h-full'>
        <div
          className='absolute inset-0 bg-cover bg-center transition-all duration-1000 transform group-hover:scale-105'
          style={{
        backgroundImage: `url(${currentBgImage})`,
        opacity: hoveredIndex !== null ? 0.3 : 0.2,
          }}
        />
        <div className='absolute inset-0 bg-gradient-to-l from-[#fceabb] via-[#f8d9a7] to-[#f5cda0]' />
      </div>

      {/* Premium Navigation Container */}
      <div className='relative z-10 container mx-auto px-4 h-full'>
        <div className='flex justify-end items-start h-full'>
          {/* Right-aligned Navigation Content */}
          <nav aria-label='Breadcrumb' className={`py-12 ${className}`}>
            <div className='flex flex-col items-end space-y-6'>
              {/* Elegant Breadcrumb Path */}
              <ol className='flex flex-wrap items-center gap-3 justify-end'>
                <li className='flex items-center'>
                  <Link
                    href='/'
                    className='flex items-center text-white/80 hover:text-white transition-all duration-300 group'
                    onMouseEnter={() => setHoveredIndex(null)}
                  >
                    <Home className='w-5 h-5 group-hover:scale-110 transition-transform duration-300' />
                    <span className='sr-only'>Home</span>
                  </Link>
                </li>

                {items.map((item, index) => (
                  <li
                    key={index}
                    className='flex items-center'
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <ChevronRight className='w-5 h-5 text-white/40 mx-2' />

                    <div className='relative group'>
                      <button
                        onClick={() =>
                          setActiveIndex(activeIndex === index ? null : index)
                        }
                        className='flex items-center space-x-2 text-white/80 hover:text-white transition-all duration-300'
                      >
                        <Sparkles className='w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                        <span className='text-sm font-light tracking-widest uppercase'>
                          {item.title}
                        </span>
                      </button>

                      {/* Premium Dropdown Panel */}
                      {activeIndex === index && (
                        <div className='absolute top-full right-0 mt-6 w-[500px] bg-grey backdrop-blur-md rounded-lg shadow-2xl p-8 z-50 transform transition-all duration-500'>
                          {item.featuredImage && (
                            <div className='relative h-48 mb-6 overflow-hidden rounded-lg'>
                              <Image
                                src={item.featuredImage}
                                alt={item.title}
                                fill
                                className='object-cover transform hover:scale-105 transition-transform duration-700'
                              />
                              <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
                              <div className='absolute bottom-0 left-0 p-4'>
                                <h3 className='text-white text-xl font-light tracking-wider'>
                                  {item.title}
                                </h3>
                                {item.description && (
                                  <p className='text-white/80 text-sm mt-2'>
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Elegant Fragrance Notes Section */}
                          {item.fragranceNotes && (
                            <div className='mb-8 space-y-4 border-b border-white/10 pb-8'>
                              <h3 className='text-white/90 text-sm font-medium tracking-wider'>
                                Fragrance Notes
                              </h3>
                              <div className='grid grid-cols-3 gap-6 text-xs'>
                                {item.fragranceNotes.top && (
                                  <div className='space-y-2'>
                                    <span className='block text-white/80 font-medium tracking-wider'>
                                      Top Notes
                                    </span>
                                    {item.fragranceNotes.top.map((note, i) => (
                                      <span
                                        key={i}
                                        className='block text-white/60'
                                      >
                                        {note}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {item.fragranceNotes.middle && (
                                  <div className='space-y-2'>
                                    <span className='block text-white/80 font-medium tracking-wider'>
                                      Middle Notes
                                    </span>
                                    {item.fragranceNotes.middle.map(
                                      (note, i) => (
                                        <span
                                          key={i}
                                          className='block text-white/60'
                                        >
                                          {note}
                                        </span>
                                      )
                                    )}
                                  </div>
                                )}
                                {item.fragranceNotes.base && (
                                  <div className='space-y-2'>
                                    <span className='block text-white/80 font-medium tracking-wider'>
                                      Base Notes
                                    </span>
                                    {item.fragranceNotes.base.map((note, i) => (
                                      <span
                                        key={i}
                                        className='block text-white/60'
                                      >
                                        {note}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Luxurious Collections Grid */}
                          {item.collections && (
                            <div className='grid grid-cols-2 gap-6'>
                              {item.collections.map((collection, idx) => (
                                <Link
                                  key={idx}
                                  href={collection.url}
                                  className='group block'
                                >
                                  {collection.image && (
                                    <div className='relative h-32 mb-3 overflow-hidden rounded-lg'>
                                      <Image
                                        src={collection.image}
                                        alt={collection.name}
                                        fill
                                        className='object-cover transform group-hover:scale-105 transition-transform duration-500'
                                      />
                                      <div className='absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300' />
                                    </div>
                                  )}
                                  <span className='text-sm text-white/90 group-hover:text-white transition-colors duration-300 tracking-wider'>
                                    {collection.name}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>

              {/* Enhanced Description Line */}
              {hoveredIndex !== null && items[hoveredIndex]?.description && (
                <div className='text-right'>
                  <div className='text-white/60 text-sm font-light tracking-wider max-w-md animate-fade-in'>
                    {items[hoveredIndex].description}
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};
