"use client";
import { ProductCard } from "@/components/shared/cards/productCard";
import { showToast } from "@/components/shared/toast/showAlet";
import { Product } from "@/components/shared/types/product.types";
import { RootState } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItemToCart } from "@/store/slices/cartSlice";
import { fetchProducts } from "@/store/slices/productSlice";
import { addToWishlist, removeFromWishlist } from "@/store/slices/wishlistSlice";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProductQuickView from "../../product/quickview/ProductQuickView";

interface DummyProducts {
  onSale: Product[];
  featured: Product[];
  bestRated: Product[];
}

export const PremiumProducts: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("onSale");
  const dispatch = useAppDispatch();
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
  const handleTabSelect = (tab: keyof DummyProducts) => {
    setSelectedTab(tab);
  };
  // Access Redux state for products, loading, filters, etc.
  const { products, loading, metadata } = useSelector(
    (state: RootState) => state.product
  );

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

  const router = useRouter();

  const handleBuyNow = async ({ product }: { product: Product }) => {
    // redirect to checkout page with product details
    await dispatch(addItemToCart({
      product: product,
      productId: product.id as string,
      quantity: 1
    }));
    // Save cart state to local storage or backend here if needed
    router.push('/checkout');
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

  // Fetch products when component mounts or filters change
  useEffect(() => {
    dispatch(fetchProducts({}));  // Dispatch the action to fetch products with filters
  }, [dispatch, selectedTab]);

  return (
    <div className='px-4 md:px-12 xl:px-24 py-6 space-y-6 bg-white'>
      <div className='w-full  h-11 relative flex max-sm:flex-col max-sm:pb-24 max-sm:gap-4 max-sm:px-0 justify-between items-center'>
        <h1 className='text-[#121535] text-2xl font-bold uppercase font-quicksand'>
          Premium Products
        </h1>
        <div className='flex gap-2'>
          <span
            className={`cursor-pointer ${selectedTab === "onSale"
              ? "bg-[#fa6800] text-white border-[#fa6800]"
              : "border border-[#bdbdbd] text-[#121535]"
              } rounded-full pt-[6px] pb-2 px-4`}
            onClick={() => handleTabSelect("onSale")}
          >
            On Sale
          </span>
          <span
            className={`cursor-pointer ${selectedTab === "featured"
              ? "bg-[#fa6800] text-white border-[#fa6800]"
              : "border border-[#bdbdbd] text-[#121535]"
              } rounded-full pt-[6px] pb-2 px-4`}
            onClick={() => handleTabSelect("featured")}
          >
            Featured Products
          </span>
          <span
            className={`cursor-pointer ${selectedTab === "bestRated"
              ? "bg-[#fa6800] text-white border-[#fa6800]"
              : "border border-[#bdbdbd] text-[#121535]"
              } rounded-full pt-[6px] pb-2 px-4`}
            onClick={() => handleTabSelect("bestRated")}
          >
            Best Rated
          </span>
        </div>
      </div>

      <div className='flex flex-wrap gap-4 justify-center'>
        {products.map((product, i) => (
          <ProductCard
            key={i}
            slug={product.slug}
            primaryImage={product.coverImage}
            secondaryImage={product.thumbnail}
            title={product.title}
            price={product.basePrice}
            originalPrice={product.originalPrice}
            discount={product.discount}
            rating={product.rating ? product.rating.average : 0}
            reviews={product.reviews?.length ?? 0}
            isHot={product.isHot}
            endDate={product.discountEndDate}
            onAddToWishlist={() => handleToggleWishlist({ product })}
            onQuickView={() => handleQuickView(product)}
            onAddToCart={() => handleAddToCart({ product })}
            buyNow={() => handleBuyNow({ product })}
            checkWishlist={checkWishlist(product)}
            className='w-[360px]'
          />
        ))}
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


    </div>
  );
};
