'use client';

import { showToast } from '@/components/shared/toast/showAlet';
import useToast from '@/hooks/useToast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUserProfile } from '@/store/slices/authSlice';
import { motion } from 'framer-motion';
import {
    Camera,
    Loader,
    Mail,
    MapPin,
    Save,
    User
} from 'lucide-react';
import { useRef, useState } from 'react';

const ProfilePage = () => {
    const toast = useToast();

    const dispatch = useAppDispatch();
    const ProfileAvatar = ({
        user,
        onUpload
    }: {
        user: any,
        onUpload: (file: File) => Promise<void>
    }) => {
        const [isUploading, setIsUploading] = useState(false);
        const fileInputRef = useRef<HTMLInputElement>(null);

        const getInitials = () => {
            return `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase();
        };

        const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            if (file.size > 5 * 1024 * 1024) {
                toast("error", 'File size should be less than 5MB');
                return;
            }

            if (!file.type.startsWith('image/')) {
                toast("error", 'Please upload an image file');
                return;
            }

            setIsUploading(true);
            try {
                await onUpload(file);
                toast("success", 'Profile picture updated successfully');
            } catch (error) {
                toast("error", 'Failed to upload profile picture');
            } finally {
                setIsUploading(false);
            }
        };

        return (
            <div className="relative">
                {user?.avatar ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-20 h-20 rounded-full overflow-hidden"
                    >
                        <img
                            src={user.avatar}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 rounded-full bg-primary/10 flex items-center 
                  justify-center text-primary text-2xl font-bold"
                    >
                        {getInitials()}
                    </motion.div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full 
                shadow-lg border border-gray-200 hover:border-primary transition-colors"
                >
                    {isUploading ? (
                        <Loader className="w-4 h-4 animate-spin text-primary" />
                    ) : (
                        <Camera className="w-4 h-4 text-gray-600" />
                    )}
                </motion.button>
            </div>
        );
    };

    const handleProfilePictureUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads/profile-picture`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to upload profile picture');
        }

        const data = await response.json();
        await dispatch(updateUserProfile(data.avatar));
    };



    const { user } = useAppSelector(state => state.auth);

    // const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        contact: user?.contact || '',
        street: user?.street || '',
        city: user?.city || '',
        country: user?.country || '',
        state: user?.state || '',
        postalCode: user?.postalCode || ''
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
        try {
            const response = await dispatch(updateUserProfile(formData)).unwrap();
            // Handle success
            showToast('success', 'Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            showToast('error', 'Failed to update profile');
            console.log('Failed to update profile:', error);
            // Handle error
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        {/* <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center 
              justify-center text-primary text-2xl font-bold">
                            {user?.firstName?.charAt(0)}
                        </div>
                        <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full 
              shadow-lg border border-gray-200 hover:border-primary transition-colors"
                            title='Change Profile Picture'
                        >
                            <Camera className="w-4 h-4 text-gray-600" />
                        </button> */}
                        <ProfileAvatar user={user} onUpload={handleProfilePictureUpload} />
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
                                    <label className="flex text-sm font-medium text-gray-700 mb-1">
                                        Email {" "}<p className="ps-1 text-sm text-gray-500">
                                            (Email cannot be changed)
                                        </p>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        disabled={true}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50"
                                        title='Notifications'
                                    />

                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Contact Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="contact"
                                        value={formData.contact}
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
                                    {/* Street Address - Full Width */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Street Address
                                        </label>
                                        <input
                                            type="text"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 
                    focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-gray-50"
                                            title='address'
                                        />
                                    </div>

                                    {/* City - Half Width */}
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

                                    {/* State - Half Width */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            State
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 
                    focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-gray-50"
                                            title="Notifications"
                                        />
                                    </div>

                                    {/* Country - Half Width */}
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

                                    {/* Postal Code - Half Width */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Postal Code
                                        </label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={formData.postalCode}
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

        </div>
    );
};

export default ProfilePage;