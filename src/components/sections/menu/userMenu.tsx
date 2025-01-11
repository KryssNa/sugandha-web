"use client"
import useSweetAlert from '@/components/shared/toast/showToast';
import { logoutUser, User as UserType } from '@/store/slices/authSlice';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ChevronDown,
    Heart,
    LogOut,
    Settings,
    ShoppingBag,
    User,
    Shield
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { cookies } from 'next/headers';

interface UserMenuProps {
    user: UserType;
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const createAlert = useSweetAlert();
    const router = useRouter();


    const handleLogout = () => {
        createAlert('success', 'Logged out successfully');
        dispatch(logoutUser());
        router.push('/auth/login');
    };

    const handleAdminNavigation = () => {
        if (user.role=="admin") {
            router.push('/admin');
        }
    };

    const getUserInitials = () => {
        return `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}`.toUpperCase();
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 focus:outline-none group"
            >
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 
          group-hover:border-primary transition-colors">
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary text-lg font-semibold">
                            {getUserInitials()}
                        </span>
                    </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600 group-hover:text-primary transition-colors" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown Menu */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50
                border border-gray-100"
                        >
                            <div className="px-4 py-2 border-b border-gray-100">
                                <p className="text-sm font-medium text-gray-900">
                                    {`${user.firstName} ${user.lastName}`}
                                </p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>

                            <div className="py-2">
                                {user.role=="admin" && (
                                    <button
                                        onClick={handleAdminNavigation}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 
                        hover:bg-gray-50 hover:text-primary transition-colors w-full text-left"
                                    >
                                        <Shield className="w-4 h-4" />
                                        Admin Dashboard
                                    </button>
                                )}
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 
                    hover:bg-gray-50 hover:text-primary transition-colors"
                                >
                                    <User className="w-4 h-4" />
                                    Dashboard
                                </Link>
                                <Link
                                    href="/dashboard/orders"
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 
                    hover:bg-gray-50 hover:text-primary transition-colors"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    My Orders
                                </Link>
                                <Link
                                    href="/wishlist"
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 
                    hover:bg-gray-50 hover:text-primary transition-colors"
                                >
                                    <Heart className="w-4 h-4" />
                                    Wishlist
                                </Link>
                                <Link
                                    href="/dashboard/settings"
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 
                    hover:bg-gray-50 hover:text-primary transition-colors"
                                >
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </Link>
                            </div>

                            <div className="border-t border-gray-100 pt-2">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 
                    hover:bg-red-50 w-full transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserMenu;