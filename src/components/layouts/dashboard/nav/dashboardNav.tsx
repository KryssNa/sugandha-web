'use client';

import { useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User,
  Package,
  Settings,
  Home,
  Heart,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { logoutUser } from '@/store/slices/authSlice';

export const DashboardNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const  logout  = useAuth();

  const navigationItems = [
    {
      name: 'Overview',
      href: '/auth/dashboard',
      icon: Home
    },
    {
      name: 'Profile',
      href: '/auth/dashboard/profile',
      icon: User
    },
    {
      name: 'Orders',
      href: '/auth/dashboard/orders',
      icon: Package
    },
    {
      name: 'Wishlist',
      href: '/auth/dashboard/wishlist',
      icon: Heart
    },
    {
      name: 'Settings',
      href: '/auth/dashboard/settings',
      icon: Settings
    }
  ];

  const handleLogout = useCallback(async () => {
    await logoutUser();
    router.push('/auth/login');
  }, [logout, router]);

  return (
    <nav className="space-y-1">
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isActive
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
            {isActive && (
              <motion.div
                layoutId="activeSection"
                className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-2 px-4 py-2 text-red-600 
          hover:bg-red-50 rounded-lg transition-colors mt-4"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </nav>
  );
};