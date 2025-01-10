'use client';

import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import {
    Camera,
    Lock,
    Mail,
    MapPin,
    Save,
    Shield,
    User
} from 'lucide-react';
import { useState } from 'react';

const ProfilePage = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        country: '',
        postalCode: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Handle profile update
        setIsEditing(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center 
              justify-center text-primary text-2xl font-bold">
                            {user?.firstName?.charAt(0)}
                        </div>
                        <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full 
              shadow-lg border border-gray-200 hover:border-primary transition-colors"
                            title='Change Profile Picture'
                        >
                            <Camera className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {user?.firstName} {user?.lastName}
                        </h2>
                        <p className="text-gray-500">{user?.email}</p>
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 
            transition-colors flex items-center gap-2"
                >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </motion.button>
            </div>

            {/* Profile Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Information */}
                            <div className="space-y-4">
                                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                                    <User className="w-4 h-4 text-primary" />
                                    Personal Information
                                </h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 
                      focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-gray-50"
                                        title='Notifications'
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 
                      focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-gray-50"
                                        title='Notifications'
                                    />
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-4">
                                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-primary" />
                                    Contact Information
                                </h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        disabled={true}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50"
                                        title='Notifications'
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Email cannot be changed
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 
                      focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-gray-50"
                                        title='Notifications'
                                    />
                                </div>
                            </div>

                            {/* Address Information */}
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    Address Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Street Address
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 
                        focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-gray-50"
                                            title='address'
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 
                        focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-gray-50"
                                            title="Notifications"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Country
                                        </label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 
                        focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-gray-50"
                                            title='Notifications'
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        {isEditing && (
                            <div className="pt-4 border-t border-gray-200">
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 
                    transition-colors flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </motion.button>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6">
                    <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        Security Settings
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900">Change Password</p>
                                <p className="text-sm text-gray-500">Update your password</p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-4 py-2 text-primary hover:bg-primary/10 rounded-lg 
                  transition-colors flex items-center gap-2"
                            >
                                <Lock className="w-4 h-4" />
                                Update
                            </motion.button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                                <p className="text-sm text-gray-500">Add an extra layer of security</p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-4 py-2 text-primary hover:bg-primary/10 rounded-lg 
                  transition-colors flex items-center gap-2"
                            >
                                Enable
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;