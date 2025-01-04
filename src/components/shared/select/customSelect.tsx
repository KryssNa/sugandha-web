import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    className?: string;

}


// Custom Components
export const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options,className }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-48 px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center justify-between
          hover:border-gray-300 focus:border-orange-500 focus:outline-none ${className}`}
            >
                <span className="text-gray-700">
                    {options.find(opt => opt.value === value)?.label || 'Select...'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg 
                  last:rounded-b-lg text-gray-700 focus:outline-none focus:bg-gray-50"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                            >
                                {option.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
