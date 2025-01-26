"use client"
import useToast from '@/hooks/useToast';
import { ContactFormData, ContactService, ContactType } from '@/services/contact.service';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    ArrowRight,
    Building2,
    Clock,
    FileQuestion,
    Globe,
    Headphones,
    HelpCircle,
    Mail,
    MapPin,
    MessageSquare,
    PaperclipIcon,
    Phone,
    PhoneCall,
    Send,
    Upload
} from 'lucide-react';
import React, { useState } from 'react';

interface TabContent {
    title: string;
    description: string;
    fields: {
        name: string;
        type: string;
        label: string;
        placeholder?: string;
        required?: boolean;
        options?: string[];
    }[];
    extraInfo?: string;
}

const tabContents: Record<string, TabContent> = {
    'general': {
        title: 'General Inquiry',
        description: 'Have a question or comment? We\'d love to hear from you.',
        fields: [
            { name: 'fullName', type: 'text', label: 'Full Name', placeholder: 'Your full name', required: true },
            { name: 'email', type: 'email', label: 'Email', placeholder: 'your@email.com', required: true },
            { name: 'subject', type: 'text', label: 'Subject', placeholder: 'What\'s this about?', required: true },
            { name: 'message', type: 'textarea', label: 'Message', placeholder: 'Tell us more about your inquiry...', required: true }
        ]
    },
    'quotation': {
        title: 'Get Quotation',
        description: 'Request a detailed price quote for our products or services.',
        fields: [
            { name: 'companyName', type: 'text', label: 'Company Name', placeholder: 'Your company name', required: true },
            { name: 'fullName', type: 'text', label: 'Contact Person', placeholder: 'Your full name', required: true },
            { name: 'email', type: 'email', label: 'Business Email', placeholder: 'your@company.com', required: true },
            { name: 'phone', type: 'tel', label: 'Phone', placeholder: '+977 98XXXXXXXX', required: true },
            { name: 'productDetails', type: 'textarea', label: 'Product Details', placeholder: 'Describe what you\'re looking for...', required: true },
            { name: 'quantity', type: 'number', label: 'Quantity', placeholder: 'Expected quantity', required: true },
        ],
        extraInfo: 'Please provide as much detail as possible for accurate quotation'
    },
    'support': {
        title: 'Technical Support',
        description: 'Need help with a technical issue? Our support team is here to assist.',
        fields: [
            { name: 'fullName', type: 'text', label: 'Full Name', placeholder: 'Your full name', required: true },
            { name: 'email', type: 'email', label: 'Email', placeholder: 'your@email.com', required: true },
            { name: 'orderNumber', type: 'text', label: 'Order Number', placeholder: 'If applicable' },
            {
                name: 'issueType', type: 'select', label: 'Issue Type', required: true, options: [
                    'Product Usage',
                    'Technical Issue',
                    'Account Problem',
                    'Other'
                ]
            },
            { name: 'description', type: 'textarea', label: 'Issue Description', placeholder: 'Please describe the issue in detail...', required: true }
        ]
    },
    'partnership': {
        title: 'Business Partnership',
        description: 'Interested in partnering with us? Let\'s explore the possibilities together.',
        fields: [
            { name: 'companyName', type: 'text', label: 'Company Name', placeholder: 'Your company name', required: true },
            { name: 'fullName', type: 'text', label: 'Contact Person', placeholder: 'Your full name', required: true },
            { name: 'position', type: 'text', label: 'Position', placeholder: 'Your role', required: true },
            { name: 'email', type: 'email', label: 'Business Email', placeholder: 'your@company.com', required: true },
            { name: 'phone', type: 'tel', label: 'Phone', placeholder: '+977 98XXXXXXXX', required: true },
            {
                name: 'partnershipType', type: 'select', label: 'Partnership Type', required: true, options: [
                    'Distribution',
                    'Reseller',
                    'Technology Integration',
                    'Other'
                ]
            },
            { name: 'proposal', type: 'textarea', label: 'Partnership Proposal', placeholder: 'Tell us about your partnership proposal...', required: true }
        ],
        extraInfo: 'Our team will review your proposal and get back to you within 2-3 business days'
    }
};


