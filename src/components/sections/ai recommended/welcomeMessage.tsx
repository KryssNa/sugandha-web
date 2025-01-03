// WelcomeMessage.tsx
import { motion } from 'framer-motion';
import {
    Info,
    Sparkles,
    Star
} from 'lucide-react';
import React from 'react';

interface WelcomeProps {
    message: {
        content: string;
    };
    onResponse: (response: string) => void;
}

const WELCOME_OPTIONS = [
    {
        text: 'Yes, please!',
        icon: <Star className="w-5 h-5" />,
        description: 'Start your personal fragrance journey',
        gradient: 'from-purple-500 to-indigo-500'
    },
    {
        text: 'Tell me more',
        icon: <Info className="w-5 h-5" />,
        description: 'Learn how we find your perfect scent',
        gradient: 'from-teal-500 to-cyan-500'
    }
];

const WelcomeMessage: React.FC<WelcomeProps> = ({ message, onResponse }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            {/* Main Welcome Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
                {/* Welcome Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-xl">
                        <Sparkles className="w-6 h-6 text-purple-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">
                        Welcome
                    </h2>
                </div>

                {/* Message Content */}
                <p className="text-gray-600 leading-relaxed mb-6">
                    {message.content}
                </p>

                {/* Welcome Options */}
                <div className="flex flex-row gap-4">
                    {WELCOME_OPTIONS.map((option, idx) => (
                        <motion.button
                            key={idx}
                            onClick={() => onResponse(option.text)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2 rounded-xl text-white 
                               bg-slate-400 shadow-lg 
                                hover:shadow-xl transition-all duration-300 group`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="text-left">
                                        <p className="font-semibold text-base">
                                            {option.text}
                                        </p>
                                        <p className="text-sm text-white/80">
                                            {option.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Premium Badge */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-4 flex items-center justify-center gap-2"
            >
                <div className="px-4 py-2 bg-purple-100 rounded-full">
                    <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">
                            Premium Consultation
                        </span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default WelcomeMessage;