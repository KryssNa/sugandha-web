"use client"
import { AnimatePresence, motion } from 'framer-motion';
import {
    BookOpen,
    ChevronRight,
    CreditCard,
    HelpCircle,
    RefreshCw,
    ShieldCheck,
    Truck
} from 'lucide-react';
import React, { useState } from 'react';

interface PolicySection {
    title: string;
    content: string;
    icon: React.ElementType;
    subsections?: {
        title: string;
        details: string[];
    }[];
}

const PoliciesAndRulesPage: React.FC = () => {
    const [expandedSection, setExpandedSection] = useState<number | null>(null);

    const policySections: PolicySection[] = [
        {
            title: 'Shipping Policy',
            icon: Truck,
            content: `At Sugandha, we strive to provide a seamless shipping experience for our customers. Our goal is to ensure your fragrance reaches you safely and promptly.`,
            subsections: [
                {
                    title: 'Shipping Methods',
                    details: [
                        'Standard Shipping: 4-7 business days',
                        'Express Shipping: 2-3 business days',
                        'International Shipping: 7-14 business days'
                    ]
                },
                {
                    title: 'Shipping Rates',
                    details: [
                        'Free shipping on orders above ₹2,500',
                        'Flat rate of ₹100 for orders below ₹2,500',
                        'International shipping rates vary by location'
                    ]
                },
                {
                    title: 'Shipping Restrictions',
                    details: [
                        'Fragrances can only be shipped within Nepal',
                        'Requires adult signature upon delivery',
                        'Cannot be shipped to P.O. Boxes'
                    ]
                }
            ]
        },
        {
            title: 'Return & Exchange Policy',
            icon: RefreshCw,
            content: `We want you to be completely satisfied with your Sugandha purchase. Our comprehensive return and exchange policy ensures a hassle-free experience.`,
            subsections: [
                {
                    title: 'Return Window',
                    details: [
                        '15-day return period from date of delivery',
                        'Product must be unused and in original packaging',
                        'Sealed/opened perfume bottles are non-returnable'
                    ]
                },
                {
                    title: 'Exchange Conditions',
                    details: [
                        'Full refund for manufacturing defects',
                        'Exchanges allowed for size or variant',
                        'Shipping costs for returns are customer\'s responsibility'
                    ]
                },
                {
                    title: 'Refund Process',
                    details: [
                        'Refunds processed within 5-7 business days',
                        'Original payment method will be credited',
                        'Partial refunds not applicable'
                    ]
                }
            ]
        },
        {
            title: 'Payment & Security',
            icon: CreditCard,
            content: `We ensure secure and flexible payment options to provide you with a safe and convenient shopping experience.`,
            subsections: [
                {
                    title: 'Accepted Payment Methods',
                    details: [
                        'Credit Cards (Visa, MasterCard, American Express)',
                        'Debit Cards',
                        'Esewa, Khalti',
                    ]
                },
                {
                    title: 'Payment Security',
                    details: [
                        '256-bit SSL encryption',
                        'PCI DSS Compliant',
                        'No storage of complete card details',
                        'Secure payment gateway transactions'
                    ]
                },
                {
                    title: 'Transaction Protection',
                    details: [
                        'Real-time transaction monitoring',
                        'Fraud detection systems',
                        'Two-factor authentication'
                    ]
                }
            ]
        },
        {
            title: 'Customer Support & Warranty',
            icon: HelpCircle,
            content: `Our commitment to excellence extends beyond your purchase. We provide comprehensive support to ensure your complete satisfaction.`,
            subsections: [
                {
                    title: 'Support Channels',
                    details: [
                        'Email: support@sugandha.com',
                        'Phone: +977 98XXXXXXXX',
                        'Live Chat: Available 10 AM - 7 PM',
                        'Response within 24 hours'
                    ]
                },
                {
                    title: 'Product Warranty',
                    details: [
                        '30-day quality guarantee',
                        'Manufacturing defects fully covered',
                        'Replacement or full refund',
                        'Proof of purchase required'
                    ]
                },
                {
                    title: 'Consultation Services',
                    details: [
                        'Free fragrance consultation',
                        'Personalized scent recommendations',
                        'Expert advice on perfume selection'
                    ]
                }
            ]
        }
    ];

    const toggleSection = (index: number) => {
        setExpandedSection(expandedSection === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center">
                                <BookOpen className="w-8 h-8 mr-4" />
                                Sugandha Policies & Rules
                            </h1>
                            <p className="text-white/80 mt-2">
                                Transparent guidelines for a seamless shopping experience
                            </p>
                        </div>
                        <ShieldCheck className="w-16 h-16 text-white/20" />
                    </div>
                </div>

                {/* Policy Sections */}
                <div className="divide-y divide-gray-200">
                    {policySections.map((section, index) => (
                        <div key={index} className="hover:bg-gray-50 transition-colors">
                            <button
                                onClick={() => toggleSection(index)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-orange-50 rounded-full">
                                        <section.icon className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {section.title}
                                    </h2>
                                </div>
                                <ChevronRight
                                    className={`w-6 h-6 text-gray-400 transition-transform ${expandedSection === index ? 'rotate-90' : ''
                                        }`}
                                />
                            </button>

                            <AnimatePresence>
                                {expandedSection === index && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{
                                            opacity: 1,
                                            height: 'auto',
                                            transition: {
                                                duration: 0.3,
                                                ease: "easeInOut"
                                            }
                                        }}
                                        exit={{
                                            opacity: 0,
                                            height: 0,
                                            transition: {
                                                duration: 0.2,
                                                ease: "easeInOut"
                                            }
                                        }}
                                        className="px-6 pb-6"
                                    >
                                        <p className="text-gray-700 mb-4">{section.content}</p>

                                        {section.subsections?.map((subsection, subIndex) => (
                                            <div key={subIndex} className="mb-4">
                                                <h3 className="font-semibold text-gray-800 mb-2">
                                                    {subsection.title}
                                                </h3>
                                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                                    {subsection.details.map((detail, detailIndex) => (
                                                        <li key={detailIndex}>{detail}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* Footer Note */}
                <div className="bg-gray-100 p-6 text-center border-t border-gray-200">
                    <p className="text-gray-600 text-sm">
                        These policies are subject to change. Last updated: January 2024
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default PoliciesAndRulesPage;