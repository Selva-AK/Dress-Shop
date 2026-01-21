'use client';

import { useCart } from '@/components/providers/CartProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { ShoppingCart, Truck, CreditCard, CheckCircle, Ruler, Palette, FileText, Trash2, RotateCcw, Lock, Clock, ShoppingBag } from 'lucide-react';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const { user, loading } = useAuth();
    const router = useRouter();

    const handleCheckout = () => {
        if (loading) return;

        if (!user) {
            router.push(`/login?redirect=${encodeURIComponent('/checkout')}`);
        } else {
            router.push('/checkout');
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-12 text-center">
                            <div className="mb-8 relative">
                                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-16 h-16 text-slate-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                        />
                                    </svg>
                                </div>
                                <div className="absolute top-0 right-1/2 translate-x-16 w-24 h-24 bg-blue-100 rounded-full opacity-50 blur-2xl"></div>
                            </div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
                                Your cart is empty
                            </h1>
                            <p className="text-slate-600 mb-8 text-lg">
                                Discover amazing products and start shopping today!
                            </p>
                            <Link href="/products">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 border-0 shadow-lg hover:shadow-xl transition-all px-8"
                                >
                                    <ShoppingBag className="w-5 h-5 inline mr-2" /> Browse Products
                                </Button>
                            </Link>

                            <div className="mt-12 grid grid-cols-3 gap-6">
                                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
                                    <Truck className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                                    <div className="text-sm font-semibold text-slate-700">Free Shipping</div>
                                </div>
                                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                                    <div className="text-sm font-semibold text-slate-700">COD Available</div>
                                </div>
                                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
                                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                                    <div className="text-sm font-semibold text-slate-700">Easy Returns</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="container mx-auto px-4 py-8 md:py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2 flex items-center gap-2">
                        <ShoppingCart className="w-10 h-10" /> Shopping Cart
                    </h1>
                    <p className="text-slate-600">
                        {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => (
                            <div
                                key={`${item._id}-${item.size}-${item.color}`}
                                className="group bg-white rounded-2xl p-5 flex gap-5 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                                {/* Product Image */}
                                <div className="relative w-28 h-36 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                                    <Image
                                        src={item.image || '/placeholder-dress.jpg'}
                                        alt={item.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 min-w-0 flex flex-col">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2">
                                            {item.title}
                                        </h3>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                                <Ruler className="w-3 h-3" /> {item.size}
                                            </span>
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                                                <Palette className="w-3 h-3" /> {item.color}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-end justify-between">
                                        <div>
                                            <div className="text-2xl font-bold text-blue-600">
                                                ₹{item.price.toLocaleString()}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                Subtotal: ₹{(item.price * item.quantity).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col items-end justify-between">
                                    <button
                                        onClick={() => removeFromCart(item._id, item.size, item.color)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                        aria-label="Remove item"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </button>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-1 border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                                        <button
                                            onClick={() => updateQuantity(item._id, item.size, item.color, item.quantity - 1)}
                                            className="px-4 py-2 hover:bg-slate-200 transition-colors font-bold text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={item.quantity <= 1}
                                        >
                                            −
                                        </button>
                                        <span className="px-4 py-2 font-bold text-slate-900 bg-white border-x-2 border-slate-200 min-w-[3rem] text-center">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item._id, item.size, item.color, item.quantity + 1)}
                                            className="px-4 py-2 hover:bg-slate-200 transition-colors font-bold text-slate-700"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-20">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-slate-200">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <FileText className="w-5 h-5" /> Order Summary
                                </h2>
                            </div>

                            <div className="p-6">
                                {/* Summary Details */}
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                                        <span className="text-slate-600 font-medium">Subtotal</span>
                                        <span className="font-bold text-slate-900">₹{cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                                        <span className="text-slate-600 font-medium">Items</span>
                                        <span className="font-bold text-slate-900">{totalItems}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl border border-green-200">
                                        <span className="text-green-700 font-medium">Shipping</span>
                                        <span className="text-green-700 font-bold flex items-center gap-1">
                                            <CheckCircle className="w-4 h-4" /> FREE
                                        </span>
                                    </div>

                                    {/* Total */}
                                    <div className="border-t-2 border-slate-200 pt-4 flex justify-between items-center">
                                        <span className="text-lg font-bold text-slate-900">Total</span>
                                        <span className="text-3xl font-bold text-blue-600">₹{cartTotal.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <Button
                                    className="w-full mb-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 border-0 shadow-lg hover:shadow-xl transition-all"
                                    size="lg"
                                    onClick={handleCheckout}
                                    disabled={loading}
                                    loading={loading}
                                >
                                    {loading ? (
                                        <><Clock className="w-5 h-5 inline mr-2" /> Checking...</>
                                    ) : (
                                        <><Lock className="w-5 h-5 inline mr-2" /> Proceed to Checkout</>
                                    )}
                                </Button>

                                {/* Clear Cart Button */}
                                <button
                                    onClick={clearCart}
                                    className="w-full py-3 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <Trash2 className="w-4 h-4 inline mr-2" /> Clear Cart
                                </button>

                                {/* Additional Info */}
                                <div className="mt-6 space-y-3">
                                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="w-6 h-6 text-green-700" />
                                            <div>
                                                <div className="font-bold text-green-900 text-sm">Cash on Delivery</div>
                                                <div className="text-xs text-green-700">Available for all orders</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                                        <div className="flex items-center gap-2">
                                            <Truck className="w-6 h-6 text-blue-700" />
                                            <div>
                                                <div className="font-bold text-blue-900 text-sm">Free Shipping</div>
                                                <div className="text-xs text-blue-700">On all orders</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                                        <div className="flex items-center gap-2">
                                            <RotateCcw className="w-6 h-6 text-purple-700" />
                                            <div>
                                                <div className="font-bold text-purple-900 text-sm">Easy Returns</div>
                                                <div className="text-xs text-purple-700">7-day return policy</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Continue Shopping */}
                                <div className="mt-6 pt-6 border-t border-slate-200">
                                    <Link href="/products">
                                        <button className="w-full py-3 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all flex items-center justify-center gap-2">
                                            <span>←</span> Continue Shopping
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}