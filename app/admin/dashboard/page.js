'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Loader from '@/components/ui/Loader';
import { Package, ShoppingCart, Clock, DollarSign, Store, FileText, BarChart3, Hand } from 'lucide-react';

export default function AdminDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchStats();
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            const [productsRes, ordersRes] = await Promise.all([
                fetch('/api/products'),
                fetch('/api/orders'),
            ]);

            const productsData = await productsRes.json();
            const ordersData = await ordersRes.json();

            const pending = ordersData.orders?.filter(o => o.status === 'pending').length || 0;
            const revenue = ordersData.orders?.reduce((sum, o) => sum + o.totalAmount, 0) || 0;

            setStats({
                totalProducts: productsData.total || 0,
                totalOrders: ordersData.orders?.length || 0,
                pendingOrders: pending,
                totalRevenue: revenue,
            });

            // Set top 5 recent orders as activity
            if (ordersData.orders) {
                setRecentActivity(ordersData.orders.slice(0, 5));
            }

        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    if (loading) {
        return <Loader.Page />;
    }

    if (!user || user.role !== 'admin') {
        return null;
    }

    const statCards = [
        {
            title: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100',
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: ShoppingCart,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-100',
        },
        {
            title: 'Total Products',
            value: stats.totalProducts,
            icon: Package,
            color: 'text-violet-600',
            bg: 'bg-violet-50',
            border: 'border-violet-100',
        },
        {
            title: 'Pending Orders',
            value: stats.pendingOrders,
            icon: Clock,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-100',
        }
    ];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="min-h-screen bg-slate-50/50">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header Section */}
                <div className="mb-10">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
                                Dashboard
                            </h1>
                            <p className="text-slate-500 font-medium flex items-center gap-2">
                                Welcome back, <span className="text-slate-900">{user.name}</span> <Hand className="w-5 h-5 text-amber-400 fill-amber-400" />
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Link href="/">
                                <Button variant="outline" className="flex items-center gap-2 bg-white border-slate-200 hover:bg-slate-50 hover:text-slate-900">
                                    <Store className="w-4 h-4" /> View Store
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {statCards.map((stat, index) => (
                        <div
                            key={index}
                            className={`group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border ${stat.border}`}
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-500 mb-1">{stat.title}</p>
                                    <p className="text-3xl font-extrabold text-slate-900">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Quick Actions - 2 Columns */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                                <FileText className="w-5 h-5" /> Quick Actions
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Product Management */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-200 transition-colors group">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Package className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Products</h3>
                                    <p className="text-slate-500 mb-6 text-sm">Manage inventory and add new items.</p>
                                    <div className="flex gap-3">
                                        <Link href="/admin/products" className="flex-1">
                                            <Button variant="outline" className="w-full text-xs font-bold">View All</Button>
                                        </Link>
                                        <Link href="/admin/products/new" className="flex-1">
                                            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-xs font-bold">Add New</Button>
                                        </Link>
                                    </div>
                                </div>

                                {/* Order Management */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-purple-200 transition-colors group">
                                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <ShoppingCart className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Orders</h3>
                                    <p className="text-slate-500 mb-6 text-sm">Track and fulfill customer orders.</p>
                                    <Link href="/admin/orders">
                                        <Button className="w-full bg-slate-900 hover:bg-slate-800 text-xs font-bold">Manage Orders</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity Feed - 1 Column */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                            <Clock className="w-5 h-5" /> Recent Activity
                        </h2>
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            {recentActivity.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                    {recentActivity.map((order) => (
                                        <div key={order._id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-3 group cursor-pointer" onClick={() => router.push(`/admin/orders/${order._id}`)}>
                                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                                <ShoppingCart className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-900 truncate">
                                                    Order {order.orderNumber}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-0.5 truncate">
                                                    {order.userId?.name || 'Customer'} placed an order
                                                </p>
                                                <p className="text-xs font-medium text-slate-700 mt-1">
                                                    ₹{order.totalAmount.toLocaleString()} • {order.items?.length || order.products?.length} items
                                                </p>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide whitespace-nowrap">
                                                {formatDate(order.createdAt)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-slate-400">
                                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Clock className="w-6 h-6 text-slate-300" />
                                    </div>
                                    <p>No recent activity</p>
                                </div>
                            )}
                            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                                <Link href="/admin/orders" className="text-xs font-bold text-slate-600 hover:text-slate-900 uppercase tracking-wider">
                                    View All Activity
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}