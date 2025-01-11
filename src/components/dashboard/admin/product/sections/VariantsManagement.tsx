'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2,
  Box
} from 'lucide-react';

interface VariantsManagementSectionProps {
  variantManager: {
    variants: any[];
    actions: {
      addVariant: (variant: any) => Promise<boolean>;
      updateVariant: (sku: string, updates: any) => Promise<boolean>;
      deleteVariant: (sku: string) => Promise<boolean>;
    };
  };
}

const VariantsManagementSection: React.FC<VariantsManagementSectionProps> = ({ 
  variantManager 
}) => {
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [newVariant, setNewVariant] = useState({
    size: '',
    sku: '',
    price: '',
    quantity: '',
  });

  const handleAddVariant = async () => {
    // Validate variant data
    if (!newVariant.size || !newVariant.sku || !newVariant.price || !newVariant.quantity) {
      alert('Please fill in all variant details');
      return;
    }

    try {
      const success = await variantManager.actions.addVariant({
        size: parseFloat(newVariant.size),
        sku: newVariant.sku,
        price: parseFloat(newVariant.price),
        quantity: parseInt(newVariant.quantity, 10)
      });

      if (success) {
        // Reset form and close
        setNewVariant({
          size: '',
          sku: '',
          price: '',
          quantity: ''
        });
        setIsAddingVariant(false);
      }
    } catch (error) {
      console.error('Failed to add variant', error);
      alert('Failed to add variant. Please try again.');
    }
  };

  const renderAddVariantForm = () => (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Size (ml)
          </label>
          <input
            type="number"
            value={newVariant.size}
            onChange={(e) => setNewVariant(prev => ({ ...prev, size: e.target.value }))}
            className="w-full rounded-md border-gray-300"
            placeholder="50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SKU
          </label>
          <input
            type="text"
            value={newVariant.sku}
            onChange={(e) => setNewVariant(prev => ({ ...prev, sku: e.target.value }))}
            className="w-full rounded-md border-gray-300"
            placeholder="PROD-001"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <input
            type="number"
            value={newVariant.price}
            onChange={(e) => setNewVariant(prev => ({ ...prev, price: e.target.value }))}
            className="w-full rounded-md border-gray-300"
            placeholder="99.99"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            value={newVariant.quantity}
            onChange={(e) => setNewVariant(prev => ({ ...prev, quantity: e.target.value }))}
            className="w-full rounded-md border-gray-300"
            placeholder="100"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <button
          type="button"
          onClick={() => setIsAddingVariant(false)}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleAddVariant}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Add Variant
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Product Variants</h2>
        <button
          type="button"
          onClick={() => setIsAddingVariant(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg 
            hover:bg-orange-100 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Variant
        </button>
      </div>

      {/* Add Variant Form */}
      {isAddingVariant && renderAddVariantForm()}

      {/* Variants Table */}
      {variantManager.variants.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-2 text-left">Size (ml)</th>
                <th className="border p-2 text-left">SKU</th>
                <th className="border p-2 text-left">Price</th>
                <th className="border p-2 text-left">Quantity</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {variantManager.variants.map((variant) => (
                <tr key={variant.sku} className="hover:bg-gray-50">
                  <td className="border p-2">{variant.size} ml</td>
                  <td className="border p-2">{variant.sku}</td>
                  <td className="border p-2">₹{variant.price.toFixed(2)}</td>
                  <td className="border p-2">{variant.quantity}</td>
                  <td className="border p-2">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => {/* Edit Variant */}}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => variantManager.actions.deleteVariant(variant.sku)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-4">
          <Box className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>No variants added yet. Click "Add Variant" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default VariantsManagementSection;