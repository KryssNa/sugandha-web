'use client';

import { Category, Product } from '@/components/shared/types/product.types';
import React from 'react';

interface BasicInformationSectionProps {
  formData: Partial<Product>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Product>>>;
  categories: Category[];
}

const BasicInformationSection: React.FC<BasicInformationSectionProps> = ({
  formData,
  setFormData,
  categories
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

      {/* Title and Brand */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Product Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="block w-full rounded-md border-gray-300 shadow-sm 
              focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
            required
            placeholder="Enter product name"
          />
        </div>
        <div>
          <label
            htmlFor="brand"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Brand
          </label>
          <input
            type="text"
            id="brand"
            value={formData.brand || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
            className="block w-full rounded-md border-gray-300 shadow-sm 
              focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
            required
            placeholder="Enter brand name"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className="block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
          placeholder="Provide a detailed description of the product"
        />
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Category
          </label>
          <select
            id="category"
            value={formData.category?.[0] || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              category: e.target.value ? [e.target.value] : []
            }))}
            className="block w-full rounded-md border-gray-300 shadow-sm 
              focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
            required
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Gender */}
        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Gender
          </label>
          <select
            id="gender"
            value={formData.gender || 'unisex'}
            onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
            className="block w-full rounded-md border-gray-300 shadow-sm 
              focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
          >
            <option value="unisex">Unisex</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Concentration */}
        <div>
          <label
            htmlFor="concentration"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Concentration
          </label>
          <select
            id="concentration"
            value={formData.concentration || 'EDT'}
            onChange={(e) => setFormData(prev => ({ ...prev, concentration: e.target.value }))}
            className="block w-full rounded-md border-gray-300 shadow-sm 
              focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
          >
            <option value="EDT">EDT</option>
            <option value="EDP">EDP</option>
            <option value="Parfum">Parfum</option>
          </select>
        </div>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="basePrice"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Base Price
          </label>
          <input
            type="number"
            id="basePrice"
            value={formData.basePrice || 0}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              basePrice: parseFloat(e.target.value)
            }))}
            min="0"
            step="0.01"
            className="block w-full rounded-md border-gray-300 shadow-sm 
              focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label
            htmlFor="originalPrice"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Original Price (Optional)
          </label>
          <input
            type="number"
            id="originalPrice"
            value={formData.originalPrice || 0}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              originalPrice: parseFloat(e.target.value)
            }))}
            min="0"
            step="0.01"
            className="block w-full rounded-md border-gray-300 shadow-sm 
              focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInformationSection;