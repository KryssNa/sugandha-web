"use client"
import { AnimatePresence, motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    Loader2,
    RefreshCw,
    Send,
    Sparkles,
    Star,
    Wind
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import ChatMessage from './chatMessage';
import { CustomCard, CustomCardContent } from './customCard';
import { Message, Perfume, QuizState } from './types';
import QuizSidebar from './sidebar';

// Premium perfume database with enhanced details
const perfumeDatabase: Perfume[] = [
    {
        id: 1,
        name: "Ethereal Dreams",
        brand: "Luxury Scents",
        notes: {
            top: ["Sicilian Bergamot", "Madagascar Vanilla", "White Jasmine"],
            heart: ["Damascus Rose", "Ylang Ylang", "Iris"],
            base: ["Mysore Sandalwood", "Ambergris", "White Musk"]
        },
        personality: ["romantic", "elegant", "sophisticated"],
        occasion: ["evening", "special", "formal"],
        price: 320,
        image: "/api/placeholder/400/400",
        description: "A masterfully crafted blend of precious ingredients, creating an unforgettable signature scent",
        performance: {
            longevity: "8-10 hours",
            sillage: "Moderate to strong",
            seasonality: ["Fall", "Winter"]
        }
    },
    // Add more premium perfumes...
];

const PerfumeQuiz: React.FC = () => {
    const [state, setState] = useState<QuizState>({
        messages: [
            {
                id: 1,
                type: 'system',
                content: "✨ Welcome to your exclusive fragrance consultation. I'm your personal perfume expert, ready to guide you to your perfect signature scent. Shall we begin your journey?",
                options: ['Yes, please!', 'Tell me more about the process'],
                isFirst: true
            }
        ],
        isTyping: false,
        userInput: '',
        recommendation: null
    });
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error' | 'info';
    }>({
        show: false,
        message: '',
        type: 'info'
    });
    const [preferences, setPreferences] = useState({
        scentFamily: '',
        occasion: '',
        personality: '',
        budget: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn] = useState(false);

    const chatEndRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const scrollToBottom = useCallback(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [state.messages, scrollToBottom]);



    // ... (previous state declarations remain the same)

    const showPremiumAlert = (title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info') => {
        return Swal.fire({
            title,
            text,
            icon,
            confirmButtonColor: '#9333ea',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            },
            customClass: {
                container: 'premium-alert',
                popup: 'rounded-xl',
                title: 'text-2xl font-bold text-gray-800',
                htmlContainer: 'text-gray-600',
                confirmButton: 'rounded-lg text-white px-6 py-3 text-lg'
            }
        });
    };
    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({
            show: true,
            message,
            type
        });

        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 3000);
    };

    const cancelPreviousRequest = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    };

    const updatePreferences = (message: string, step: number) => {
        switch (step) {
            case 2:
                setPreferences(prev => ({ ...prev, scentFamily: message }));
                break;
            case 3:
                setPreferences(prev => ({ ...prev, occasion: message }));
                break;
            case 4:
                setPreferences(prev => ({ ...prev, personality: message }));
                break;
            default:
                break;
        }
    };

    const getAIResponse = async (message: string): Promise<Message> => {
        setState(prev => ({ ...prev, isTyping: true }));
        cancelPreviousRequest();
        abortControllerRef.current = new AbortController();

        try {
            const currentStep = state.messages.length;
            updatePreferences(message, currentStep);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/perfume/recommendation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [
                        ...state.messages.map(msg => ({
                            role: msg.type === 'user' ? 'user' : 'assistant',
                            content: msg.content
                        })),
                        { role: 'user', content: message }
                    ],
                    preferences
                }),
                signal: abortControllerRef.current.signal
            });

            if (!response.ok) throw new Error('Failed to get recommendation');

            const data = await response.json();
            if (!data.success) throw new Error(data.error || 'Unknown error occurred');

            // Process AI response
            let nextMessage: Message = {
                id: state.messages.length + 2,
                type: 'system',
                content: data.response.content,
            };

            // Enhanced options based on the current step
            if (currentStep === 1) {
                nextMessage.options = [
                    'Floral & Sweet - Classic elegance',
                    'Fresh & Clean - Modern vitality',
                    'Warm & Spicy - Rich sophistication',
                    'Woody & Earthy - Natural luxury'
                ];
            } else if (currentStep === 2) {
                nextMessage.options = [
                    'Daily Luxury',
                    'Special Occasions',
                    'Professional Excellence',
                    'Evening Sophistication'
                ];
            } else if (currentStep === 3) {
                nextMessage.options = [
                    'Classic Elegance',
                    'Bold Innovation',
                    'Refined Confidence',
                    'Artistic Spirit'
                ];
            } else if (currentStep === 4) {
                const recommendedPerfume = findMatchingPerfume(data.response.content);
                if (recommendedPerfume) {
                    setState(prev => ({ ...prev, recommendation: recommendedPerfume }));
                    nextMessage.isRecommendation = true;
                    showPremiumAlert(
                        '✨ Perfect Match Found',
                        'We`ve discovered your ideal signature scent.',
                        'success'
                    );
                }
            }

            return nextMessage;

        } catch (err) {
            if ((err as Error).name === 'AbortError') {
                throw new Error('Request cancelled');
            }

            const errorMessage = (err as Error).message || 'Failed to get recommendation';
            showPremiumAlert('Error', errorMessage, 'error');

            return {
                id: state.messages.length + 2,
                type: 'system',
                content: "I apologize for the interruption in your premium consultation. Would you like to continue from where we left off?",
                options: ['Resume Consultation', 'Start Fresh'],

            };
        } finally {
            setState(prev => ({ ...prev, isTyping: false }));
        }
    };
    const findMatchingPerfume = (aiResponse: string): Perfume | null => {
        // Implement logic to match AI response with perfume database
        // This could be enhanced with more sophisticated matching
        return perfumeDatabase[Math.floor(Math.random() * perfumeDatabase.length)];
    };

    const handleUserResponse = async (response: string) => {
        const userMessage: Message = {
            id: state.messages.length + 1,
            type: 'user',
            content: response
        };

        setState(prev => ({
            ...prev,
            messages: [...prev.messages, userMessage]
        }));

        try {
            const aiResponse = await getAIResponse(response);
            setState(prev => ({
                ...prev,
                messages: [...prev.messages, aiResponse]
            }));
        } catch (err) {
            if ((err as Error).message !== 'Request cancelled') {
                setError('Failed to get response. Please try again.');
            }
        }
    };

    const handleInputSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!state.userInput.trim()) return;

        await handleUserResponse(state.userInput);
        setState(prev => ({ ...prev, userInput: '' }));
    };

    const resetQuiz = () => {
        cancelPreviousRequest();
        setState({
            messages: [state.messages[0]],
            isTyping: false,
            userInput: '',
            recommendation: null
        });
        setPreferences({
            scentFamily: '',
            occasion: '',
            personality: '',
            budget: ''
        });
        setError(null);
    };

    return (
        <div className="flex">
            <div className="flex-1">
                <div className="max-w-6xl mx-auto p-4">
                    <CustomCard className="bg-gradient-to-br from-white to-purple-50">
                        <CustomCardContent className="p-0">
                            {/* Premium Header */}
                            <motion.div
                                className="bg-gradient-to-r from-purple-300 to-pink-300 p-6 rounded-t-xl"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Sparkles className="w-8 h-8 text-white" />
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">Premium Fragrance Consultation</h2>
                                            <p className="text-purple-100">Discover your perfect signature scent</p>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05, rotate: 180 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={resetQuiz}
                                        className="p-2 text-white rounded-full hover:bg-white/10 transition-colors"
                                    >
                                        <RefreshCw className="w-6 h-6" />
                                    </motion.button>
                                </div>
                            </motion.div>

                            {/* Enhanced Chat Area */}
                            <div className="h-[600px] overflow-y-auto p-6 space-y-6 bg-white/80 backdrop-blur-sm">
                                <AnimatePresence mode="wait">
                                    {state.messages.map((message) => (
                                        <ChatMessage
                                            key={message.id}
                                            message={message}
                                            recommendation={state.recommendation}
                                            onResponse={handleUserResponse}
                                            onReset={resetQuiz}
                                        />
                                    ))}
                                </AnimatePresence>

                                {state.isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center space-x-3 text-purple-600"
                                    >
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span className="text-sm font-medium">Crafting your perfect recommendation...</span>
                                    </motion.div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Premium Input Area */}
                            <form onSubmit={handleInputSubmit} className="p-6 border-t border-purple-100 bg-white">
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="text"
                                        value={state.userInput}
                                        onChange={(e) => setState(prev => ({ ...prev, userInput: e.target.value }))}
                                        placeholder="Share your fragrance preferences..."
                                        disabled={state.isTyping}
                                        className="flex-1 p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 
                                    focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed
                                    placeholder-purple-300 text-purple-800"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="submit"
                                        disabled={state.isTyping}
                                        className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg
                                    hover:from-purple-700 hover:to-pink-700 transition-all duration-200
                                    disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-200"
                                    >
                                        <Send className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </form>

                            {/* Premium Features Badge */}
                            {/* <div className="absolute bottom-[50%] right-4">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full
                                shadow-lg border border-purple-200"
                                >
                                    <Star className="w-4 h-4 text-purple-600" />
                                    <span className="text-sm font-medium text-purple-800">Premium Experience</span>
                                </motion.div>
                            </div> */}
                        </CustomCardContent>
                    </CustomCard>

                    {/* Enhanced Recommendation Display */}
                    <AnimatePresence>
                        {state.recommendation && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="mt-6"
                            >
                                <CustomCard className="overflow-hidden bg-white">
                                    <CustomCardContent>
                                        <div className="space-y-6">
                                            {/* Perfume Header */}
                                            <div className="flex items-start space-x-6">
                                                <motion.img
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    src={state.recommendation.image}
                                                    alt={state.recommendation.name}
                                                    className="w-32 h-32 rounded-lg object-cover shadow-lg"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="text-2xl font-bold text-gray-900">
                                                        {state.recommendation.name}
                                                    </h3>
                                                    <p className="text-lg text-purple-600">{state.recommendation.brand}</p>
                                                    <div className="mt-2">
                                                        <span className="text-xl font-semibold text-gray-900">
                                                            ${state.recommendation.price}
                                                        </span>
                                                        <span className="ml-2 text-sm text-gray-500">Premium Collection</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Fragrance Notes */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="p-4 bg-purple-50 rounded-lg">
                                                    <h4 className="font-medium text-purple-800 mb-2">Top Notes</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {state.recommendation.notes.top.map((note, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-3 py-1 bg-white text-purple-600 text-sm rounded-full
                                                            shadow-sm border border-purple-100"
                                                            >
                                                                {note}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="p-4 bg-pink-50 rounded-lg">
                                                    <h4 className="font-medium text-pink-800 mb-2">Heart Notes</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {state.recommendation.notes.heart.map((note, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-3 py-1 bg-white text-pink-600 text-sm rounded-full
                                                            shadow-sm border border-pink-100"
                                                            >
                                                                {note}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="p-4 bg-indigo-50 rounded-lg">
                                                    <h4 className="font-medium text-indigo-800 mb-2">Base Notes</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {state.recommendation.notes.base.map((note, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-3 py-1 bg-white text-indigo-600 text-sm rounded-full
                                                            shadow-sm border border-indigo-100"
                                                            >
                                                                {note}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Performance Details */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="flex items-center space-x-3">
                                                    <Clock className="w-5 h-5 text-purple-600" />
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-700">Longevity</h4>
                                                        <p className="text-sm text-gray-600">
                                                            {state.recommendation.performance.longevity}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <Wind className="w-5 h-5 text-purple-600" />
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-700">Sillage</h4>
                                                        <p className="text-sm text-gray-600">
                                                            {state.recommendation.performance.sillage}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <Calendar className="w-5 h-5 text-purple-600" />
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-700">Best Seasons</h4>
                                                        <p className="text-sm text-gray-600">
                                                            {state.recommendation.performance.seasonality.join(', ')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <p className="text-gray-700 italic">
                                                    "{state.recommendation.description}"
                                                </p>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center justify-between pt-4">
                                                <button
                                                    onClick={resetQuiz}
                                                    className="text-purple-600 hover:text-purple-700 font-medium"
                                                >
                                                    Try Another Recommendation
                                                </button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600
                                                text-white rounded-lg shadow-lg"
                                                >
                                                    Purchase Now
                                                </motion.button>
                                            </div>
                                        </div>
                                    </CustomCardContent>
                                </CustomCard>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            <div className="py-8"></div>
            <QuizSidebar isLoggedIn={isLoggedIn} />
        </div>
    );
};

export default PerfumeQuiz;