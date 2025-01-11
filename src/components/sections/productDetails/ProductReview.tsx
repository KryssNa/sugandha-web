import { Rating, Review } from '@/components/shared/types/product.types';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

interface ProductReviewsProps {
  rating: Rating;
  reviews: Review[];
}

const RatingDistribution = ({ rating, totalReviews }: { rating: Rating, totalReviews: number }) => (
  <div className="bg-gray-50 rounded-xl p-6 mb-8">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Overall Rating */}
      <div className="md:col-span-3 text-center border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0">
        <div className="text-5xl font-bold text-gray-900 mb-2">
          {rating.average.toFixed(1)}
        </div>
        <div className="flex items-center justify-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${i < Math.floor(rating.average) ? "text-yellow-400" : "text-gray-300"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="text-sm text-gray-500">Based on {totalReviews} reviews</p>
      </div>

      {/* Rating Bars */}
      <div className="md:col-span-9 pl-6 space-y-3">
        {[5, 4, 3, 2, 1].map((stars) => (
          <div key={stars} className="flex items-center gap-4">
            <div className="flex items-center gap-1 w-20">
              <span className="text-sm font-medium">{stars}</span>
              <svg
                className="w-4 h-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(rating.distribution[stars as keyof typeof rating.distribution] / totalReviews * 100) || 0}%` }}
                transition={{ duration: 0.8, delay: stars * 0.1 }}
                className="h-full bg-yellow-400"
              />
            </div>
            <span className="w-16 text-right text-sm text-gray-500">
              {rating.distribution[stars as keyof typeof rating.distribution]}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ReviewCard = ({ review }: { review: Review }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl border border-gray-200 p-6 hover:border-orange-200 
      hover:shadow-lg transition-all duration-300"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 
          to-orange-600 flex items-center justify-center text-white font-semibold">
          {review.name.split(' ').map((n: string) => n[0]).join('')}
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{review.name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            {review.verifiedPurchase && (
              <span className="text-sm text-gray-500">Verified Purchase</span>
            )}
          </div>
        </div>
      </div>
      <span className="text-sm text-gray-500">{review.datePosted}</span>
    </div>
    <p className="text-gray-600 mb-4">{review.comment}</p>
    <div className="flex items-center gap-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2"
      >
        <span>Helpful</span>
        <span className="text-gray-400">({review.helpful})</span>
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        Report
      </motion.button>
    </div>
  </motion.div>
);

const ProductReviews = ({ rating, reviews }: ProductReviewsProps) => {
  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold">Customer Reviews</h3>
          <p className="text-sm text-gray-500 mt-1">
            What others think about this product
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg 
            hover:bg-orange-600 transition-colors flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Write a Review
        </motion.button>
      </div>

      <RatingDistribution rating={rating} totalReviews={reviews.length} />

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}

          {/* Load More Button */}
          <div className="text-center pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 border-2 border-orange-500 text-orange-500 rounded-lg 
                hover:bg-orange-50 transition-colors inline-flex items-center gap-2"
            >
              Load More Reviews
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-orange-500" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h4>
          <p className="text-gray-500 mb-6">Be the first to review this product</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 
              transition-colors inline-flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Write a Review
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;