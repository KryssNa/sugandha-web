"use client";

import { ChevronRight, Home, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface BreadcrumbItem {
  title: string;
  url: string;
  tooltip?: string;
}

interface BreadcrumbProps {
  className?: string;
  defaultBgImage?: string;
}

const formatUrlSegment = (segment: string): string => {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const generateTooltip = (title: string): string => {
  const actions: Record<string, string> = {
    products: "Discover our luxury fragrance collection",
    collections: "Explore curated sets of premium scents",
    categories: "Browse fragrances by their unique families",
    brands: "Find your favorite luxury fragrance brands",
    new: "Be the first to explore our latest arrivals",
  };

  return actions[title.toLowerCase()] || `Explore ${title} collection`;
};

export const DynamicBreadcrumb: React.FC<BreadcrumbProps> = ({
  className = "",
  defaultBgImage = "/assets/images/breadcrumb/image2.jpeg",
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const generateBreadcrumbItems = () => {
      const pathSegments = pathname
        .split("/")
        .filter((segment) => segment.length > 0);

      const items: BreadcrumbItem[] = pathSegments.map((segment) => {
        const formattedTitle = formatUrlSegment(segment);
        return {
          title: formattedTitle,
          url:
            "/" +
            pathSegments.slice(0, pathSegments.indexOf(segment) + 1).join("/"),
          tooltip: generateTooltip(formattedTitle),
        };
      });

      setBreadcrumbItems(items);
    };

    generateBreadcrumbItems();
  }, [pathname]);

  return (
    <div className='relative w-full flex items-center overflow-hidden min-h-[100px] sm:min-h-[150px] md:min-h-[180px] lg:min-h-[200px] group'>
      {/* Background */}
      <div className='absolute inset-0 w-full h-full'>
        <div
          className='absolute inset-0 bg-cover bg-center'
          style={{
            backgroundImage: `url(${defaultBgImage})`,
            opacity: 0.5,
          }}
        />
        <div className='absolute inset-0 bg-gradient-to-l from-[#887d75] via-black/40 to-black/30' />
      </div>

      {/* Navigation */}
      <div className='relative z-10 container mx-auto px-4'>
        <div className='flex max-sm:flex-col   justify-between items-center'>
          <h1 className='text-2xl md:text-3xl font-bold text-white sm:text-[#222222] uppercase tracking-wider'>
            {breadcrumbItems[breadcrumbItems.length - 1]?.title || "Home"}
          </h1>
          <nav
            aria-label='Breadcrumb'
            className={` sm:min-h-[120px] flex items-center ${className}`}
          >
            <ol className='flex flex-wrap items-center gap-3 justify-end'>
              {/* Home Link */}
              <li className='flex items-center'>
                <Link
                  href='/'
                  className='group relative p-2 hover:bg-white/5 rounded-md transition-all duration-300'
                  onMouseEnter={() => setHoveredIndex(-1)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className='relative'>
                    <Home className='w-5 h-5 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300' />
                    <Sparkles className='absolute -top-1 -right-1 w-3 h-3 text-white opacity-0 group-hover:opacity-100 transition-all duration-300' />
                  </div>
                  {hoveredIndex === -1 && (
                    <div className='absolute top-full left-1/2 -translate-x-1/2 mt-2 pointer-events-none'>
                      <div className='relative bg-[#1a1a1a] text-white px-4 py-2 rounded-lg shadow-xl border border-white/10'>
                        <div className='absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-[#1a1a1a] border-l border-t border-white/10'></div>
                        <span className=' text-sm font-light whitespace-nowrap block'>
                          Return to homepage
                        </span>
                      </div>
                    </div>
                  )}
                </Link>
              </li>

              {/* Breadcrumb Items */}
              {breadcrumbItems.map((item, index) => (
                <li
                  key={index}
                  className='flex items-center'
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <ChevronRight className='w-5 h-5 text-white/40 mx-2' />
                  <div className='relative'>
                    {index === breadcrumbItems.length - 1 ? (
                      // Last item (not clickable)
                      <div className='flex items-center space-x-2 p-2'>
                        <Sparkles className='w-4 h-4 text-white/60' />
                        <span className='text-sm font-normal tracking-widest uppercase text-primary'>
                          {item.title}
                        </span>
                      </div>
                    ) : (
                      // Clickable items
                      <button
                        onClick={() => router.push(item.url)}
                        className='flex items-center space-x-2 text-white/80 hover:text-primary p-2 hover:bg-white/5 rounded-md transition-all duration-300 group'
                      >
                        <Sparkles className='w-4 h-4 text-white/60 group-hover:text-white/100' />
                        <span className='text-sm font-normal tracking-widest uppercase'>
                          {item.title}
                        </span>
                      </button>
                    )}

                    {/* Enhanced Tooltip */}
                    {hoveredIndex === index &&
                      index !== breadcrumbItems.length - 1 && (
                        <div className='absolute top-full left-1/2 -translate-x-1/2 mt-2 pointer-events-none'>
                          <div className='relative bg-[#1a1a1a] text-white px-4 py-2 rounded-lg shadow-xl border border-white/10'>
                            <div className='absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-[#1a1a1a] border-l border-t border-white/10'></div>
                            <span className='text-sm font-light whitespace-nowrap block'>
                              {item.tooltip}
                            </span>
                          </div>
                        </div>
                      )}
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </div>
  );
};
