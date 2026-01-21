'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../providers/CartProvider';
import Button from '../ui/Button';
import WishlistButton from '../wishlist/WishlistButton';
import ShareButton from '../ui/ShareButton';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState('');

    // Calculate price range from size variants
    const minPrice = product.minPrice || (product.sizes && product.sizes.length > 0
        ? Math.min(...product.sizes.map(s => s.price))
        : product.price || 0);

    const maxPrice = product.maxPrice || (product.sizes && product.sizes.length > 0
        ? Math.max(...product.sizes.map(s => s.price))
        : product.price || 0);

    // Calculate total stock from all sizes
    const totalStock = product.totalStock || (product.sizes && product.sizes.length > 0
        ? product.sizes.reduce((sum, s) => sum + (s.stock || 0), 0)
        : product.stock || 0);

    const handleQuickAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!selectedSize) {
            alert('Please select a size');
            return;
        }

        // Find the selected size variant
        const sizeVariant = product.sizes.find(s => s.size === selectedSize);
        if (!sizeVariant) {
            alert('Selected size not available');
            return;
        }

        if (sizeVariant.stock < 1) {
            alert(`Size ${selectedSize} is out of stock`);
            return;
        }

        addToCart({
            _id: product._id,
            title: product.title,
            price: sizeVariant.price, // Use size-specific price
            image: product.images[0],
            size: selectedSize,
            color: product.colors[0]?.name || 'Default',
            quantity: 1,
        });

        // Reset selection after adding
        setSelectedSize('');
    };

    const discountPercent = product.compareAtPrice && minPrice
        ? Math.round(((product.compareAtPrice - minPrice) / product.compareAtPrice) * 100)
        : 0;

    return (
        <Link href={`/products/${product.slug}`}>
            <div className="group cursor-pointer">
                {/* Image */}
                <div className="relative aspect-[3/4] bg-secondary rounded-lg overflow-hidden mb-3">
                    <Image
                        src={product.images[0] || '/placeholder-dress.jpg'}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {discountPercent > 0 && (
                        <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
                            {discountPercent}% OFF
                        </div>
                    )}

                    {totalStock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white font-semibold">Out of Stock</span>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                        <WishlistButton product={product} />
                        <ShareButton product={product} />
                    </div>
                </div>

                {/* Product Info */}
                <div className="space-y-1">
                    <h3 className="font-medium text-foreground line-clamp-2 text-sm md:text-base">
                        {product.title}
                    </h3>

                    <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">
                            {minPrice === maxPrice
                                ? `₹${minPrice.toLocaleString()}`
                                : `₹${minPrice.toLocaleString()} - ₹${maxPrice.toLocaleString()}`
                            }
                        </span>
                        {product.compareAtPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                                ₹{product.compareAtPrice.toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* Size availability hint */}
                    {product.sizes && product.sizes.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                            {product.sizes.map(s => s.size).join(', ')} available
                        </p>
                    )}

                    {/* Quick Size Selector & Add to Cart */}
                    {totalStock > 0 && (
                        <div className="mt-3 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.preventDefault()}>
                            {/* Size Buttons */}
                            <div className="flex flex-wrap gap-1.5">
                                {product.sizes.map((sizeVariant) => (
                                    <button
                                        key={sizeVariant.size}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setSelectedSize(sizeVariant.size);
                                        }}
                                        disabled={sizeVariant.stock === 0}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${selectedSize === sizeVariant.size
                                            ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-1'
                                            : sizeVariant.stock === 0
                                                ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                                                : 'bg-secondary text-foreground hover:bg-muted border border-border'
                                            }`}
                                    >
                                        {sizeVariant.size}
                                    </button>
                                ))}
                            </div>

                            {/* Add to Cart Button */}
                            <Button
                                size="sm"
                                className="w-full bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 font-bold"
                                onClick={handleQuickAdd}
                                disabled={!selectedSize}
                            >
                                {selectedSize ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="9" cy="21" r="1" />
                                            <circle cx="20" cy="21" r="1" />
                                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                        </svg>
                                        Add to Cart - ₹{product.sizes.find(s => s.size === selectedSize)?.price.toLocaleString()}
                                    </span>
                                ) : (
                                    'Select Size First'
                                )}
                            </Button>
                        </div>
                    )}

                    {totalStock === 0 && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="w-full mt-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-not-allowed"
                            disabled
                        >
                            Out of Stock
                        </Button>
                    )}
                </div>
            </div>
        </Link>
    );
}
