// pages/admin/products/new.tsx
"use client"
import ProductForm from '@/components/dashboard/admin/product/ProductForm';
import { Product } from '@/components/shared/types/product.types';
import { useCategories } from '@/hooks/dashboard/admin/useCategories';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    createProduct
} from '@/store/slices/productSlice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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
    const handleSubmit = async (productData: Product) => {
        try {
            // Create product
            await dispatch(createProduct(productData)).unwrap();
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