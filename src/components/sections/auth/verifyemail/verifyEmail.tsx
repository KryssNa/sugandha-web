'use client';

import useToast from '@/hooks/useToast';
import { verifyEmail } from '@/services/auth.service';
import { useAppDispatch } from '@/store/hooks';
import { fetchCurrentUser } from '@/store/slices/authSlice';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Lock, ShieldCheck } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';

const VerifyEmailContent: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isVerifying, setIsVerifying] = useState(true);
    const [isValid, setIsValid] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useAppDispatch();

    const toast = useToast();

    useEffect(() => {
        const verifyToken = async () => {
            const token = searchParams?.get('token');
            if (!token) {
                setError('Invalid reset link');
                setIsVerifying(false);
                return;
            }

            try {
                const response = await verifyEmail(token);
                if (response.success) {
                    toast("success", "Email verified successfully!");
                    dispatch(fetchCurrentUser());
                    setIsValid(true);
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

    return (
        <div className="flex flex-col items-center justify-center h-[70vh]">
            <AnimatePresence>
                {isVerifying && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-center justify-center p-4 space-x-2 bg-gray-100 rounded-lg"
                    >
                        <ShieldCheck size={24} />
                        <p>Verifying...</p>
                    </motion.div>
                )}
                {!isVerifying && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex items-center justify-center p-4 space-x-2 rounded-lg shadow-md ${isValid ? 'bg-[#d4edda]' : 'bg-[#f8d7da]'
                            }`}
                    >
                        {isValid ? (
                            <CheckCircle size={24} className="text-[#155724]" />
                        ) : (
                            <Lock size={24} className="text-[#721c24]" />
                        )}
                        <p
                            className={`text-lg font-semibold ${isValid ? 'text-[#155724]' : 'text-[#721c24]'
                                }`}
                        >
                            {isValid
                                ? 'Your email has been verified successfully'
                                : error}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const VerifyEmail: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
};

export default VerifyEmail;
