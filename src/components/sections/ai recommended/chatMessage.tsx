import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Heart, Moon, Sparkles, Sun } from 'lucide-react';
import React, { JSX, useMemo } from 'react';
import { Message, Perfume } from './types';
import WelcomeMessage from './welcomeMessage';

interface ChatMessageProps {
    message: Message;
    recommendation: Perfume | null;
    onResponse: (response: string) => Promise<void>;
    onReset: () => void;
}


interface Option {
    text: string;
    icon: JSX.Element;
    description?: string;
    color?: string;
}

const getIconForOption = (text: string): JSX.Element => {
    const lowerText = text.toLowerCase();
    switch (true) {
        case lowerText.includes('evening'): return <Moon className="w-4 h-4" />;
        case lowerText.includes('day'): return <Sun className="w-4 h-4" />;
        case lowerText.includes('romantic'): return <Heart className="w-4 h-4" />;
        case lowerText.includes('business'): return <Briefcase className="w-4 h-4" />;
        default: return <Sparkles className="w-4 h-4" />;
    }
};

const parsePerfumeRecommendation = (content: string) => {

    if (content.includes('🌟') && content.includes('📝') && content.includes('💫')) {
        const parts = content?.split('\n').filter(Boolean);

        const title = parts.find(p => p.startsWith('🌟'))
            ?.replace('🌟', '')
            ?.trim()
            ?.replace(/\*\*/g, '');

        // Get everything between Key Notes: and Perfect For You Because:
        const notesSection = content?.split('📝 Key Notes:')[1].split('💫 Perfect For You Because:')[0].trim();

        // Get everything between Perfect For You Because: and NEXT_CHOICES:
        const reasonSection = content?.split('💫 Perfect For You Because:')[1]?.split('NEXT_CHOICES:')[0].trim();

        const choices = content
            ?.split('NEXT_CHOICES:')[1]
            ?.split('•')
            ?.filter(Boolean)
            .map(p => p.trim());
        const recommendations = [
            `${title}: Apka Perfect Soulmate`,
            `${title}: Your Untold Story`,
            `${title}: Elevate Your Aura`,
            `${title}: Create Magic Everyday`,
            `${title}: Capture Hearts Forever`,
            `${title}: Become Unforgettable`,
            `${title}: Your Power Move`,
            `${title}: Make Every Moment Yours`,
            `${title}: Own Your Moment`,
            `${title}: Stand Out & Shine`,
            `${title}: Be Extraordinarily You`
        ];



        return {
            isRecommendation: true,
            recommendation: {
                title: recommendations[Math.floor(Math.random() * recommendations.length)],
                notes: notesSection,
                reason: reasonSection
            },
            options: choices.map(text => ({
                text,
                icon: getIconForOption(text)
            }))
        };
    }

    const [mainContent, choicesSection] = content?.split('NEXT_CHOICES:');

    // Process main content to handle numbered items and emojis
    const formattedContent = mainContent
        ?.split('\n\n')  // Split by double newlines for major sections
        .map(section => section.trim())
        .filter(Boolean)  // Remove empty sections
        .join('\n\n');   // Rejoin with double newlines

    const options = choicesSection
        ? choicesSection
            .trim()
            ?.split('•')
            .map(opt => opt.trim())
            .filter(Boolean)
            .map(text => ({
                text,
                icon: getIconForOption(text)
            }))
        : [];

    return {
        isRecommendation: false,
        mainContent: formattedContent,
        options
    };
};

const OptionButton: React.FC<{
    option: Option;
    onClick: () => void;
    index: number;
    isWelcome?: boolean;
}> = ({ option, onClick, index, isWelcome }) => {
    const baseAnimation = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0, transition: { delay: 0.1 * index } },
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 }
    };

    if (isWelcome) {
        return (
            <motion.button
                {...baseAnimation}
                onClick={onClick}
                className={`w-full px-6 py-4 rounded-xl text-white
                    ${option.color} shadow-lg hover:shadow-xl
                    transition-all duration-300 group`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {option.icon}
                        <div className="text-left">
                            <p className="font-medium">{option.text}</p>
                            {option.description && (
                                <p className="text-sm text-white/80">{option.description}</p>
                            )}
                        </div>
                    </div>
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </div>
            </motion.button>
        );
    }

    return (
        <motion.button
            {...baseAnimation}
            onClick={onClick}
            className="flex items-center gap-3 px-4 py-3 rounded-xl
                bg-purple-50 text-primary/80 hover:text-primary
                transition-all duration-200 text-sm font-medium
                border border-purple-100 hover:border-purple-200 hover:shadow-md"
        >
            <span className="text-primary-50">{option.icon}</span>
            <span>{option.text}</span>
        </motion.button>
    );
};

const UserMessage: React.FC<{ content: string }> = ({ content }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-end mb-4"
    >
        <div className="bg-slate-400 text-white rounded-2xl px-4 py-2 max-w-[80%] shadow-md">
            <p className="text-sm">{content}</p>
        </div>
    </motion.div>
);

const SystemMessage: React.FC<ChatMessageProps> = ({ message, onResponse }) => {
    const { isRecommendation, recommendation, mainContent, options } = useMemo(() =>
        parsePerfumeRecommendation(message.content), [message.content]);

    if (isRecommendation) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 max-w-[90%]"
            >
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
                    <motion.div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold text-primary">
                                {recommendation?.title}
                            </h3>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg">
                            <h4 className="font-medium text-purple-700 mb-2">Key Notes</h4>
                            <p className="text-sm text-gray-700">{recommendation?.notes}</p>
                        </div>

                        <div className="bg-pink-50 p-4 rounded-lg">
                            <h4 className="font-medium text-pink-700 mb-2">Perfect For You</h4>
                            <p className="text-sm text-gray-700 italic">{recommendation?.reason}</p>
                        </div>

                        {options.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4"
                            >
                                {options.map((option, idx) => (
                                    <OptionButton
                                        key={idx}
                                        option={option}
                                        onClick={() => onResponse(option.text)}
                                        index={idx}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 max-w-[90%]"
        >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-700 leading-relaxed mb-4"
                >
                    {mainContent}
                </motion.p>

                {options.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                        {options.map((option, idx) => (
                            <OptionButton
                                key={idx}
                                option={option}
                                onClick={() => onResponse(option.text)}
                                index={idx}
                            />
                        ))}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

const ChatMessage: React.FC<ChatMessageProps> = (props) => {
    if (props.message.isFirst) return <WelcomeMessage {...props} />;
    if (props.message.type === 'user') return <UserMessage content={props.message.content} />;
    return <SystemMessage {...props} />;
};

export default ChatMessage;