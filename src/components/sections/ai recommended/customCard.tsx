import { motion } from "framer-motion";
import { RefreshCcw, ThumbsDown, ThumbsUp } from "lucide-react";
import { Perfume } from "./types";

// Custom Card Components
export const CustomCard: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className = '' }) => {
    return (
        <div className={`bg-white shadow-md rounded-xl overflow-hidden ${className}`}>
            {children}
        </div>
    );
};

export const CustomCardContent: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className = '' }) => {
    return (
        <div className={`${className}`}>
            {children}
        </div>
    );
};

export // Recommendation Card Component
    const RecommendationCard: React.FC<{
        perfume: Perfume;
        onReset: () => void;
    }> = ({ perfume, onReset }) => {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-white rounded-lg p-4 shadow-sm"
            >
                <div className="flex items-center space-x-4">
                    <img
                        src={perfume.image}
                        alt={perfume.name}
                        className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div>
                        <h3 className="font-bold text-gray-900">{perfume.name}</h3>
                        <p className="text-sm text-gray-600">{perfume.brand}</p>
                        <p className="text-sm text-purple-500">${perfume.price}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {Object.entries(perfume.notes).map(([noteType, notes]) =>
                            notes.map((note, idx) => (
                                <span
                                    key={`${noteType}-${idx}`}
                                    className="px-2 py-1 bg-purple-100 text-purple-600 
                  rounded-full text-xs"
                                >
                                    {note}
                                </span>
                            ))
                        )}
                    </div>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex space-x-2">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-full hover:bg-gray-100"
                        >
                            <ThumbsUp className="w-5 h-5 text-gray-600" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-full hover:bg-gray-100"
                        >
                            <ThumbsDown className="w-5 h-5 text-gray-600" />
                        </motion.button>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onReset}
                        className="flex items-center space-x-1 text-sm text-purple-500 
            hover:text-purple-600"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        <span>Start Over</span>
                    </motion.button>
                </div>
            </motion.div>
        );
    };