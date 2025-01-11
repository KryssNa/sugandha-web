"use client";
// components/admin/dashboard/DashboardHeader.tsx
import { AnimatePresence, motion } from 'framer-motion';
import {
    Bell,
    HelpCircle,
    LogOut,
    Search,
    Settings,
    User
} from 'lucide-react';
import React, { useState } from 'react';

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: 'order' | 'system' | 'alert';
}

interface DashboardHeaderProps {
    user: {
        name: string;
        email: string;
        avatar?: string;
    };
    notifications: Notification[];
    onNotificationClick: (id: string) => void;
    onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    user,
    notifications,
    onNotificationClick,
    onLogout
}) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
                {/* Search Bar */}
                <div className="flex-1 max-w-lg">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 
                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <div className="relative">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 rounded-lg hover:bg-gray-100 relative"
                        >
                            <Bell className="w-6 h-6 text-gray-600" />
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white 
                  rounded-full text-xs flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </motion.button>

                        <AnimatePresence>
                            {showNotifications && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 z-30"
                                        onClick={() => setShowNotifications(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-40 
                      border border-gray-200"
                                    >
                                        <div className="p-4 border-b border-gray-200">
                                            <h3 className="font-semibold text-gray-900">Notifications</h3>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.map((notification) => (
                                                <motion.button
                                                    key={notification.id}
                                                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                                                    onClick={() => onNotificationClick(notification.id)}
                                                    className={`w-full p-4 text-left border-b border-gray-100 last:border-0
                            ${notification.read ? 'opacity-60' : ''}`}
                                                >
                                                    <p className="font-medium text-sm text-gray-900">
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-2">
                                                        {notification.time}
                                                    </p>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* User Menu */}
                    <div className="relative">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
                        >
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center 
                  justify-center text-orange-600 font-medium">
                                    {user.name.charAt(0)}
                                </div>
                            )}
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                        </motion.button>

                        <AnimatePresence>
                            {showUserMenu && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 z-30"
                                        onClick={() => setShowUserMenu(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-40 
                      border border-gray-200"
                                    >
                                        <div className="p-4 border-b border-gray-200">
                                            <p className="font-medium text-gray-900">{user.name}</p>
                                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        <div className="p-2">
                                            <motion.button
                                                whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 
                          rounded-lg"
                                            >
                                                <User className="w-4 h-4" />
                                                Profile
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 
                          rounded-lg"
                                            >
                                                <Settings className="w-4 h-4" />
                                                Settings
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 
                          rounded-lg"
                                            >
                                                <HelpCircle className="w-4 h-4" />
                                                Help Center
                                            </motion.button>
                                        </div>
                                        <div className="p-2 border-t border-gray-200">
                                            <motion.button
                                                whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                                                onClick={onLogout}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 
                          rounded-lg"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;