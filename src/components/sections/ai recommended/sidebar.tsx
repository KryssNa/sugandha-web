// QuizSidebar.tsx
import { motion } from 'framer-motion';
import { History, Lock, Star, Package } from 'lucide-react';
import React from 'react';

interface RecommendedProduct {
    id: number;
    name: string;
    brand: string;
    price: number;
    image: string;
    rating: number;
}

const DUMMY_RECOMMENDATIONS: RecommendedProduct[] = [
    {
        id: 1,
        name: "Royal Oud",
        brand: "Creed",
        price: 299,
        image: "/api/placeholder/100/100",
        rating: 4.8
    },
    {
        id: 2,
        name: "Baccarat Rouge 540",
        brand: "Maison Francis Kurkdjian",
        price: 325,
        image: "/api/placeholder/100/100",
        rating: 4.9
    },
    {
        id: 3,
        name: "Aventus",
        brand: "Creed",
        price: 359,
        image: "/api/placeholder/100/100",
        rating: 4.7
    }
];

const QuizSidebar: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => (
    <div className="w-96 bg-white border-l border-purple-100 mx-4 my-6 rounded-lg p-4 space-y-6">
        {!isLoggedIn && (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-orange-50 p-4 rounded-lg border border-orange-200"
            >
                <div className="flex items-center gap-2 text-orange-600 mb-2">
                    <Lock className="w-5 h-5" />
                    <h3 className="font-medium">Sign in Required</h3>
                </div>
                <p className="text-sm text-orange-700">
                    Sign in to save your preferences and view your consultation history.
                </p>
                <button className="mt-3 w-full py-2 bg-orange-600 text-white rounded-lg
                    hover:bg-orange-700 transition-colors text-sm font-medium">
                    Sign In
                </button>
            </motion.div>
        )}

        {/* Recent Consultations */}
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-700">
                <History className="w-5 h-5" />
                <h3 className="font-medium">Recent Consultations</h3>
            </div>
            {isLoggedIn ? (
                <div className="space-y-2">
                    {["Floral Summer Scent", "Evening Perfume", "Office Fragrance"].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0, transition: { delay: idx * 0.1 } }}
                            className="p-3 bg-purple-50 rounded-lg cursor-pointer
                                hover:bg-purple-100 transition-colors"
                        >
                            <p className="text-sm text-purple-700 font-medium">{item}</p>
                            <p className="text-xs text-purple-500">2 days ago</p>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-sm text-gray-500 italic">
                    Sign in to view your consultation history
                </div>
            )}
        </div>

        {/* Trending Recommendations */}
        <div className="space-y-3">
            <div className="flex items-center justify-between text-gray-700">
                <div className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    <h3 className="font-medium">Trending Fragrances</h3>
                </div>
            </div>
            <div className="space-y-3">
                {DUMMY_RECOMMENDATIONS.map((product, idx) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.1 } }}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg
                            hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-md object-cover"
                        />
                        <div>
                            <h4 className="text-sm font-medium text-gray-800">{product.name}</h4>
                            <p className="text-xs text-gray-500">{product.brand}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                    <span className="text-xs text-gray-600">{product.rating}</span>
                                </div>
                                <span className="text-xs font-medium text-purple-600">
                                    ${product.price}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </div>
);

export default QuizSidebar;