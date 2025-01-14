import ProductQuickView from "@/components/sections/product/quickview/ProductQuickView";
import { RootState } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItemToCart } from "@/store/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/store/slices/wishlistSlice";
import { useEffect, useRef, useState } from "react";
import { NavigationButton } from "../buttons/navigationButtons";
import ProductCard from "../cards/productCard";
import { showToast } from "../toast/showAlet";
import { Product } from "../types/product.types";

interface ProductSliderProps {
  products: Product[];
  position: "left" | "right";
}

export const ProductSlider: React.FC<ProductSliderProps> = ({
  products,
  position,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const CARD_WIDTH = 360; // Width of each card
  const GAP = 16; // Gap between cards
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setSelectedProduct(null);
  };

  const dispatch = useAppDispatch();

  const wishlistItems = useAppSelector((state: RootState) => state.wishlist.items);

  const handleAddToCart = ({ product }: { product: Product }) => {
    showToast("success", "Item added to cart");
    dispatch(addItemToCart({
      product: product,
      productId: product.id as string,
      quantity: 1
    }));
  };

  const checkWishlist = (product: Product) => {
    return wishlistItems.some(item => item.id === product.id);
  }

  const handleToggleWishlist = ({ product }: { product: Product }) => {
    const isInWishlist = wishlistItems.some(item => item.id === product.id);
    if (isInWishlist) {
      if (product.id) {
        showToast("success", "Item removed from wishlist");
        dispatch(removeFromWishlist(product.id));
      }
    } else {
      showToast("success", "Item added to wishlist");
      dispatch(addToWishlist(product));
    }
  };

  // Calculate container dimensions and visible items
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setContainerWidth(width);
        const itemsVisible = Math.floor((width + GAP) / (CARD_WIDTH + GAP));
        setItemsPerView(Math.max(1, itemsVisible));
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    const startAutoPlay = () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);

      autoPlayRef.current = setInterval(() => {
        const maxIndex = Math.max(0, products.length - itemsPerView);
        if (currentIndex < maxIndex) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setCurrentIndex(0);
        }
      }, 3000);
    };

    startAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [currentIndex, products.length, itemsPerView]);

  const handleNext = () => {
    const maxIndex = Math.max(0, products.length - itemsPerView);
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  // Calculate slider transform
  const translateX = -(currentIndex * (CARD_WIDTH + GAP));

  return (
    <div className="">
      <div
        ref={containerRef}
        className='relative group w-full'
        onMouseEnter={() => {
          if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        }}
        onMouseLeave={() => {
          const maxIndex = Math.max(0, products.length - itemsPerView);
          if (currentIndex < maxIndex) {
            if (autoPlayRef.current) clearInterval(autoPlayRef.current);
            autoPlayRef.current = setInterval(() => {
              setCurrentIndex((prev) => prev + 1);
            }, 3000);
          }
        }}
      >
        <div className='overflow-hidden md:px-4 py-2'>
          <div
            ref={sliderRef}
            className='flex transition-transform duration-500 ease-in-out'
            style={{ transform: `translateX(${translateX}px)` }}
          >
            {products.map((product, index) => (
              <div
                key={index}
                className='flex-shrink-0'
                style={{ width: `${CARD_WIDTH}px`, marginRight: `${GAP}px` }}
              >
                <ProductCard
                  key={index}
                  slug={product.slug}
                  primaryImage={product.thumbnail}
                  secondaryImage={product.coverImage}
                  title={product.title}
                  price={product.basePrice}
                  originalPrice={product.originalPrice}
                  discount={product.discount}
                  rating={product.rating ? product.rating.average : 0}
                  reviews={product.reviews ? product.reviews.length : 0}
                  isHot={product.isHot}
                  endDate={product.discountEndDate}
                  onAddToWishlist={() => handleToggleWishlist({ product })}
                  onQuickView={() => handleQuickView(product)}
                  onAddToCart={() => handleAddToCart({ product })}
                  checkWishlist={checkWishlist(product)}
                  className='w-[360px]'
                />
              </div>
            ))}

          </div>

        </div>

        {currentIndex > 0 && (
          <NavigationButton
            direction='left'
            onClick={handlePrev}
            disabled={currentIndex === 0}
          />
        )}

        {currentIndex < products.length - itemsPerView && (
          <NavigationButton
            direction='right'
            onClick={handleNext}
            disabled={currentIndex === products.length - itemsPerView}
          />
        )}
      </div>
      {selectedProduct && (
        <ProductQuickView
          product={selectedProduct}
          isOpen={isQuickViewOpen}
          onClose={handleCloseQuickView}
          onAddToCart={(product, quantity, size) => {
            dispatch(addItemToCart({
              product,
              quantity,

            }));
            handleCloseQuickView();
          }}
        />
      )}
    </div>
  );
};
