'use client';

import DashboardHeader from '@/components/dashboard/admin/header/dashboardHeader';
import useSweetAlert from '@/components/shared/toast/showToast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser } from '@/store/slices/authSlice';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ChevronRight,
    FileText,
    LayoutDashboard,
    LogOut,
    Package,
    Settings,
    ShoppingBag,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// Types
interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
    badge?: number;
    group?: string;
}

// Types
interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: 'order' | 'system' | 'alert';
}

// Mock Notification Data (replace with actual data from your app)
const mockNotifications: Notification[] = [
    {
        id: '1',
        title: 'New Order',
        message: 'Order #1234 has been placed',
        time: '2 mins ago',
        read: false,
        type: 'order'
    },
    {
        id: '2',
        title: 'System Update',
        message: 'System maintenance scheduled',
        time: '1 hour ago',
        read: true,
        type: 'system'
    }
];

// Main Layout Component
const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const pathname = usePathname();
    const createAlert = useSweetAlert();

    // Get auth state from Redux
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, router]);

    // If not authenticated, return null to prevent rendering
    if (!isAuthenticated) {
        return null;
    }

    // Navigation Items
    const navigationItems: NavItem[] = [
        {
            name: 'Dashboard',
            href: '/admin',
            icon: LayoutDashboard,
            group: 'Main'
        },
        {
            name: 'Products',
            href: '/admin/products',
            icon: Package,
            badge: 12,
            group: 'Inventory'
        },
        {
            name: 'Orders',
            href: '/admin/orders',
            icon: ShoppingBag,
            badge: 5,
            group: 'Sales'
        },
        {
            name: 'Customers',
            href: '/admin/customers',
            icon: Users,
            group: 'Users'
        },
        {
            name: 'Reports',
            href: '/admin/reports',
            icon: FileText,
            group: 'Analytics'
        },
        {
            name: 'Settings',
            href: '/admin/settings',
            icon: Settings,
            group: 'System'
        }
    ];

    // Group navigation items
    const groupedNavItems = navigationItems.reduce((groups, item) => {
        const group = item.group || 'Other';
        if (!groups[group]) groups[group] = [];
        groups[group].push(item);
        return groups;
    }, {} as Record<string, NavItem[]>);

    // Handle Notification Click
    const handleNotificationClick = (id: string) => {
        // Implement notification click logic
        console.log(`Notification clicked: ${id}`);
    };

    // Handle Logout
    const handleLogout = () => {
        dispatch(logoutUser());
        createAlert('success', 'Logged out successfully');
        router.push('/auth/login');
    };

    // Render Navigation Items
    const renderNavItems = (group: string, items: NavItem[]) => (
        <div key={group} className="mb-4">
            {isSidebarOpen && (
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {group}
                </div>
            )}
            {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg 
                            transition-colors group relative
                            ${isActive
                                ? "bg-orange-50 text-orange-600"
                                : "text-gray-700 hover:bg-gray-100"}`}
                    >
                        <div className="flex items-center space-x-3">
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {isSidebarOpen && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="whitespace-nowrap"
                                >
                                    {item.name}
                                </motion.span>
                            )}
                        </div>

                        {item.badge && isSidebarOpen && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`px-2 py-1 text-xs rounded-full ml-2
                                    ${isActive
                                        ? "bg-orange-100 text-orange-600"
                                        : "bg-gray-100 text-gray-600"}`}
                            >
                                {item.badge}
                            </motion.span>
                        )}
                    </Link>
                );
            })}
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            <div
                className={`bg-white border-r border-gray-200 transition-all duration-300 
                    hidden lg:block fixed left-0 top-0 bottom-0 z-40
                    ${isSidebarOpen ? 'w-64' : 'w-20'}`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <AnimatePresence>
                        {isSidebarOpen && (
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="text-xl font-bold text-gray-800"
                            >
                                Admin Panel
                            </motion.h1>
                        )}
                    </AnimatePresence>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-full hover:bg-gray-100"
                        aria-label="Toggle Sidebar"
                    >
                        <ChevronRight
                            className={`w-5 h-5 transform transition-transform 
                                ${isSidebarOpen ? 'rotate-180' : ''}`}
                        />
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="mt-4">
                    {Object.entries(groupedNavItems).map(([group, items]) =>
                        renderNavItems(group, items)
                    )}
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full p-4 text-red-600 hover:bg-red-50 
                            transition-colors"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        <AnimatePresence>
                            {isSidebarOpen && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="flex-1"
                                >
                                    Logout
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <main
                className={`flex-1 transition-all duration-300 ml-${isSidebarOpen ? '64' : '20'} 
                    mt-16 lg:mt-0`}
            >
                {/* Dashboard Header */}
                <DashboardHeader
                    user={{
                        name: user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Admin',
                        email: user?.email || '',
                        avatar: user?.avatar || ''
                    }}
                    notifications={mockNotifications}
                    onNotificationClick={handleNotificationClick}
                    onLogout={handleLogout}
                />

                {/* Page Content */}
                <div className="p-4 lg:p-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm min-h-[calc(100vh-200px)]">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
