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

                // Set defaults
                if (productData.sizes?.length > 0) setSelectedSize(productData.sizes[0]);
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

        addToCart({
            _id: product._id,
            title: product.title,
            price: product.price,
            image: product.images[0],
            size: selectedSize,
            color: selectedColor,
            quantity: quantity,
        });

        // Reset quantity to 1 after adding to cart
        setQuantity(1);

        // Optional: Show success feedback (you could add a toast notification here)
        // For now, we'll rely on the cart count update in the header
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

    const discountPercent = product.compareAtPrice
        ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
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
                    <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                        <div className="relative aspect-[3/4] bg-gradient-to-br from-white to-secondary/30 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-primary/10 group">
                            <Image
                                src={product.images[activeImage] || '/placeholder-dress.jpg'}
                                alt={product.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Floating Action Buttons */}
                            <div className="absolute top-6 right-6 flex flex-col gap-3 z-10">
                                <WishlistButton product={product} />
                                <ShareButton product={product} />
                            </div>

                            {/* Discount Badge */}
                            {product.compareAtPrice && (
                                <div className="absolute top-6 left-6 z-10">
                                    <div className="bg-gradient-to-r from-destructive via-destructive to-destructive/80 text-white px-4 py-2 rounded-full shadow-xl font-bold text-sm animate-pulse flex items-center gap-1">
                                        <Flame className="w-4 h-4" /> {discountPercent}% OFF
                                    </div>
                                </div>
                            )}

                            {/* New/Featured Badge */}
                            <div className="absolute bottom-6 left-6 z-10">
                                <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-2 rounded-full shadow-xl font-bold text-sm backdrop-blur-sm flex items-center gap-1">
                                    <Sparkles className="w-4 h-4" /> Premium Quality
                                </div>
                            </div>
                        </div>

                        {product.images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImage(index)}
                                        className={`relative w-20 h-24 flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300 ${activeImage === index
                                            ? 'ring-2 ring-primary ring-offset-2 ring-offset-background shadow-xl scale-110'
                                            : 'ring-1 ring-border hover:ring-primary/50 hover:scale-105 opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.title} ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-3 mt-6">
                            <div className="bg-white rounded-xl p-3 text-center shadow-md hover:shadow-lg transition-shadow">
                                <Truck className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                                <div className="text-xs font-semibold text-foreground">Free Shipping</div>
                            </div>
                            <div className="bg-white rounded-xl p-3 text-center shadow-md hover:shadow-lg transition-shadow">
                                <RotateCcw className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                                <div className="text-xs font-semibold text-foreground">Easy Returns</div>
                            </div>
                            <div className="bg-white rounded-xl p-3 text-center shadow-md hover:shadow-lg transition-shadow">
                                <Check className="w-6 h-6 mx-auto mb-1 text-green-600" />
                                <div className="text-xs font-semibold text-foreground">Authentic</div>
                            </div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-8">
                        {/* Hero Title Section */}
                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent/10 rounded-full blur-3xl"></div>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-primary mb-4 tracking-tight leading-tight relative">
                                {product.title}
                            </h1>

                            <div className="flex items-baseline gap-4 mb-6 flex-wrap">
                                <span className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-slate-500">
                                    ₹{product.price.toLocaleString()}
                                </span>
                                {product.compareAtPrice && (
                                    <>
                                        <span className="text-2xl text-muted-foreground line-through">
                                            ₹{product.compareAtPrice.toLocaleString()}
                                        </span>
                                        <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                                            Save ₹{(product.compareAtPrice - product.price).toLocaleString()}
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Rating & Reviews (Mock) */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-yellow-400 text-lg">★</span>
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground font-medium">
                                    4.8 (127 reviews)
                                </span>
                            </div>

                            <div className="prose prose-base text-muted-foreground leading-relaxed bg-secondary/30 p-4 rounded-xl border border-border/50">
                                <p>{product.description}</p>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="space-y-8 bg-gradient-to-br from-white via-white to-secondary/20 rounded-3xl p-6 md:p-8 shadow-2xl ring-1 ring-primary/5 border border-border/50">
                            {/* Sizes */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div>
                                    <label className="block text-sm font-bold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
                                        <Ruler className="w-5 h-5" /> Select Size
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`min-w-[3.5rem] px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${selectedSize === size
                                                    ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-xl scale-110 ring-2 ring-primary ring-offset-2'
                                                    : 'bg-secondary text-foreground hover:bg-muted hover:shadow-lg hover:scale-105 border border-border'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Colors */}
                            {product.colors && product.colors.length > 0 && (
                                <div>
                                    <label className="block text-sm font-bold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
                                        <Palette className="w-5 h-5" /> Select Color
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        {product.colors.map((color) => (
                                            <button
                                                key={color.name}
                                                onClick={() => setSelectedColor(color.name)}
                                                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${selectedColor === color.name
                                                    ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-xl scale-110 ring-2 ring-primary ring-offset-2'
                                                    : 'bg-secondary text-foreground hover:bg-muted hover:shadow-lg hover:scale-105 border border-border'
                                                    }`}
                                            >
                                                {color.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div>
                                <label className="block text-sm font-bold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
                                    <Hash className="w-5 h-5" /> Quantity
                                </label>
                                <div className="inline-flex items-center rounded-xl border-2 border-primary/20 bg-white shadow-lg overflow-hidden">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-14 h-14 flex items-center justify-center hover:bg-primary/10 transition-all duration-200 text-xl font-bold hover:text-primary active:scale-90"
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-20 h-14 text-center border-x-2 border-primary/20 bg-transparent focus:outline-none focus:bg-primary/5 appearance-none font-bold text-xl transition-colors"
                                    />
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-14 h-14 flex items-center justify-center hover:bg-primary/10 transition-all duration-200 text-xl font-bold hover:text-primary active:scale-90"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-4 pt-4">
                                <Button
                                    size="lg"
                                    className="w-full h-16 text-lg font-extrabold bg-gradient-to-r from-primary via-primary to-primary/80 hover:from-primary/90 hover:via-primary hover:to-primary text-primary-foreground shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 active:scale-95 rounded-xl"
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                >
                                    {product.stock === 0 ? (
                                        <><Lock className="w-5 h-5 inline mr-2" /> Out of Stock</>
                                    ) : (
                                        <><ShoppingCart className="w-5 h-5 inline mr-2" /> Add to Cart - Buy Now</>
                                    )}
                                </Button>

                                {/* Stock Indicator */}
                                {product.stock > 0 && product.stock <= 10 && (
                                    <div className="flex items-center justify-center gap-2 text-sm text-destructive bg-gradient-to-r from-destructive/10 to-destructive/5 px-4 py-3 rounded-xl border border-destructive/20">
                                        <Zap className="w-4 h-4" />
                                        <span className="font-bold">Only {product.stock} left in stock - Order now!</span>
                                    </div>
                                )}

                                {product.stock > 10 && (
                                    <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-3 rounded-xl border border-green-200">
                                        <Check className="w-4 h-4" />
                                        <span className="font-bold">In Stock - Ready to Ship</span>
                                    </div>
                                )}
                            </div>

                            {/* Features List */}
                            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="text-green-500">✓</span>
                                    <span>Premium Fabric</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="text-green-500">✓</span>
                                    <span>Perfect Fit</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="text-green-500">✓</span>
                                    <span>Cash on Delivery</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="text-green-500">✓</span>
                                    <span>7 Days Return</span>
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
