'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/providers/CartProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Image from 'next/image';
import { ShoppingCart, ShoppingBag, Lock, Check, MapPin, User, Phone, Home, Building2, MapPinned, Map, Mailbox, Clock, CreditCard, FileText, AlertTriangle } from 'lucide-react';

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    products: cart,
                    shippingAddress: formData,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to place order');
            }

            // Show order placed notification
            if (typeof window !== 'undefined') {
                import('@/lib/notifications').then(({ notifyOrderPlaced }) => {
                    notifyOrderPlaced(data.order.orderNumber, data.order.totalAmount);
                });
            }

            clearCart();
            router.push(`/orders?success=true&orderId=${data.order._id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-12 text-center">
                            <div className="mb-8">
                                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                                    <ShoppingCart className="w-16 h-16 text-slate-400" />
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
                                Your cart is empty
                            </h1>
                            <p className="text-slate-600 mb-8 text-lg">
                                Add some products to proceed with checkout
                            </p>
                            <Button
                                onClick={() => router.push('/products')}
                                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 border-0 shadow-lg hover:shadow-xl transition-all px-8"
                                size="lg"
                            >
                                <ShoppingBag className="w-5 h-5 inline mr-2" /> Continue Shopping
                            </Button>
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
                {/* Header with Progress */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                        <Lock className="w-10 h-10" /> Secure Checkout
                    </h1>

                    {/* Progress Steps */}
                    <div className="flex items-center gap-2 max-w-md">
                        <div className="flex items-center gap-2 flex-1">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold shadow-lg">
                                <Check className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-semibold text-slate-700">Cart</span>
                        </div>
                        <div className="h-1 flex-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
                        <div className="flex items-center gap-2 flex-1">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg">
                                2
                            </div>
                            <span className="text-sm font-semibold text-slate-900">Checkout</span>
                        </div>
                        <div className="h-1 flex-1 bg-slate-200 rounded-full"></div>
                        <div className="flex items-center gap-2 flex-1">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                                3
                            </div>
                            <span className="text-sm font-medium text-slate-500">Complete</span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Shipping Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Address Form */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-slate-200">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <MapPin className="w-5 h-5" /> Shipping Address
                                </h2>
                            </div>

                            <div className="p-6">
                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                                        <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <div className="font-bold text-red-900 mb-1">Error</div>
                                            <div className="text-sm text-red-700">{error}</div>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name and Phone */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                <User className="w-4 h-4" /> Full Name
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                required
                                                placeholder="Enter your full name"
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                <Phone className="w-4 h-4" /> Phone Number
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                placeholder="Enter your phone number"
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Address Line 1 */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                            <Home className="w-4 h-4" /> Address Line 1
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="addressLine1"
                                            value={formData.addressLine1}
                                            onChange={handleChange}
                                            required
                                            placeholder="House no., Building name, Street"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    {/* Address Line 2 */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                            <Building2 className="w-4 h-4" /> Address Line 2
                                            <span className="text-slate-400 text-xs">(Optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="addressLine2"
                                            value={formData.addressLine2}
                                            onChange={handleChange}
                                            placeholder="Landmark, Area"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    {/* City, State, Pincode */}
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                <MapPinned className="w-4 h-4" /> City
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                required
                                                placeholder="City"
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                <Map className="w-4 h-4" /> State
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                required
                                                placeholder="State"
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                <Mailbox className="w-4 h-4" /> Pincode
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={formData.pincode}
                                                onChange={handleChange}
                                                required
                                                placeholder="PIN"
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-4">
                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border-0 shadow-lg hover:shadow-xl transition-all"
                                            size="lg"
                                            loading={loading}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <span className="flex items-center gap-2">
                                                    <Clock className="w-5 h-5 animate-spin" /> Processing...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    <Check className="w-5 h-5" /> Place Order (Cash on Delivery)
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-20">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-slate-200">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <FileText className="w-5 h-5" /> Order Summary
                                </h2>
                            </div>

                            <div className="p-6">
                                {/* Cart Items Preview */}
                                <div className="mb-6 space-y-3 max-h-64 overflow-y-auto">
                                    {cart.map((item) => (
                                        <div
                                            key={`${item._id}-${item.size}-${item.color}`}
                                            className="flex gap-3 p-3 bg-slate-50 rounded-xl"
                                        >
                                            <div className="relative w-16 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={item.image || '/placeholder-dress.jpg'}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-slate-900 text-sm line-clamp-1 mb-1">
                                                    {item.title}
                                                </div>
                                                <div className="text-xs text-slate-600 mb-1">
                                                    {item.size} • {item.color}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-slate-500">Qty: {item.quantity}</span>
                                                    <span className="font-bold text-slate-900 text-sm">
                                                        ₹{(item.price * item.quantity).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary Details */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                                        <span className="text-slate-600 font-medium">Subtotal ({totalItems} items)</span>
                                        <span className="font-bold text-slate-900">₹{cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl border border-green-200">
                                        <span className="text-green-700 font-medium">Shipping</span>
                                        <span className="text-green-700 font-bold flex items-center gap-1">
                                            <Check className="w-4 h-4" /> FREE
                                        </span>
                                    </div>

                                    {/* Total */}
                                    <div className="border-t-2 border-slate-200 pt-3 flex justify-between items-center">
                                        <span className="text-lg font-bold text-slate-900">Total</span>
                                        <span className="text-3xl font-bold text-green-600">₹{cartTotal.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                                    <div className="flex items-start gap-3">
                                        <CreditCard className="w-6 h-6 text-green-700 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-bold text-green-900 mb-1">
                                                Cash on Delivery
                                            </p>
                                            <p className="text-xs text-green-700 leading-relaxed">
                                                Pay with cash when your order arrives at your doorstep
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Security Badge */}
                                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                    <div className="flex items-center gap-2 justify-center">
                                        <Lock className="w-5 h-5 text-blue-700" />
                                        <span className="text-sm font-semibold text-blue-900">Secure Checkout</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}