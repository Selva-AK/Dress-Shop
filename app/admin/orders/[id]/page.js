'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Loader from '@/components/ui/Loader';

export default function OrderDetailsPage({ params }) {
    const { id } = use(params);
    const { user, loading } = useAuth();
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            router.push('/login');
            return;
        }

        if (user && user.role === 'admin') {
            fetchOrder();
        }
    }, [user, loading, id]);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/orders/${id}`);
            if (res.ok) {
                const data = await res.json();
                setOrder(data.order);
                setStatus(data.order.status);
            } else {
                alert('Order not found');
                router.push('/admin/orders');
            }
        } catch (error) {
            console.error('Failed to fetch order:', error);
            router.push('/admin/orders');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            if (res.ok) {
                const data = await res.json();
                setOrder(data.order);
                alert('Status updated successfully');
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Something went wrong');
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'pending':
                return {
                    color: 'bg-amber-100 text-amber-700 border-amber-300',
                    icon: '⏳',
                    gradient: 'from-amber-500 to-orange-500',
                    label: 'Pending'
                };
            case 'processing':
                return {
                    color: 'bg-blue-100 text-blue-700 border-blue-300',
                    icon: '⚙️',
                    gradient: 'from-blue-500 to-cyan-500',
                    label: 'Processing'
                };
            case 'shipped':
                return {
                    color: 'bg-purple-100 text-purple-700 border-purple-300',
                    icon: '🚚',
                    gradient: 'from-purple-500 to-pink-500',
                    label: 'Shipped'
                };
            case 'delivered':
                return {
                    color: 'bg-green-100 text-green-700 border-green-300',
                    icon: '✅',
                    gradient: 'from-green-500 to-emerald-500',
                    label: 'Delivered'
                };
            case 'cancelled':
                return {
                    color: 'bg-red-100 text-red-700 border-red-300',
                    icon: '❌',
                    gradient: 'from-red-500 to-pink-500',
                    label: 'Cancelled'
                };
            default:
                return {
                    color: 'bg-slate-100 text-slate-700 border-slate-300',
                    icon: '📦',
                    gradient: 'from-slate-500 to-slate-600',
                    label: 'Unknown'
                };
        }
    };

    const statusOptions = [
        { value: 'pending', label: 'Pending', icon: '⏳' },
        { value: 'processing', label: 'Processing', icon: '⚙️' },
        { value: 'shipped', label: 'Shipped', icon: '🚚' },
        { value: 'delivered', label: 'Delivered', icon: '✅' },
        { value: 'cancelled', label: 'Cancelled', icon: '❌' },
    ];

    if (loading || isLoading) return <Loader.Page />;
    if (!user || user.role !== 'admin') return null;
    if (!order) return null;

    const currentStatusInfo = getStatusInfo(order.status);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header Section */}
                <div className="mb-8">
                    <Link
                        href="/admin/orders"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium mb-4 transition-colors"
                    >
                        <span>←</span> Back to Orders
                    </Link>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <h1 className="text-3xl font-bold text-slate-900">
                                        Order #{order._id.slice(-6).toUpperCase()}
                                    </h1>
                                    <span className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-bold capitalize ${currentStatusInfo.color} border-2`}>
                                        <span className="text-lg">{currentStatusInfo.icon}</span>
                                        {currentStatusInfo.label}
                                    </span>
                                </div>
                                <p className="text-slate-600 flex items-center gap-2">
                                    <span>📅</span>
                                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>

                            {/* Status Update Section */}
                            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                                <div className="relative">
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full sm:w-48 px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 1rem center',
                                            backgroundSize: '1.5em 1.5em',
                                            paddingRight: '3rem'
                                        }}
                                    >
                                        {statusOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.icon} {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <Button
                                    onClick={handleUpdateStatus}
                                    loading={isUpdating}
                                    disabled={status === order.status}
                                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 border-0 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isUpdating ? '⏳ Updating...' : '💾 Update Status'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Order Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-slate-200">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <span>🛍️</span> Order Items
                                </h2>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {order.products.map((item, index) => (
                                    <div key={index} className="p-6 hover:bg-slate-50 transition-colors">
                                        <div className="flex gap-4">
                                            {item.image ? (
                                                <div className="relative flex-shrink-0">
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="w-24 h-24 object-cover rounded-xl border-2 border-slate-200 shadow-sm"
                                                    />
                                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                                        {item.quantity}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-3xl">📦</span>
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h4>
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                                                        <span>📦</span> Qty: {item.quantity}
                                                    </span>
                                                    {item.size && (
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                                            <span>📏</span> {item.size}
                                                        </span>
                                                    )}
                                                    {item.color && (
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                                                            <span>🎨</span> {item.color}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-sm text-slate-600">Unit Price:</span>
                                                    <span className="font-bold text-slate-900">₹{item.price.toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <div className="text-sm text-slate-600 mb-1">Subtotal</div>
                                                <div className="text-2xl font-bold text-blue-600">
                                                    ₹{(item.price * item.quantity).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total Section */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-t-2 border-slate-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        <span>💰</span> Total Amount
                                    </span>
                                    <span className="text-3xl font-bold text-green-600">
                                        ₹{order.totalAmount.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Customer & Shipping */}
                    <div className="space-y-6">
                        {/* Customer Details Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-slate-200">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <span>👤</span> Customer Details
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="p-4 bg-slate-50 rounded-xl">
                                    <div className="text-sm font-medium text-slate-600 mb-1">Name</div>
                                    <div className="font-bold text-slate-900 text-lg">
                                        {order.userId?.name || 'Unknown'}
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl">
                                    <div className="text-sm font-medium text-slate-600 mb-1">Email</div>
                                    <div className="font-semibold text-slate-900 break-all">
                                        {order.userId?.email || 'Unknown'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-slate-200">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <span>📍</span> Shipping Address
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-3">
                                    <div className="font-bold text-slate-900 text-lg flex items-center gap-2 mb-4">
                                        <span>👤</span> {order.shippingAddress.fullName}
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                                        <div className="text-slate-700 leading-relaxed">
                                            <div>{order.shippingAddress.addressLine1}</div>
                                            {order.shippingAddress.addressLine2 && (
                                                <div>{order.shippingAddress.addressLine2}</div>
                                            )}
                                            <div className="font-medium mt-2">
                                                {order.shippingAddress.city}, {order.shippingAddress.state}
                                            </div>
                                            <div className="font-bold text-slate-900">
                                                PIN: {order.shippingAddress.pincode}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-xl flex items-center gap-2 border border-blue-200">
                                        <span className="text-xl">📱</span>
                                        <div>
                                            <div className="text-xs text-blue-600 font-medium">Contact Number</div>
                                            <div className="font-bold text-blue-900">{order.shippingAddress.phone}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Timeline/Status History (Optional Enhancement) */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <span>⏱️</span> Quick Stats
                                </h2>
                            </div>
                            <div className="p-6 space-y-3">
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <span className="text-slate-600 font-medium">Items Count</span>
                                    <span className="font-bold text-slate-900">{order.products.length}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <span className="text-slate-600 font-medium">Total Quantity</span>
                                    <span className="font-bold text-slate-900">
                                        {order.products.reduce((sum, item) => sum + item.quantity, 0)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                                    <span className="text-green-700 font-medium">Order Value</span>
                                    <span className="font-bold text-green-900">₹{order.totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}