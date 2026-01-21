'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import Loader from '@/components/ui/Loader';
import ProductForm from '@/components/admin/ProductForm';

export default function EditProductPage({ params }) {
    const { id } = use(params);
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            router.push('/login');
            return;
        }

        if (user && user.role === 'admin') {
            fetchProduct();
        }
    }, [user, loading, router, id]);

    const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/products/${id}`);
            if (res.ok) {
                const data = await res.json();
                const product = data.product;
                setInitialData({
                    title: product.title,
                    slug: product.slug,
                    description: product.description,
                    price: product.price,
                    compareAtPrice: product.compareAtPrice || '',
                    stock: product.stock,
                    category: product.category,
                    featured: product.featured,
                    imageUrl: product.images?.[0] || '',
                });
            } else {
                alert('Failed to fetch product');
                router.push('/admin/products');
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            router.push('/admin/products');
        } finally {
            setIsFetching(false);
        }
    };

    const handleSubmit = async (productData) => {
        setIsSubmitting(true);

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });

            if (res.ok) {
                router.push('/admin/products');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to update product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading || isFetching) return <Loader.Page />;
    if (!user || user.role !== 'admin') return null;

    return (
        <ProductForm
            mode="edit"
            initialData={initialData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
        />
    );
}
