import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/components/shared/types/productTypes';
import ProductReviews from './ProductReview';

interface ProductTabsProps {
  product: Product;
}

type TabType = 'description' | 'reviews';

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('description');

  return (
    <div className="mt-12">
      {/* Tab Buttons */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('description')}
            className={`py-4 px-1 relative ${
              activeTab === 'description'
                ? 'text-orange-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Description
            {activeTab === 'description' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-4 px-1 relative ${
              activeTab === 'reviews'
                ? 'text-orange-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Reviews
            {activeTab === 'reviews' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
              />
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'description' ? (
          <motion.div
            key="description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-6 space-y-6"
          >
            {/* Description Content */}
            <div className="prose max-w-none">
              <h3 className="text-xl font-bold mb-4">Product Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Specifications */}
            {product.specifications?.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specifications.map((spec) => (
                    <div key={spec.label} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <span className="text-gray-600">{spec.label}:</span>
                      <span className="font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Key Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ingredients Section */}
            {product.ingredients?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 text-sm"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Made in:</span>
                <span className="font-medium">{product.madeIn}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{product.category}</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="reviews"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-6"
          >
            <ProductReviews rating={product.rating} reviews={product.reviews} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductTabs;