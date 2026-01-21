'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import Loader from '@/components/ui/Loader';
import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const handleSubmit = async (productData) => {
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });

            if (res.ok) {
                router.push('/admin/products');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to create product');
            }
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <Loader.Page />;
    if (!user || user.role !== 'admin') return null;

    return (
        <ProductForm
            mode="create"
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
        />
    );
}
