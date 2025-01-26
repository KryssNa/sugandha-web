"use client";
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    Lock,
    Mail,
    ShieldCheck
} from 'lucide-react';
import React, { useState } from 'react';

// Types
interface FormData {
    email: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
}

const PasswordResetForm: React.FC = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [showPassword, setShowPassword] = useState(false);

    const validateEmail = () => {
        const emailError: { email?: string } = {};
        if (!formData.email) {
            emailError.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            emailError.email = 'Email is invalid';
        }
        return emailError;
    };

    const validateOTP = () => {
        const otpError: { otp?: string } = {};
        if (!formData.otp) {
            otpError.otp = 'OTP is required';
        } else if (formData.otp.length !== 6) {
            otpError.otp = 'OTP must be 6 digits';
        }
        return otpError;
    };

    const validatePasswords = () => {
        const passwordErrors: { newPassword?: string; confirmPassword?: string } = {};

        if (!formData.newPassword) {
            passwordErrors.newPassword = 'Password is required';
        } else if (formData.newPassword.length < 8) {
            passwordErrors.newPassword = 'Password must be at least 8 characters';
        } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.newPassword)) {
            passwordErrors.newPassword = 'Password must include uppercase, lowercase, number, and special character';
        }

        if (formData.newPassword !== formData.confirmPassword) {
            passwordErrors.confirmPassword = 'Passwords do not match';
        }

        return passwordErrors;
    };

    const handleNext = () => {
        let errors = {};

        switch (step) {
            case 1:
                errors = validateEmail();
                break;
            case 2:
                errors = validateOTP();
                break;
            case 3:
                errors = validatePasswords();
                break;
        }

        setErrors(errors);

        if (Object.keys(errors).length === 0) {
            setStep(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        setStep(prev => prev - 1);
    };

    const handleSubmit = async () => {
        try {
            // Implement password reset API call
            console.log('Resetting password', formData);
            // Redirect or show success message
        } catch (error) {
            console.error('Password reset failed', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear specific error when user starts typing
        if (errors[name as keyof FormData]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const stepVariants = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="bg-orange-500 text-white p-6">
                    <div className="flex items-center space-x-3">
                        <ShieldCheck className="w-8 h-8" />
                        <h2 className="text-xl font-bold">Reset Password</h2>
                    </div>
                    <p className="text-sm text-orange-100 mt-2">
                        Follow the steps to reset your account password
                    </p>
                </div>

                {/* Form Container */}
                <div className="p-6">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                {...stepVariants}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 
                        ${errors.email
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-orange-500'
                                                }`}
                                        />
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                {...stepVariants}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Enter OTP
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="otp"
                                            maxLength={6}
                                            value={formData.otp}
                                            onChange={handleChange}
                                            placeholder="Enter 6-digit OTP"
                                            className={`w-full px-4 py-3 text-center tracking-[0.5em] border rounded-lg focus:outline-none focus:ring-2 
                        ${errors.otp
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-orange-500'
                                                }`}
                                        />
                                    </div>
                                    {errors.otp && (
                                        <p className="text-red-500 text-xs mt-1 text-center">{errors.otp}</p>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                {...stepVariants}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            placeholder="Create new password"
                                            className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 
                        ${errors.newPassword
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-orange-500'
                                                }`}
                                        />
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                    {errors.newPassword && (
                                        <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm new password"
                                            className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 
                        ${errors.confirmPassword
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-orange-500'
                                                }`}
                                        />
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="showPassword"
                                        checked={showPassword}
                                        onChange={() => setShowPassword(!showPassword)}
                                        className="mr-2 text-orange-500 focus:ring-orange-500"
                                    />
                                    <label htmlFor="showPassword" className="text-sm text-gray-700">
                                        Show Password
                                    </label>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                {...stepVariants}
                                className="text-center space-y-4"
                            >
                                <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-16 h-16 text-green-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Password Reset Successful
                                </h3>
                                <p className="text-gray-600">
                                    You can now log in with your new password
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="mt-6 flex justify-between space-x-4">
                        {step > 1 && step < 4 && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handlePrevious}
                                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 
                  rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span>Previous</span>
                            </motion.button>
                        )}

                        {step < 4 && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleNext}
                                className="ml-auto flex items-center space-x-2 px-4 py-2 
                  bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                            >
                                {step === 3 ? 'Reset Password' : 'Next'}
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        )}

                        {step === 4 && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {/* Redirect to login */ }}
                                className="w-full px-4 py-2 
                  bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                            >
                                Back to Login
                            </motion.button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PasswordResetForm;