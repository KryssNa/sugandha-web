// pages/admin/products/edit/[id].tsx
"use client"
import ProductForm, { ProductFormData } from '@/components/dashboard/admin/product/ProductForm';
import { showToast } from '@/components/shared/toast/showAlet';
import { useCategories } from '@/hooks/dashboard/admin/useCategories';
import { RootState, store } from '@/store';
import { fetchProductBySlug, updateProduct } from '@/store/slices/productSlice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface EditProductProps {
    slug: string;
}

export const EditProduct = ({ slug }: EditProductProps) => {
    const router = useRouter();
    const dispatch = useDispatch<typeof store.dispatch>();
    // Accessing products from the Redux store
    const { selectedProduct, loading, error } = useSelector(
        (state: RootState) => state.product
    );

    useEffect(() => {
        // Dispatch the fetchProducts action when the component mounts
        dispatch(fetchProductBySlug(slug)); // You can pass filters here if needed
    }, [dispatch]);
    const {
        categories,
        loadCategories,
    } = useCategories();

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    // Handle form submission for updates
    const handleSubmit = async (productData: ProductFormData) => {
        try {
            // Make API call to update product
            await dispatch(updateProduct(
                {
                    id: productData.id || '',
                    updateData: productData
                }
            )).unwrap();
            router.push('/admin/products');
            showToast("success", "Product updated successfully");

            // Redirect to products list
        } catch (error) {
            showToast("error", `Error updating products ${error}`);
            console.error('Error updating product:', error);
            // Show error toast
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4">
            <ProductForm
                initialData={selectedProduct}
                onSubmit={handleSubmit}
                categories={categories}
            />
        </div>
    );
};