// pages/admin/products/new.tsx
"use client"
import ProductForm, { ProductFormData } from '@/components/dashboard/admin/product/ProductForm';
import { useCategories } from '@/hooks/dashboard/admin/useCategories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { 
    createProduct,
    updateProduct,
    deleteProduct 
  } from '@/store/slices/productSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
export const AddProduct = () => {
    const router = useRouter();
    const {
        categories,
        loadCategories,
    } = useCategories();

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.product);

    // Handle form submission
    const handleSubmit = async (productData: ProductFormData) => {
        try {
            // Make API call to create product
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });

            if (!response.ok) throw new Error('Failed to create product');

            // Redirect to products list
            router.push('/admin/products');
        } catch (error) {
            console.error('Error creating product:', error);
            // Show error toast
        }
    };

    return (
        <div className="container mx-auto px-4">
            <ProductForm onSubmit={handleSubmit} categories={categories} />
        </div>
    );
};