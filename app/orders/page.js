'use client';

import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, Truck, X, FileText, Calendar, Ruler, Palette, Hash, MapPin, Phone, CreditCard, ShoppingBag, ChevronDown, Sparkles } from 'lucide-react';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const success = searchParams?.get('success');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();

            if (data.orders && data.orders.length > 0) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-amber-400',
            confirmed: 'bg-blue-500',
            shipped: 'bg-purple-500',
            delivered: 'bg-green-500',
            cancelled: 'bg-red-500',
        };
        return colors[status] || 'bg-slate-500';
    };

    const getStatusBg = (status) => {
        const colors = {
            pending: 'from-amber-50 via-orange-50 to-yellow-50 border-amber-300 text-amber-700',
            confirmed: 'from-blue-50 via-cyan-50 to-sky-50 border-blue-300 text-blue-700',
            shipped: 'from-purple-50 via-fuchsia-50 to-pink-50 border-purple-300 text-purple-700',
            delivered: 'from-green-50 via-emerald-50 to-teal-50 border-green-300 text-green-700',
            cancelled: 'from-red-50 via-rose-50 to-pink-50 border-red-300 text-red-700',
        };
        return colors[status] || 'from-slate-50 to-slate-100 border-slate-300 text-slate-700';
    };

    const getStatusIcon = (status) => {
        const IconMap = {
            pending: Clock,
            confirmed: CheckCircle,
            shipped: Truck,
            delivered: Package,
            cancelled: X,
        };
        return IconMap[status] || FileText;
    };

    const filteredOrders = filterStatus === 'all'
        ? orders
        : orders.filter(order => order.status === filterStatus);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <Package className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl mb-3 shadow-2xl shadow-blue-500/50 transform hover:scale-110 transition-transform duration-300">
                        <Package className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 tracking-tight">
                        My Orders
                    </h1>
                    <p className="text-slate-600 text-base flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        Track and manage all your purchases
                    </p>
                </div>

                {/* Success Message */}
                {success === 'true' && (
                    <div className="mb-6 max-w-2xl mx-auto animate-[slideDown_0.6s_ease-out]">
                        <div className="p-4 bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 border-2 border-green-400 rounded-2xl shadow-xl shadow-green-200/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-black text-green-900 text-base">Order Placed Successfully!</p>
                                    <p className="text-xs text-green-700 mt-0.5">Your order has been confirmed and will be processed soon.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filter Bar */}
                {orders.length > 0 && (
                    <div className="mb-6 max-w-4xl mx-auto">
                        <div className="bg-white/80 backdrop-blur-xl border-2 border-indigo-200 rounded-2xl p-3 shadow-xl shadow-indigo-100/50">
                            <div className="flex flex-wrap gap-2 justify-center">
                                {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-4 py-2 rounded-xl font-bold text-xs transition-all duration-300 ${filterStatus === status
                                            ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-300/50 scale-105'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-105'
                                            }`}
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Orders List */}
                {filteredOrders.length > 0 ? (
                    <div className="max-w-5xl mx-auto space-y-4">
                        {filteredOrders.map((order) => {
                            const StatusIcon = getStatusIcon(order.status);
                            const isExpanded = expandedOrder === order._id;

                            return (
                                <div
                                    key={order._id}
                                    className="group bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-indigo-200 shadow-xl shadow-indigo-100/50 hover:shadow-2xl hover:shadow-indigo-200/50 transition-all duration-500 overflow-hidden hover:scale-[1.02]"
                                >
                                    {/* Order Header - Clickable */}
                                    <div
                                        className="p-4 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-colors"
                                        onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-12 h-12 rounded-xl ${getStatusColor(order.status)} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
                                                    <StatusIcon className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-indigo-400 mb-0.5 uppercase tracking-wide">
                                                        Order Number
                                                    </p>
                                                    <p className="text-base font-black text-slate-900">
                                                        #{order.orderNumber}
                                                    </p>
                                                    <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-500 mb-0.5 font-semibold">Total Amount</p>
                                                    <p className="text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                        ₹{order.totalAmount.toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 font-black text-xs bg-gradient-to-r ${getStatusBg(order.status)} shadow-lg`}>
                                                    <div className={`w-2 h-2 rounded-full ${getStatusColor(order.status)} animate-pulse`}></div>
                                                    <span>{order.status.toUpperCase()}</span>
                                                </div>
                                                <ChevronDown className={`w-5 h-5 text-slate-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expandable Content */}
                                    <div className={`transition-all duration-500 ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                        <div className="px-4 pb-4 space-y-4 border-t-2 border-indigo-100 pt-4">
                                            {/* Order Items */}
                                            <div className="space-y-2">
                                                <p className="text-xs font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                                                    <ShoppingBag className="w-3.5 h-3.5" /> Order Items
                                                </p>
                                                {order.products.map((item, idx) => (
                                                    <div key={idx} className="flex gap-3 p-3 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200 hover:border-indigo-400 transition-all group/item hover:shadow-lg">
                                                        <div className="flex-1">
                                                            <p className="font-black text-slate-900 mb-2 text-sm group-hover/item:text-indigo-600 transition-colors">
                                                                {item.title}
                                                            </p>
                                                            <div className="flex flex-wrap gap-1.5">
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-300 shadow-sm">
                                                                    <Ruler className="w-3 h-3" /> {item.size}
                                                                </span>
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-300 shadow-sm">
                                                                    <Palette className="w-3 h-3" /> {item.color}
                                                                </span>
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border border-slate-300 shadow-sm">
                                                                    <Hash className="w-3 h-3" /> Qty: {item.quantity}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-lg font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                                ₹{(item.price * item.quantity).toLocaleString()}
                                                            </p>
                                                            <p className="text-[10px] text-slate-500 mt-0.5 font-semibold">₹{item.price} each</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Payment Info */}
                                            <div className="p-3 bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 rounded-xl border-2 border-green-300 shadow-md">
                                                <p className="text-xs text-green-700 mb-1 flex items-center gap-1.5 font-bold">
                                                    <CreditCard className="w-4 h-4" /> Payment Method
                                                </p>
                                                <p className="font-black text-green-900 text-sm">
                                                    Cash on Delivery
                                                </p>
                                            </div>

                                            {/* Shipping Address */}
                                            {order.shippingAddress && (
                                                <div className="p-3 bg-gradient-to-r from-purple-100 via-fuchsia-100 to-pink-100 rounded-xl border-2 border-purple-300 shadow-md">
                                                    <p className="font-black text-purple-900 mb-2 flex items-center gap-1.5 text-sm">
                                                        <MapPin className="w-4 h-4" /> Shipping Address
                                                    </p>
                                                    <div className="text-xs text-purple-900 leading-relaxed space-y-0.5">
                                                        <p className="font-black text-sm">{order.shippingAddress.fullName}</p>
                                                        <p>{order.shippingAddress.addressLine1}</p>
                                                        {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                                                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                                                        <p className="mt-1.5 flex items-center gap-1 font-bold">
                                                            <Phone className="w-3 h-3" /> {order.shippingAddress.phone}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl shadow-indigo-200/50 border-2 border-indigo-200 p-8 text-center">
                            <div className="mb-6 relative">
                                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform">
                                    <Package className="w-12 h-12 text-indigo-500" />
                                </div>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-indigo-200/40 rounded-full blur-3xl -z-10 animate-pulse"></div>
                            </div>
                            <h1 className="text-2xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                                No orders yet
                            </h1>
                            <p className="text-slate-600 mb-6 text-sm">
                                Start shopping to place your first order!
                            </p>
                            <button className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 text-white font-black py-3 px-6 rounded-xl shadow-lg shadow-indigo-300/50 hover:shadow-indigo-400/50 transition-all hover:scale-105">
                                <ShoppingBag className="w-4 h-4 inline mr-2" /> Browse Products
                            </button>

                            <div className="mt-8 grid grid-cols-3 gap-3">
                                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl border-2 border-blue-200 shadow-md hover:shadow-xl transition-shadow">
                                    <Truck className="w-6 h-6 mx-auto mb-1.5 text-blue-600" />
                                    <div className="text-xs font-bold text-slate-700">Free Shipping</div>
                                </div>
                                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl border-2 border-purple-200 shadow-md hover:shadow-xl transition-shadow">
                                    <CreditCard className="w-6 h-6 mx-auto mb-1.5 text-purple-600" />
                                    <div className="text-xs font-bold text-slate-700">COD Available</div>
                                </div>
                                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border-2 border-green-200 shadow-md hover:shadow-xl transition-shadow">
                                    <CheckCircle className="w-6 h-6 mx-auto mb-1.5 text-green-600" />
                                    <div className="text-xs font-bold text-slate-700">Easy Returns</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}