"use client"

import { useAppDispatch, useAppSelector } from '@/store/hooks'; // Add custom hooks
import { addItemToCart } from '@/store/slices/cartSlice';
import { fetchProductBySlug } from '@/store/slices/productSlice';
import { addToWishlist, removeFromWishlist } from '@/store/slices/wishlistSlice';
import { useEffect, useState } from 'react';

// Components
import { showToast } from '@/components/shared/toast/showAlet';
import { RootState } from '@/store';
import ImageGallery from './ImageGallery';
import { FloatingButtons, MobileBottomBar } from './MobileButtons';
import ProductInfo from './ProductInfo';
import ProductTabs from './ProductTab';

interface ProductDetailsSectionProps {
  slug: string;
}

const ProductDetailsSection = ({ slug }: ProductDetailsSectionProps) => {
  const dispatch = useAppDispatch();

  // Redux selectors
  const wishlistItems = useAppSelector((state: RootState) => state.wishlist.items);
  const { selectedProduct, loading, error } = useAppSelector(
    (state: RootState) => state.product
  );

  // Local state
  const [quantity, setQuantity] = useState(1);

  // Fetch product data
  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug))
        .unwrap()
        .catch((error) => {
          console.error('Failed to fetch product:', error);
        });
    }
  }, [dispatch, slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!selectedProduct) {
    return <div>Product not found</div>;
  }

  const product = selectedProduct;
  const isInWishlist = wishlistItems.some(item => item.id === product.id);

  // Handlers
  const handleQuantityChange = (type: "increase" | "decrease") => {
    setQuantity(prev => {
      if (type === "decrease") return prev > 1 ? prev - 1 : 1;
      return prev < (product.quantity || 0) ? prev + 1 : prev;
    });
  };

  const handleAddToCart = () => {
    showToast("success", "Item added to cart");
    dispatch(addItemToCart({
      product: product,
      productId: product.id as string,
      quantity
    }));
  };

  const handleToggleWishlist = () => {

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Product Overview Section */}
      <div className="flex flex-col lg:flex-row gap-8">
        <ImageGallery
          images={product.images}
          title={product.title}
        />
        <ProductInfo
          product={product}
          quantity={quantity}
          isInWishlist={isInWishlist}
          onQuantityChange={handleQuantityChange}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
        />
      </div>
      {/* Tabs Section */}
      <ProductTabs product={product} />
      {/* Mobile Actions */}
      <MobileBottomBar
        price={product.basePrice}
        quantity={quantity}
        onAddToCart={handleAddToCart}
      />
      {/* Floating Buttons */}
      <FloatingButtons
        isInWishlist={isInWishlist}
        onToggleWishlist={handleToggleWishlist}
        productUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/products/${slug}`}
        productTitle={selectedProduct.title}
      />
    </div>
  );
};

export default ProductDetailsSection;
