'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../providers/CartProvider';
import Button from '../ui/Button';
import WishlistButton from '../wishlist/WishlistButton';
import ShareButton from '../ui/ShareButton';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

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

        addToCart({
            _id: product._id,
            title: product.title,
            price: product.price,
            image: product.images[0],
            size: product.sizes[0] || 'M',
            color: product.colors[0]?.name || 'Default',
            quantity: 1,
        });
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
                </div>
            </div>
        </Link>
    );
}
