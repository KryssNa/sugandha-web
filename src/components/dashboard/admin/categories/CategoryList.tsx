
import { Category } from '@/components/shared/types/category.types';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Edit2,
    FolderTree,
    Plus,
    Search,
    ToggleLeft,
    ToggleRight,
    Trash2
} from 'lucide-react';
import React, { useState } from 'react';

interface CategoriesListProps {
    categories: Category[];
    onEditCategory: (category: Category) => void;
    onDeleteCategory: (categoryId: string) => void;
    onAddCategory: () => void;
    onToggleStatus?: (categoryId: string, currentStatus: 'active' | 'inactive') => void;
}

// Helper function to generate avatar from category name
const CategoryAvatar: React.FC<{ name: string, image?: string }> = ({ name, image }) => {
    // If image exists, render image
    if (image) {
        return (
            <img
                src={image}
                alt={`${name} avatar`}
                className="w-10 h-10 rounded-full object-cover"
                crossOrigin="anonymous"
            />
        );
    }

    // Generate avatar from first two letters of name
    const initials = name
        .split(' ')
        .slice(0, 2)
        .map(word => word[0].toUpperCase())
        .join('');

    return (
        <div className="w-10 h-10 rounded-full bg-orange-500 text-white 
flex items-center justify-center font-semibold text-sm">
            {initials}
        </div>
    );
};

const CategoriesList: React.FC<CategoriesListProps> = ({
    categories,
    onEditCategory,
    onDeleteCategory,
    onAddCategory,
    onToggleStatus
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    // Filter categories based on search term
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle status toggle
    const handleStatusToggle = (category: Category) => {
        if (onToggleStatus) {
            if (category.status) {
                onToggleStatus(category.id, category.status);
            }
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden py-2">
            {/* Header Section */}
            <div className="p-6 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Category Statistics */}
                    <div className="flex items-center space-x-4">
                        <div className="bg-orange-50 rounded-full p-3">
                            <FolderTree className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {categories.length} Categories
                            </h3>
                            <p className="text-sm text-gray-500">
                                Active: {categories.filter(c => c.status === 'active').length}
                            </p>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg 
        focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 
      text-gray-400 w-5 h-5" />
                    </div>

                    {/* Add Category Button */}
                    <div className="flex justify-end items-center">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onAddCategory}
                            className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg 
        hover:bg-orange-600 transition-colors"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Category
                        </motion.button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Total Products</p>
                        <p className="text-lg font-bold text-gray-900">
                            {categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0)}
                        </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Active Categories</p>
                        <p className="text-lg font-bold text-green-600">
                            {categories.filter(c => c.status === 'active').length}
                        </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Inactive Categories</p>
                        <p className="text-lg font-bold text-red-600">
                            {categories.filter(c => c.status === 'inactive').length}
                        </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Average Products/Category</p>
                        <p className="text-lg font-bold text-orange-600">
                            {categories.length > 0
                                ? Math.round(
                                    categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0) /
                                    categories.length
                                )
                                : 0}
                        </p>
                    </div>
                </div>
            </div>

            {/* List Header */}
            <div className="grid grid-cols-[80px_minmax(0,2fr)_1fr_1fr_120px] px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-600 uppercase tracking-wider">
                <div>Image</div>
                <div>Name & Description</div>
                <div>Product Count</div>
                <div>Status</div>
                <div className="text-right">Actions</div>
            </div>

            {/* Categories List */}
            <div>
                <AnimatePresence>
                    {filteredCategories.length === 0 ? (
                        <div className="text-center py-10">
                            <FolderTree className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No categories found</p>
                        </div>
                    ) : (
                        filteredCategories.map((category) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={`grid grid-cols-[80px_minmax(0,2fr)_1fr_1fr_120px] 
                  items-center px-6 py-4 border-b border-gray-100 
                  hover:bg-gray-50 transition-colors 
                  ${selectedCategory?.id === category.id ? 'bg-orange-50' : ''}`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {/* Image */}
                                <div>
                                    <CategoryAvatar
                                        name={category.name}
                                        image={category.image?.url}
                                    />
                                </div>

                                {/* Name & Description */}
                                <div>
                                    <div className="font-medium text-gray-900">{category.name}</div>
                                    {category.description && (
                                        <p className="text-sm text-gray-500 line-clamp-1">
                                            {category.description.length > 50
                                                ? `${category.description.slice(0, 50)}...`
                                                : category.description}
                                        </p>
                                    )}
                                </div>

                                {/* Product Count */}
                                <div className="text-sm text-gray-700">
                                    {category.productCount} Products
                                </div>

                                {/* Status */}
                                <div>
                                    {category.status === 'active' ? (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full 
                      bg-green-100 text-green-800 text-xs font-medium">
                                            <span className="mr-1.5 h-2 w-2 bg-green-500 rounded-full"></span>
                                            Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full 
                      bg-gray-100 text-gray-800 text-xs font-medium">
                                            <span className="mr-1.5 h-2 w-2 bg-gray-500 rounded-full"></span>
                                            Inactive
                                        </span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end items-center space-x-2">
                                    {/* Status Toggle */}
                                    {onToggleStatus && (
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleStatusToggle(category);
                                            }}
                                            className={`p-1 rounded-full ${category.status === 'active'
                                                    ? 'text-green-500 hover:bg-green-50'
                                                    : 'text-gray-400 hover:bg-gray-100'
                                                }`}
                                            title={`Toggle Status (Currently ${category.status})`}
                                        >
                                            {category.status === 'active' ? (
                                                <ToggleRight className="w-6 h-6" />
                                            ) : (
                                                <ToggleLeft className="w-6 h-6" />
                                            )}
                                        </motion.button>
                                    )}

                                    {/* Edit Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEditCategory(category);
                                        }}
                                        className="p-2 text-gray-500 hover:text-orange-600 rounded-full 
                      hover:bg-orange-50 transition-colors"
                                        title="Edit Category"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </motion.button>

                                    {/* Delete Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteCategory(category.id);
                                        }}
                                        className="p-2 text-gray-500 hover:text-red-600 rounded-full 
                      hover:bg-red-50 transition-colors"
                                        title="Delete Category"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CategoriesList;