const CustomFormField = ({ field, value, onChange }: { field: any; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void }) => {
    switch (field.type) {
        case 'textarea':
            return (
                <textarea
                    name={field.name}
                    value={value}
                    onChange={onChange}
                    required={field.required}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 
            focus:ring-2 focus:ring-orange-200 transition-all duration-200 resize-none"
                    placeholder={field.placeholder}
                />
            );
        case 'select':
            return (
                <select
                    name={field.name}
                    value={value}
                    onChange={onChange}
                    required={field.required}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 
            focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                    title='Select Request Type'
                >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((option: string) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            );
        default:
            return (
                <input
                    type={field.type}
                    name={field.name}
                    value={value}
                    onChange={onChange}
                    required={field.required}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 
            focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                    placeholder={field.placeholder}
                />
            );
    }
};

const ContactSection = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [attachments, setAttachments] = useState<File[]>([]);
    const toast = useToast();
    const [selectedTab, setSelectedTab] = useState<ContactType>(ContactType.GENERAL);
    const [formData, setFormData] = useState<ContactFormData>({
        type: ContactType.GENERAL,
        fullName: '',
        email: '',
        message: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleTabChange = (tabValue: ContactType) => {
        setSelectedTab(tabValue);

        // Reset form data with new type while preserving common fields
        setFormData({
            type: tabValue,
            fullName: formData.fullName || '',
            email: formData.email || '',
            message: '',
            // Reset all other fields
            phone: '',
            companyName: '',
            position: '',
            subject: '',
            productDetails: '',
            quantity: undefined,
            orderNumber: '',
            issueType: '',
            partnershipType: '',
        });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachments(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await ContactService.submitContact({
                ...formData,
                attachments
            });

            toast("success",
                "Your message has been sent successfully. We'll get back to you soon.",
            );

            // Reset form
            setFormData({
                type: selectedTab,
                fullName: '',
                email: '',
                message: ''
            });
            setAttachments([]);

        } catch (error: any) {
            error.response.data.errors.forEach((err: any) => {
                toast("error", err.message);
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: <Phone className='w-5 h-5' />,
            title: "Phone",
            details: ["+977 9811787904", "+977 1234567"],
            color: "bg-blue-500",
        },
        {
            icon: <Mail className='w-5 h-5' />,
            title: "Email",
            details: ["support24@sugandha.com", "info@sugandha.com"],
            color: "bg-green",
        },
        {
            icon: <MapPin className='w-5 h-5' />,
            title: "Office Location",
            details: ["Kathmandu, Nepal", "Near Example Landmark"],
            color: "bg-orange-500",
        },
        {
            icon: <Clock className='w-5 h-5' />,
            title: "Business Hours",
            details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 2:00 PM"],
            color: "bg-purple-500",
        },
    ];

    const requestTypes = [
        { value: "general", label: "General Inquiry", icon: <MessageSquare /> },
        { value: "quotation", label: "Get Quotation", icon: <FileQuestion /> },
        { value: "support", label: "Technical Support", icon: <Headphones /> },
        {
            value: "partnership",
            label: "Business Partnership",
            icon: <Building2 />,
        },
    ];

    return (
        <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
            {/* Header Section */}
            <div className='max-w-7xl mx-auto text-center mb-12'>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-4xl font-bold text-gray-900 mb-4'
                >
                    Get in Touch
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className='text-lg text-gray-600 max-w-2xl mx-auto'
                >
                    Have questions or need assistance? We're here to help. Choose how
                    you'd like to connect with us.
                </motion.p>
            </div>

            <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8'>
                {/* Contact Information */}
                <div className='lg:col-span-1 space-y-6'>
                    {/* Quick Contact Cards */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4'>
                        {contactInfo.map((info, index) => (
                            <motion.div
                                key={info.title}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className='bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg 
                  transition-all duration-300'
                            >
                                <div className='flex items-start space-x-4'>
                                    <div className={`${info.color} p-3 rounded-lg text-white`}>
                                        {info.icon}
                                    </div>
                                    <div>
                                        <h3 className='font-semibold text-gray-900'>
                                            {info.title}
                                        </h3>
                                        {info.details.map((detail, idx) => (
                                            <p key={idx} className='text-gray-600 text-sm mt-1'>
                                                {detail}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick Action Buttons */}
                    <div className='space-y-4'>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className='w-full flex items-center justify-between p-4 bg-[#121535] 
                text-white rounded-lg hover:bg-[#1a1f4d] transition-colors'
                        >
                            <span className='flex items-center'>
                                <PhoneCall className='w-5 h-5 mr-2' />
                                Get Support On Call
                            </span>
                            <div className='bg-orange-500 p-2 rounded-lg'>
                                <Send className='w-4 h-4' />
                            </div>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className='w-full flex items-center justify-between p-4 bg-[#121535]
                text-white rounded-lg hover:bg-[#1a1f4d] transition-colors'
                        >
                            <span className='flex items-center'>
                                <Globe className='w-5 h-5 mr-2' />
                                Get Direction
                            </span>
                            <div className='bg-orange-500 p-2 rounded-lg'>
                                <Send className='w-4 h-4' />
                            </div>
                        </motion.button>
                    </div>
                </div>

                {/* Enhanced Contact Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-8"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Make Custom Request</h2>
                            <p className="text-gray-600">Choose request type and fill out the form below.</p>
                        </div>

                        {/* Enhanced Request Type Selector */}
                        {/* Enhanced Request Type Selector */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {requestTypes.map((type) => (
                                <motion.label
                                    key={type.value}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer
                transition-all duration-200 relative ${selectedTab === type.value
                                            ? 'border-orange-500 bg-orange-50'
                                            : 'border-gray-200 hover:border-orange-200'
                                        }`}
                                    onClick={() => handleTabChange(type.value as ContactType)}
                                >
                                    <input
                                        type="radio"
                                        name="requestType"
                                        value={type.value}
                                        checked={selectedTab === type.value}
                                        onChange={() => handleTabChange(type.value as ContactType)}
                                        className="sr-only"
                                        placeholder='Select Request Type'
                                    />
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2
                ${selectedTab === type.value ? 'text-orange-500' : 'text-gray-400'}`}>
                                        {type.icon}
                                    </div>
                                    <span className="text-sm text-center font-medium text-gray-700">{type.label}</span>
                                </motion.label>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                {/* Tab-specific content */}
                                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                        {tabContents[selectedTab].title}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        {tabContents[selectedTab].description}
                                    </p>
                                </div>

                                {/* Dynamic Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {tabContents[selectedTab].fields.map((field) => (
                                        <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {field.label} {field.required && <span className="text-red-500">*</span>}
                                            </label>
                                            <CustomFormField
                                                field={field}
                                                value={String(formData[field.name as keyof ContactFormData] || '')}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* File Upload Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Attachments
                                        </label>
                                        <span className="text-xs text-gray-500">
                                            Max 5 files (PDF, DOC, PNG, JPG)
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col w-full h-32 border-2 border-gray-200 border-dashed rounded-lg 
                      cursor-pointer hover:bg-gray-50 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-7">
                                                <Upload className="w-8 h-8 text-gray-400" />
                                                <p className="pt-1 text-sm text-gray-600">
                                                    Drag & drop files here or click to browse
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                multiple
                                                onChange={handleFileUpload}
                                                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                            />
                                        </label>
                                    </div>
                                    {/* File List */}
                                    {attachments.length > 0 && (
                                        <div className="space-y-2">
                                            {attachments.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                                                >
                                                    <div className="flex items-center">
                                                        <PaperclipIcon className="w-4 h-4 text-gray-400 mr-2" />
                                                        <span className="text-sm text-gray-600">{file.name}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                                                        className="text-red-500 hover:text-red-600"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Extra Information */}
                                {tabContents[selectedTab].extraInfo && (
                                    <div className="flex items-center p-4 bg-blue-50 rounded-lg text-blue-700">
                                        <HelpCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                                        <p className="text-sm">{tabContents[selectedTab].extraInfo}</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Form Status */}
                        {submitStatus === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center p-4 bg-green-50 rounded-lg text-green-700"
                            >
                                <AlertCircle className="w-5 h-5 mr-2" />
                                Your request has been submitted successfully! We'll get back to you shortly.
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full py-4 px-6 rounded-lg text-white font-medium
                transition-all duration-200 flex items-center justify-center space-x-2
                ${isSubmitting ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'}`}
                        >
                            <span>{isSubmitting ? 'Submitting...' : 'Send Request'}</span>
                            <Send className="w-4 h-4" />
                        </motion.button>

                        {/* Privacy Notice */}
                        <p className="text-center text-sm text-gray-500 mt-4">
                            By submitting this form, you agree to our{' '}
                            <a href="#" className="text-orange-500 hover:underline">Privacy Policy</a>
                            {' '}and{' '}
                            <a href="#" className="text-orange-500 hover:underline">Terms of Service</a>
                        </p>
                    </form>
                </motion.div>
            </div>

            {/* Map Section */}
            <div className="max-w-7xl mx-auto mt-12">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900">Our Location</h3>
                            <a
                                href="https://goo.gl/maps/xxxxx"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-500 hover:text-orange-600 flex items-center space-x-1"
                            >
                                <span>Get Directions</span>
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                        <div className="h-[400px] rounded-lg overflow-hidden">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d738.529058846032!2d85.32888418014466!3d27.705367299490224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19a74d6ee495%3A0x7f4d91c7478c536a!2sDillibazar%20Pipal%20Bot!5e0!3m2!1sen!2snp!4v1735902739998!5m2!1sen!2snp"
                                width="100%"
                                height="400"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="rounded-lg"
                                title="Office Location"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                            <div className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium text-gray-900">Address</h4>
                                    <p className="text-sm text-gray-600">Dillibazar, Kathmandu</p>
                                    <p className="text-sm text-gray-600">Nepal</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Clock className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium text-gray-900">Business Hours</h4>
                                    <p className="text-sm text-gray-600">Mon - Fri: 9:00 AM - 6:00 PM</p>
                                    <p className="text-sm text-gray-600">Sat: 10:00 AM - 2:00 PM</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium text-gray-900">Contact</h4>
                                    <p className="text-sm text-gray-600">+977 9811787904</p>
                                    <p className="text-sm text-gray-600">support24@sugandha.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactSection;
