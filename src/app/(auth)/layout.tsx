'use client';

import Footer from '@/components/layouts/footers';
import Header from '@/components/layouts/headers';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCurrentUser } from '@/store/slices/authSlice';
import { fetchCart } from '@/store/slices/cartSlice';
import { fetchCSRFToken } from '@/utils/csrf/CSRFToken';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Bell,
    Grid,
    Package,
    Search,
    Settings,
    User
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {

    // Add this to your app initialization
    // if (typeof window !== 'undefined') {
    //     const token = localStorage.getItem('accessToken');
    //     if (token) {
    //         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    //     }
    // }
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAuth();

    const navigationItems = [
        {
            name: 'Overview',
            href: '/dashboard',
            icon: Grid,
            description: 'Dashboard overview and summary'
        },
        {
            name: 'Orders',
            href: '/dashboard/orders',
            icon: Package,
            description: 'Track and manage your orders'
        },
        {
            name: 'Profile',
            href: '/dashboard/profile',
            icon: User,
            description: 'Manage your personal information'
        },
        {
            name: 'Settings',
            href: '/dashboard/settings',
            icon: Settings,
            description: 'Account preferences and settings'
        }
    ];
    const dispatch = useAppDispatch();

    const { isAuthenticated } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCart());
            dispatch(fetchCurrentUser());
        }
    }, [dispatch, isAuthenticated]);
    useEffect(() => {
        fetchCSRFToken();
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            {/* Dashboard Container */}
            <div className="flex-1 pt-[92px] pb-[100px]"> {/* Adjusted for header and footer */}
                <div className="container mx-auto px-4">
                    {/* User Welcome Section */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {navigationItems.find(item => item.href === pathname)?.name || 'Welcome Back'}
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Hello, {user?.firstName}! Here's what's happening with your account.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                    focus:ring-2 focus:ring-primary/50 w-64"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                            <button className="p-2 bg-white text-gray-600 hover:text-primary rounded-lg 
                transition-colors relative shadow-sm border border-gray-100"
                                title='Notifications'

                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        {navigationItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`p-4 rounded-xl transition-all duration-200 ${isActive
                                            ? 'bg-primary text-white shadow-lg'
                                            : 'bg-white text-gray-600 hover:shadow-md border border-gray-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-gray-100'
                                                }`}>
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className={`font-medium ${isActive ? 'text-white' : 'text-gray-900'}`}>
                                                    {item.name}
                                                </h3>
                                                <p className={`text-sm mt-0.5 ${isActive ? 'text-white/80' : 'text-gray-500'
                                                    }`}>
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Main Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-200 min-h-[500px]"
                        >
                            <div className="p-6">
                                {children}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
                <div className="grid grid-cols-4 p-2 gap-2">
                    {navigationItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                            >
                                <motion.div
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex flex-col items-center justify-center p-2 rounded-xl ${isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-gray-600'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-xs mt-1">{item.name}</span>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default DashboardLayout;