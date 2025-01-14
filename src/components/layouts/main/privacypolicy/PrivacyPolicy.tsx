"use client"
import { AnimatePresence, motion } from 'framer-motion';
import {
    ChevronRight,
    FileText,
    Globe,
    Lock,
    Mail,
    ShieldCheck,
    User
} from 'lucide-react';
import React, { useState } from 'react';

interface PolicySection {
    title: string;
    content: string;
    icon: React.ElementType;
}

const PrivacyPolicyPage: React.FC = () => {
    const [expandedSection, setExpandedSection] = useState<number | null>(null);

    const policySections: PolicySection[] = [
        {
            title: 'Information We Collect',
            content: `We collect personal information that you voluntarily provide to us when you register, place an order, subscribe to our newsletter, or interact with our website. This may include:
- Name and contact details
- Shipping and billing addresses
- Payment information
- Purchase history
- Communication preferences
- Device and browsing information`,
            icon: User
        },
        {
            title: 'How We Use Your Information',
            content: `We use your personal information to:
- Process and fulfill your orders
- Provide customer support
- Personalize your shopping experience
- Send promotional offers (with your consent)
- Improve our products and services
- Detect and prevent fraud
- Comply with legal obligations`,
            icon: FileText
        },
        {
            title: 'Data Protection and Security',
            content: `We implement robust security measures to protect your personal information:
- Encrypted connections (HTTPS)
- Secure payment gateways
- Regular security audits
- Access controls and authentication
- Data minimization practices
- Compliance with data protection regulations`,
            icon: Lock
        },
        {
            title: 'Your Rights',
            content: `You have the right to:
- Access your personal information
- Request data correction
- Delete your account and personal data
- Opt-out of marketing communications
- Withdraw consent for data processing
- Lodge a complaint with data protection authorities`,
            icon: ShieldCheck
        },
        {
            title: 'Cookies and Tracking',
            content: `We use cookies and similar technologies to:
- Enhance user experience
- Remember login details
- Analyze site traffic
- Provide personalized recommendations
You can manage cookie preferences through your browser settings.`,
            icon: Globe
        }
    ];

    const toggleSection = (index: number) => {
        setExpandedSection(expandedSection === index ? null : index);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gray-50 p-6 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <ShieldCheck className="w-8 h-8 mr-3 text-orange-500" />
                            Privacy Policy
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Last Updated: January 2024
                        </p>
                    </div>
                    <Mail className="w-12 h-12 text-gray-200" />
                </div>

                {/* Intro Section */}
                <div className="p-6 bg-orange-50 border-b border-orange-100">
                    <p className="text-orange-800">
                        At Sugandha, we are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information.
                    </p>
                </div>

                {/* Expandable Sections */}
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
                                        className="px-6 pb-6 text-gray-700"
                                    >
                                        <p className="whitespace-pre-line">{section.content}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* Contact Section */}
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Contact Us
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">Email</h4>
                            <p className="text-gray-600">privacy@sugandha.com</p>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">Phone</h4>
                            <p className="text-gray-600">+977 98XXXXXXXX</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PrivacyPolicyPage;