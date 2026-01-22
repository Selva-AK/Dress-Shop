'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Loader from '@/components/ui/Loader';
import { Package, ShoppingCart, Clock, DollarSign, Store, FileText, BarChart3, Hand, TrendingUp, ArrowUpRight } from 'lucide-react';

export default function AdminDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [recentActivity, setRecentActivity] = useState([]);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0
    });

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
            gradient: 'from-emerald-500 to-teal-600',
            bgGradient: 'from-emerald-50 to-teal-50',
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
            trend: '+12.5%',
            trendUp: true,
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: ShoppingCart,
            gradient: 'from-blue-500 to-indigo-600',
            bgGradient: 'from-blue-50 to-indigo-50',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            trend: '+8.2%',
            trendUp: true,
        },
        {
            title: 'Total Products',
            value: stats.totalProducts,
            icon: Package,
            gradient: 'from-violet-500 to-purple-600',
            bgGradient: 'from-violet-50 to-purple-50',
            iconBg: 'bg-violet-100',
            iconColor: 'text-violet-600',
            trend: '+5.1%',
            trendUp: true,
        },
        {
            title: 'Pending Orders',
            value: stats.pendingOrders,
            icon: Clock,
            gradient: 'from-amber-500 to-orange-600',
            bgGradient: 'from-amber-50 to-orange-50',
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600',
            trend: '-2.4%',
            trendUp: false,
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
            <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
                {/* Premium Header Section */}
                <div className="mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                    <BarChart3 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent tracking-tight">
                                        Dashboard
                                    </h1>
                                </div>
                            </div>
                            <p className="text-slate-600 font-medium flex items-center gap-2 ml-1">
                                Welcome back, <span className="font-bold text-slate-900">{user.name}</span>
                                <Hand className="w-5 h-5 text-amber-500 fill-amber-400 animate-pulse" />
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/">
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm hover:shadow transition-all font-semibold"
                                >
                                    <Store className="w-4 h-4" />
                                    <span className="hidden sm:inline">View Store</span>
                                    <span className="sm:hidden">Store</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Premium Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {statCards.map((stat, index) => (
                        <div
                            key={index}
                            className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-200/60 hover:border-slate-300 overflow-hidden"
                        >
                            {/* Gradient Background Decoration */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                            {/* Animated Gradient Border Effect */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                            <div className="relative p-6">
                                <div className="flex items-start justify-between mb-5">
                                    <div className={`w-14 h-14 ${stat.iconBg} ${stat.iconColor} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                                        <stat.icon className="w-7 h-7" strokeWidth={2.5} />
                                    </div>
                                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${stat.trendUp
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-red-100 text-red-700'
                                        }`}>
                                        <TrendingUp className={`w-3 h-3 ${stat.trendUp ? '' : 'rotate-180'}`} />
                                        {stat.trend}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{stat.title}</p>
                                    <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                                </div>
                            </div>

                            {/* Bottom Accent Line */}
                            <div className={`h-1 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Quick Actions - Premium Cards */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-white" />
                                </div>
                                Quick Actions
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Product Management Card */}
                            <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-200/60 overflow-hidden">
                                {/* Gradient Top Bar */}
                                <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                                {/* Animated Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-indigo-50/0 to-purple-50/0 group-hover:from-blue-50/50 group-hover:via-indigo-50/30 group-hover:to-purple-50/50 transition-all duration-700"></div>

                                <div className="relative p-7">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all duration-300">
                                            <Package className="w-7 h-7 text-white" strokeWidth={2.5} />
                                        </div>
                                        <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-2">Products</h3>
                                    <p className="text-slate-600 mb-6 text-sm leading-relaxed font-medium">Manage your inventory, add new products, and update pricing.</p>
                                    <div className="flex gap-3">
                                        <Link href="/admin/products" className="flex-1">
                                            <Button
                                                variant="outline"
                                                className="w-full border-2 border-slate-200 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 font-bold text-sm transition-all"
                                            >
                                                View All
                                            </Button>
                                        </Link>
                                        <Link href="/admin/products/new" className="flex-1">
                                            <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 border-0 shadow-md hover:shadow-lg font-bold text-sm transition-all">
                                                Add New
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Order Management Card */}
                            <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-200/60 overflow-hidden">
                                {/* Gradient Top Bar */}
                                <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"></div>

                                {/* Animated Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 via-pink-50/0 to-rose-50/0 group-hover:from-purple-50/50 group-hover:via-pink-50/30 group-hover:to-rose-50/50 transition-all duration-700"></div>

                                <div className="relative p-7">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-purple-500/40 transition-all duration-300">
                                            <ShoppingCart className="w-7 h-7 text-white" strokeWidth={2.5} />
                                        </div>
                                        <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-2">Orders</h3>
                                    <p className="text-slate-600 mb-6 text-sm leading-relaxed font-medium">Track and fulfill customer orders with ease and efficiency.</p>
                                    <Link href="/admin/orders">
                                        <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 border-0 shadow-md hover:shadow-lg font-bold text-sm transition-all">
                                            Manage Orders
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity Feed - Premium Design */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-white" />
                                </div>
                                Activity
                            </h2>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden hover:shadow-lg transition-all duration-300">
                            {recentActivity.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                    {recentActivity.map((order) => (
                                        <div
                                            key={order._id}
                                            className="p-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-300 flex items-start gap-4 group cursor-pointer"
                                            onClick={() => router.push(`/admin/orders/${order._id}`)}
                                        >
                                            <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/20 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/30 transition-all duration-300">
                                                <ShoppingCart className="w-5 h-5 text-white" strokeWidth={2.5} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-900 truncate mb-0.5">
                                                    Order {order.orderNumber}
                                                </p>
                                                <p className="text-xs text-slate-600 truncate mb-1.5 font-medium">
                                                    {order.userId?.name || 'Customer'} placed an order
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                                        ₹{order.totalAmount.toLocaleString()}
                                                    </span>
                                                    <span className="text-xs text-slate-500 font-medium">
                                                        • {order.items?.length || order.products?.length} items
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest whitespace-nowrap mt-1">
                                                {formatDate(order.createdAt)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                                        <Clock className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <p className="text-slate-500 font-semibold text-sm">No recent activity</p>
                                    <p className="text-slate-400 text-xs mt-1">Orders will appear here</p>
                                </div>
                            )}
                            <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200 text-center">
                                <Link href="/admin/orders" className="text-xs font-extrabold text-slate-700 hover:text-slate-900 uppercase tracking-widest inline-flex items-center gap-2 group">
                                    View All Activity
                                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}