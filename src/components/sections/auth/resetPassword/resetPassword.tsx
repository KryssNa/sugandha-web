'use client';

import useToast from '@/hooks/useToast';
import { resetPassword, verifyResetToken } from '@/services/auth.service';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Lock, ShieldCheck } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';

const ResetPasswordContent: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isVerifying, setIsVerifying] = useState(true);
    const [isValid, setIsValid] = useState(false);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const toast = useToast()

    useEffect(() => {
        const verifyToken = async () => {
            const token = searchParams?.get('token');
            if (!token) {
                // toast("error", "Invalid reset link!")
                setError('Invalid reset link');
                setIsVerifying(false);
                return;
            }

            try {
                const response = await verifyResetToken(token);
                if (response.success && response.data.tokenValid) {
                    setIsValid(true);
                    setEmail(response.data.email);
                } else {
                    setError('This reset link has expired or is invalid');
                }
            } catch (err) {
                setError('Failed to verify reset link');
            } finally {
                setIsVerifying(false);
            }
        };

        verifyToken();
    }, [searchParams]);

    const validatePasswords = () => {
        if (!formData.newPassword) return 'Password is required';
        if (formData.newPassword.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.newPassword)) {
            return 'Password must include uppercase, lowercase, number, and special character';
        }
        if (formData.newPassword !== formData.confirmPassword) return 'Passwords do not match';
        return '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const passwordError = validatePasswords();
        if (passwordError) {
            setError(passwordError);
            return;
        }
        setIsLoading(true);
        setError('');

        try {
            const token = searchParams?.get('token') || '';
            const response = await resetPassword(token, formData.newPassword);
            if (response.success) {
                setIsSuccess(true);
                toast("question", "Password changed successfully")
                setTimeout(() => {
                    router.push('/auth/login');
                }, 1000);

            } else {
                setError(response.message);
            }
        } catch (err) {
            console.log("ee", err)
            toast("error", (err as any).response.data.message ?? "Failed to reset password. Please try again")
            // setError('Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isVerifying) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
                <div className="bg-orange-500 text-white p-6">
                    <div className="flex items-center space-x-3">
                        <ShieldCheck className="w-8 h-8" />
                        <h2 className="text-xl font-bold">Reset Password</h2>
                    </div>
                    {isValid && (
                        <p className="text-sm text-orange-100 mt-2">
                            Reset password for {email}
                        </p>
                    )}
                </div>

                <div className="p-6">
                    <AnimatePresence mode="wait">
                        {!isValid ? (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center text-red"
                            >
                                <p>{error}</p>
                            </motion.div>
                        ) : !isSuccess ? (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                onSubmit={handleSubmit}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={formData.newPassword}
                                            onChange={(e) => {
                                                setFormData(prev => ({ ...prev, newPassword: e.target.value }));
                                                setError('');
                                            }}
                                            placeholder="Create new password"
                                            className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 
                        ${error ? 'border-red-500 focus:ring-red' : 'border-gray-300 focus:ring-orange-500'}`}
                                        />
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={formData.confirmPassword}
                                            onChange={(e) => {
                                                setFormData(prev => ({ ...prev, confirmPassword: e.target.value }));
                                                setError('');
                                            }}
                                            placeholder="Confirm new password"
                                            className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 
                        ${error ? 'border-red-500 focus:ring-red' : 'border-gray-300 focus:ring-orange-500'}`}
                                        />
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-red text-sm">{error}</p>
                                )}

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="showPassword"
                                        checked={showPassword}
                                        onChange={() => setShowPassword(!showPassword)}
                                        className="rounded text-orange-500 focus:ring-orange-500 mr-2"
                                    />
                                    <label htmlFor="showPassword" className="text-sm text-gray-600">
                                        Show password
                                    </label>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full px-4 py-3 bg-orange-500 text-white rounded-lg
                    ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-orange-600'}`}
                                >
                                    {isLoading ? 'Resetting...' : 'Reset Password'}
                                </motion.button>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-4"
                            >
                                <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                                    <CheckCircle className="w-12 h-12 text-green-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Password Reset Successful</h3>
                                <p className="text-gray-600">
                                    Your password has been successfully reset. Redirecting to login...
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

const ResetPassword: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
};


export default ResetPassword;