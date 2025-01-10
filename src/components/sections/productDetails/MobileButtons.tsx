import { motion } from 'framer-motion';
import { Heart, Share2, ShoppingCart } from 'lucide-react';

interface MobileActionsProps {
  price: number;
  quantity: number;
  isInWishlist: boolean;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
}

export const MobileBottomBar = ({ 
  price, 
  quantity, 
  onAddToCart 
}: Omit<MobileActionsProps, 'isInWishlist' | 'onToggleWishlist'>) => (
  <motion.div
    initial={{ y: 100 }}
    animate={{ y: 0 }}
    className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden"
  >
    <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
      <div>
        <div className="text-sm text-gray-500">Total Price</div>
        <div className="text-lg font-bold text-gray-900">
          ${(price * quantity).toFixed(2)}
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onAddToCart}
        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 
          bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
      >
        <ShoppingCart className="w-5 h-5" />
        Add to Cart
      </motion.button>
    </div>
  </motion.div>
);

export const FloatingButtons = ({ 
  isInWishlist, 
  onToggleWishlist 
}: Pick<MobileActionsProps, 'isInWishlist' | 'onToggleWishlist'>) => (
  <div className="fixed right-4 top-1/2 transform -translate-y-1/2 space-y-4">
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="w-12 h-12 flex items-center justify-center bg-white rounded-full 
        shadow-lg hover:shadow-xl transition-shadow"
    >
      <Share2 className="w-5 h-5 text-gray-600" />
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onToggleWishlist}
      className="w-12 h-12 flex items-center justify-center bg-white rounded-full 
        shadow-lg hover:shadow-xl transition-shadow"
    >
      <Heart
        className={`w-5 h-5 ${isInWishlist ? "text-red-500" : "text-gray-600"}`}
        fill={isInWishlist ? "currentColor" : "none"}
      />
    </motion.button>
  </div>
);