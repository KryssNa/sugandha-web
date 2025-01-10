'use client';

import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/store/hooks';
import { logoutUser } from '@/store/slices/authSlice';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Bell,
    ChevronRight,
    Heart,
    LogOut,
    Menu,
    Package,
    Settings,
    User,
    X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const { user } = useAuth();

    const navigationItems = [
        {
            name: 'Profile',
            href: '/dashboard/profile',
            icon: User
        },
        {
            name: 'Orders',
            href: '/dashboard/orders',
            icon: Package
        },
        {
            name: 'Wishlist',
            href: '/dashboard/wishlist',
            icon: Heart
        },
        {
            name: 'Settings',
            href: '/dashboard/settings',
            icon: Settings
        }
    ];

    const handleLogout = async () => {
        dispatch(logoutUser());
        router.push('/auth/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Navigation */}
            <div className="lg:hidden">
                <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-2">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 rounded-lg hover:bg-gray-100"
                            title='Menu'
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <Link href="/" className="flex-shrink-0">
                            <img src="/assets/logo/logo.png" alt="Logo" className="h-8" />
                        </Link>
                        <button className="p-2 rounded-lg hover:bg-gray-100" title='Notifications'>
                            <Bell className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween' }}
                            className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 lg:hidden"
                        >
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-6">
                                    <Link href="/" className="flex-shrink-0">
                                        <img src="/assets/logo/logo.png" alt="Logo" className="h-8" />
                                    </Link>
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-2 rounded-lg hover:bg-gray-100"
                                        title='Close'
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <div className="mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center 
                      justify-center text-primary font-semibold">
                                            {user?.firstName?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {user?.firstName} {user?.lastName}
                                            </p>
                                            <p className="text-sm text-gray-500">{user?.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <nav className="space-y-1">
                                    {navigationItems.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg 
                          transition-colors ${isActive
                                                        ? 'bg-primary text-white'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                            >
                                                <item.icon className="w-5 h-5" />
                                                <span>{item.name}</span>
                                            </Link>
                                        );
                                    })}
                                </nav>
                                <button
                                    onClick={handleLogout}
                                    className="mt-6 w-full flex items-center gap-2 px-4 py-2 text-red-600 
                    hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <div className={`hidden lg:flex`}>
                <motion.div
                    initial={false}
                    animate={{ width: isSidebarOpen ? 256 : 80 }}
                    className="fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-40"
                >
                    <div className="flex flex-col h-full">
                        <div className="p-4">
                            <Link href="/" className="flex-shrink-0">
                                <img src="/assets/logo/logo.png" alt="Logo" className="h-8" />
                            </Link>
                        </div>
                        <div className="flex-grow px-4 py-2">
                            <nav className="space-y-1">
                                {navigationItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg 
                        transition-colors ${isActive
                                                    ? 'bg-primary text-white'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            {isSidebarOpen && <span>{item.name}</span>}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                        <div className="p-4 border-t border-gray-200">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-4 py-2 text-red-600 
                  hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                {isSidebarOpen && <span>Logout</span>}
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white 
              border border-gray-200 rounded-full p-1.5 shadow-sm"
                        title='Toggle Sidebar'
                    >
                        <ChevronRight
                            className={`w-4 h-4 transition-transform ${isSidebarOpen ? 'rotate-180' : ''
                                }`}
                        />
                    </button>
                </motion.div>
                <div
                    className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'
                        }`}
                >
                    <div className="p-8">{children}</div>
                </div>
            </div>

            {/* Mobile Content */}
            <div className="lg:hidden pt-16 px-4 py-6">{children}</div>
        </div>
    );
};

export default DashboardLayout;