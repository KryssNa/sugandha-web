'use client';

import { Product } from '@/components/shared/types/product.types';
import {
  Clock,
  DollarSign,
  Package,
  Tag,
  Users
} from 'lucide-react';
import React from 'react';

// Details Content Component
export const ProductDetailsContent: React.FC<{ product: Product }> = ({
  product
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Column - Images */}
      <div>
        <div className="grid grid-cols-2 gap-4">
          {product.images && product.images.map((image, index) => (
            <div
              key={index}
              className="rounded-lg overflow-hidden border border-gray-200"
            >
              <img
                src={image.url}
                alt={`Product Image ${index + 1}`}
                className="w-full h-48 object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right Column - Product Details */}
      <div className="space-y-6">
        {/* Basic Info */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Product Information</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-orange-500" />
              <span><strong>Brand:</strong> {product.brand}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" />
              <span><strong>Gender:</strong> {product.gender}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-orange-500" />
              <span>
                <strong>Price:</strong> ₹{product.basePrice.toFixed(2)}
                {product.originalPrice && (
                  <span className="ml-2 line-through text-gray-500">
                    ₹{product.originalPrice.toFixed(2)}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-600">{product.description}</p>
        </div>

        {/* Variants */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Available Variants</h3>
          <div className="space-y-2">
            {product.variants && product.variants.map((variant) => (
              <div
                key={variant.sku}
                className="bg-gray-50 p-3 rounded-lg flex justify-between items-center"
              >
                <div>
                  <span className="font-medium">{variant.size} ml</span>
                  <span className="ml-2 text-gray-600">SKU: {variant.sku}</span>
                </div>
                <div>
                  <span className="font-bold">₹{variant.price.toFixed(2)}</span>
                  <span className="ml-2 text-gray-600">
                    Qty: {variant.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Details */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Additional Details</h3>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <span><strong>Concentration:</strong> {product.concentration}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal Shower Function
export const showProductDetailsModal = (product: Product, modal: any) => {
  modal.showModal({
    title: (
      <div className="flex items-center gap-2">
        <Package className="w-6 h-6 text-orange-500" />
        {product.title}
      </div>
    ),
    content: <ProductDetailsContent product={product} />,
    size: 'xl',
  });
};

export default ProductDetailsContent;