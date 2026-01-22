'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/providers/CartProvider';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import ProductCard from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Loader';
import WishlistButton from '@/components/wishlist/WishlistButton';
import ShareButton from '@/components/ui/ShareButton';
import { Truck, RotateCcw, Check, Ruler, Palette, Hash, Flame, Sparkles, Lock, ShoppingCart, Zap } from 'lucide-react';

export default function ProductDetailPage({ params }) {
    const { slug } = use(params);
    const router = useRouter();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                // Fetch product details
                const res = await fetch(`/api/products/${slug}`);

                if (!res.ok) {
                    if (res.status === 404) {
                        router.push('/products');
                        return;
                    }
                    throw new Error('Failed to fetch product');
                }

                const data = await res.json();
                const productData = data.product;
                setProduct(productData);

                // Set defaults - sizes are now objects with size, price, stock
                if (productData.sizes?.length > 0) setSelectedSize(productData.sizes[0].size);
                if (productData.colors?.length > 0) setSelectedColor(productData.colors[0].name);

                // Fetch related products
                if (productData.category) {
                    const relatedRes = await fetch(`/api/products?category=${productData.category}&limit=5`);
                    if (relatedRes.ok) {
                        const relatedData = await relatedRes.json();
                        // Filter out current product
                        const filtered = relatedData.products.filter(p => p._id !== productData._id).slice(0, 4);
                        setRelatedProducts(filtered);
                    }
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchProductData();
        }
    }, [slug, router]);

    const handleAddToCart = () => {
        if (!product) return;

        // Validate size selection
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }

        // Get the selected size variant
        const sizeVariant = product.sizes.find(s => s.size === selectedSize);
        if (!sizeVariant) {
            alert('Selected size is not available');
            return;
        }

        // Check stock
        if (sizeVariant.stock < quantity) {
            alert(`Only ${sizeVariant.stock} items available in size ${selectedSize}`);
            return;
        }

        addToCart({
            _id: product._id,
            title: product.title,
            price: sizeVariant.price, // Use size-specific price
            image: product.images[0],
            size: selectedSize,
            color: selectedColor,
            quantity: quantity,
        });

        // Reset quantity to 1 after adding to cart
        setQuantity(1);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
                <div className="container mx-auto px-4 py-6 md:py-12 max-w-7xl">
                    {/* Breadcrumb Skeleton */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className="h-4 w-12 bg-muted animate-pulse rounded"></div>
                        <span className="text-border">/</span>
                        <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                        <span className="text-border">/</span>
                        <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-20">
                        {/* Image Gallery Skeleton */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="relative aspect-[3/4] bg-gradient-to-br from-muted to-muted/50 rounded-3xl animate-pulse shadow-2xl">
                                <div className="absolute top-6 right-6 flex flex-col gap-3">
                                    <div className="w-10 h-10 bg-muted-foreground/20 rounded-full"></div>
                                    <div className="w-10 h-10 bg-muted-foreground/20 rounded-full"></div>
                                </div>
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-3">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="w-20 h-24 bg-muted animate-pulse rounded-xl"></div>
                                ))}
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-3 mt-6">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-xl p-3 shadow-md">
                                        <div className="h-8 w-8 bg-muted animate-pulse rounded-full mx-auto mb-1"></div>
                                        <div className="h-3 bg-muted animate-pulse rounded w-3/4 mx-auto"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Product Info Skeleton */}
                        <div className="space-y-8">
                            {/* Title Section */}
                            <div className="space-y-4">
                                <div className="h-12 bg-muted animate-pulse rounded-lg w-full"></div>
                                <div className="h-12 bg-muted animate-pulse rounded-lg w-3/4"></div>

                                {/* Price */}
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-40 bg-muted animate-pulse rounded-lg"></div>
                                    <div className="h-8 w-32 bg-muted animate-pulse rounded-full"></div>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-3">
                                    <div className="h-5 w-32 bg-muted animate-pulse rounded"></div>
                                    <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2 bg-secondary/30 p-4 rounded-xl">
                                    <div className="h-4 bg-muted animate-pulse rounded w-full"></div>
                                    <div className="h-4 bg-muted animate-pulse rounded w-5/6"></div>
                                    <div className="h-4 bg-muted animate-pulse rounded w-4/6"></div>
                                </div>
                            </div>

                            {/* Options Card Skeleton */}
                            <div className="bg-gradient-to-br from-white via-white to-secondary/20 rounded-3xl p-6 md:p-8 shadow-2xl space-y-8">
                                {/* Size Options */}
                                <div>
                                    <div className="h-5 w-32 bg-muted animate-pulse rounded mb-4"></div>
                                    <div className="flex gap-3">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="h-12 w-16 bg-muted animate-pulse rounded-xl"></div>
                                        ))}
                                    </div>
                                </div>

                                {/* Color Options */}
                                <div>
                                    <div className="h-5 w-32 bg-muted animate-pulse rounded mb-4"></div>
                                    <div className="flex gap-3">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="h-12 w-20 bg-muted animate-pulse rounded-xl"></div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quantity */}
                                <div>
                                    <div className="h-5 w-24 bg-muted animate-pulse rounded mb-4"></div>
                                    <div className="h-14 w-48 bg-muted animate-pulse rounded-xl"></div>
                                </div>

                                {/* Add to Cart Button */}
                                <div className="space-y-4 pt-4">
                                    <div className="h-16 w-full bg-gradient-to-r from-muted to-muted/80 animate-pulse rounded-xl"></div>
                                    <div className="h-12 w-full bg-muted/50 animate-pulse rounded-xl"></div>
                                </div>

                                {/* Features */}
                                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="h-4 bg-muted animate-pulse rounded"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Products Skeleton */}
                    <div className="border-t-2 border-border pt-16 mt-16">
                        <div className="text-center mb-12">
                            <div className="h-12 w-64 bg-muted animate-pulse rounded-lg mx-auto mb-4"></div>
                            <div className="h-6 w-48 bg-muted animate-pulse rounded mx-auto"></div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="aspect-[3/4] bg-muted animate-pulse rounded-xl"></div>
                                    <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                                    <div className="h-6 bg-muted animate-pulse rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) return null;

    // Get selected size variant for price and stock
    const selectedSizeVariant = product.sizes?.find(s => s.size === selectedSize);
    const currentPrice = selectedSizeVariant?.price || product.minPrice || 0;
    const currentStock = selectedSizeVariant?.stock || 0;

    const discountPercent = product.compareAtPrice && currentPrice
        ? Math.round(((product.compareAtPrice - currentPrice) / product.compareAtPrice) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
            <div className="container mx-auto px-4 py-6 md:py-12 max-w-7xl">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <span className="text-border">/</span>
                    <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
                    <span className="text-border">/</span>
                    <span className="text-foreground font-medium">{product.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-20">
                    {/* Image Gallery */}
                    <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
                        {/* Main Image */}
                        <div className="relative aspect-[3/4] bg-slate-100 rounded-lg overflow-hidden group">
                            <Image
                                src={product.images[activeImage] || '/placeholder-dress.jpg'}
                                alt={product.title}
                                fill
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                priority
                            />

                            {/* Floating Actions */}
                            <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                                <WishlistButton product={product} />
                                <ShareButton product={product} />
                            </div>

                            {/* Tags */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {discountPercent > 0 && (
                                    <div className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 uppercase tracking-wider">
                                        -{discountPercent}%
                                    </div>
                                )}
                                {product.isNew && (
                                    <div className="bg-white text-slate-900 text-xs font-bold px-3 py-1.5 uppercase tracking-wider">
                                        New In
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {product.images.length > 1 && (
                            <div className="grid grid-cols-5 gap-3">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImage(index)}
                                        className={`relative aspect-[3/4] rounded-md overflow-hidden transition-all duration-300 ${activeImage === index
                                                ? 'ring-2 ring-slate-900 ring-offset-2 opacity-100'
                                                : 'opacity-60 hover:opacity-100 hover:ring-1 hover:ring-slate-300'
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.title} view ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-10 lg:pl-8">
                        {/* Hero Title Section */}
                        <div className="border-b border-border/40 pb-8">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
                                {product.title}
                            </h1>

                            <div className="flex items-center gap-6 mb-6">
                                <span className="text-4xl text-slate-900 font-bold">
                                    ₹{currentPrice.toLocaleString()}
                                </span>
                                {product.compareAtPrice && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl text-slate-400 line-through font-medium">
                                            ₹{product.compareAtPrice.toLocaleString()}
                                        </span>
                                        <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                            {discountPercent}% OFF
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Rating & Reviews */}
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-slate-600 font-medium border-b border-slate-300 pb-0.5 cursor-pointer hover:text-slate-900 transition-colors">
                                    127 Reviews
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="prose prose-slate text-slate-600 leading-relaxed">
                            <p className="text-lg">{product.description}</p>
                        </div>

                        {/* Options */}
                        <div className="space-y-8 pt-4">
                            {/* Sizes */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                                            Select Size
                                        </label>
                                        <button className="text-sm text-slate-500 underline hover:text-slate-900">
                                            Size Guide
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {product.sizes.map((sizeVariant) => (
                                            <button
                                                key={sizeVariant.size}
                                                onClick={() => setSelectedSize(sizeVariant.size)}
                                                disabled={sizeVariant.stock === 0}
                                                className={`
                                                    min-w-[60px] h-12 flex items-center justify-center rounded-lg text-sm font-bold transition-all duration-200 border
                                                    ${selectedSize === sizeVariant.size
                                                        ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-105'
                                                        : sizeVariant.stock === 0
                                                            ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed decoration-slate-300 line-through'
                                                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                                                    }
                                                `}
                                            >
                                                {sizeVariant.size}
                                            </button>
                                        ))}
                                    </div>
                                    {selectedSizeVariant && (
                                        <div className="mt-2 text-xs font-medium">
                                            {selectedSizeVariant.stock > 0 && selectedSizeVariant.stock < 10 ? (
                                                <span className="text-amber-600 flex items-center gap-1">
                                                    <Zap className="w-3 h-3" /> Only {selectedSizeVariant.stock} left
                                                </span>
                                            ) : selectedSizeVariant.stock === 0 ? (
                                                <span className="text-red-500">Out of Stock</span>
                                            ) : null}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Colors */}
                            {product.colors && product.colors.length > 0 && (
                                <div>
                                    <label className="block text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                                        Color: <span className="text-slate-600 font-normal normal-case">{selectedColor}</span>
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        {product.colors.map((color) => (
                                            <button
                                                key={color.name}
                                                onClick={() => setSelectedColor(color.name)}
                                                className={`
                                                    relative px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200
                                                    ${selectedColor === color.name
                                                        ? 'border-slate-900 bg-slate-50 text-slate-900 ring-1 ring-slate-900'
                                                        : 'border-slate-200 text-slate-600 hover:border-slate-400'
                                                    }
                                                `}
                                            >
                                                {color.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border/40">
                                {/* Quantity - Cleaner Look */}
                                <div className="flex items-center border border-slate-200 rounded-xl h-14 bg-white shadow-sm">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 text-lg"
                                    >
                                        −
                                    </button>
                                    <span className="w-12 text-center font-bold text-slate-900 text-lg">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-12 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 text-lg"
                                    >
                                        +
                                    </button>
                                </div>

                                <Button
                                    size="lg"
                                    className="flex-1 h-14 text-base font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xl hover:shadow-2xl hover:shadow-slate-900/20 transition-all duration-300 transform hover:-translate-y-0.5"
                                    onClick={handleAddToCart}
                                    disabled={!selectedSize || currentStock === 0}
                                >
                                    {!selectedSize ? (
                                        'Select Size'
                                    ) : currentStock === 0 ? (
                                        'Out of Stock'
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <ShoppingCart className="w-5 h-5" />
                                            Add to Bag
                                        </span>
                                    )}
                                </Button>
                            </div>

                            {/* Features Benefits */}
                            <div className="grid grid-cols-2 gap-y-4 gap-x-8 pt-8">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-slate-100 rounded-full text-slate-900">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900">Free Shipping</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">On all orders above ₹999</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-slate-100 rounded-full text-slate-900">
                                        <RotateCcw className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900">Easy Returns</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">7-day return policy</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-slate-100 rounded-full text-slate-900">
                                        <Check className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900">Authentic</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">100% genuine products</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-slate-100 rounded-full text-slate-900">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900">Secure Payment</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">SSL Encrypted checkout</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="border-t-2 border-border pt-16 mt-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">You May Also Like</h2>
                            <p className="text-muted-foreground text-lg">Discover more amazing products</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard key={relatedProduct._id} product={relatedProduct} />
                            ))}
                        </div>
                        <div className="text-center mt-10">
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-3 text-lg font-bold text-primary hover:text-primary/80 transition-colors group bg-primary/5 px-8 py-4 rounded-full hover:bg-primary/10"
                            >
                                View All Products
                                <span className="group-hover:translate-x-2 transition-transform text-2xl">→</span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
