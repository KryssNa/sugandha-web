// pages/admin/products/edit/[id].tsx

import ProductForm, { ProductFormData } from '@/components/dashboard/admin/product/ProductForm';
import { Category } from '@/components/shared/types/productTypes';
import { RootState, store } from '@/store';
import { fetchProducts } from '@/store/slices/productSlice';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface EditProductProps {
    slug: string;
}

export const EditProduct = ({ slug }: EditProductProps) => {
    const router = useRouter();
    const { id } = router.query;
    const [productData, setProductData] = useState<Partial<ProductFormData>>();
    const [categories, setCategories] = useState<Category[]>([]);

    const dispatch = useDispatch<typeof store.dispatch>();

    // Accessing products from the Redux store
    const { products, loading, error } = useSelector(
        (state: RootState) => state.product
    );

    useEffect(() => {
        // Dispatch the fetchProducts action when the component mounts
        dispatch(fetchProducts({})); // You can pass filters here if needed
    }, [dispatch]);

    // Fetch existing product data
    // useEffect(() => {
    //     const fetchProduct = async () => {
    //         try {
    //             const response = await fetch(`/api/products/${id}`);
    //             if (!response.ok) throw new Error('Failed to fetch product');

    //             const data = await response.json();
    //             setProductData(data);
    //         } catch (error) {
    //             console.error('Error fetching product:', error);
    //             // Show error toast
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     if (id) fetchProduct();

    //     const fetchCategories = async () => {
    //         try {
    //             const response = await fetch('/api/categories');
    //             if (!response.ok) throw new Error('Failed to fetch categories');

    //             const data = await response.json();
    //             setCategories(data);
    //         } catch (error) {
    //             console.error('Error fetching categories:', error);
    //             // Show error toast
    //         }
    //     };

    //     fetchCategories();
    // }, [id]);

    // Handle form submission for updates
    const handleSubmit = async (productData: ProductFormData) => {
        try {
            // Make API call to update product
            const response = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });

            if (!response.ok) throw new Error('Failed to update product');

            // Redirect to products list

        } catch (error) {
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
                initialData={productData}
                onSubmit={handleSubmit}
                categories={categories}
            />
        </div>
    );
};