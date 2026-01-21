'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Loader';

function ProductsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get category from URL or default to 'all'
    const selectedCategory = searchParams.get('category') || 'all';

    const categories = [
        { name: 'All', value: 'all' },
        { name: 'Casual', value: 'casual' },
        { name: 'Formal', value: 'formal' },
        { name: 'Party', value: 'party' },
        { name: 'Ethnic', value: 'ethnic' },
        { name: 'Western', value: 'western' },
        { name: 'Summer', value: 'summer' },
        { name: 'Winter', value: 'winter' },
    ];

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedCategory !== 'all') {
                params.append('category', selectedCategory);
            }

            const res = await fetch(`/api/products?${params.toString()}`);
            const data = await res.json();

            if (data.products) {
                setProducts(data.products);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (category) => {
        if (category === 'all') {
            router.push('/products');
        } else {
            router.push(`/products?category=${category}`);
        }
    };

    return (
        <div className="container mx-auto px-4 py-6 md:py-12 min-h-screen">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                {selectedCategory === 'all' ? 'All Products' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products`}
            </h1>

            {/* Category Filter */}
            <div className="mb-8">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((category) => (
                        <button
                            key={category.value}
                            onClick={() => handleCategoryChange(category.value)}
                            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${selectedCategory === category.value
                                ? 'bg-accent text-accent-foreground'
                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {[...Array(8)].map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                        No products found
                    </p>
                </div>
            )}
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center">Loading...</div>}>
            <ProductsContent />
        </Suspense>
    );
}
