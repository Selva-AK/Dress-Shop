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
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
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
            title: 'Total Products',
            value: stats.totalProducts,
            icon: Package,
            bgGradient: 'from-blue-500 to-cyan-500',
            iconBg: 'bg-blue-50',
            change: '+12%',
            changeType: 'positive'
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: ShoppingCart,
            bgGradient: 'from-purple-500 to-pink-500',
            iconBg: 'bg-purple-50',
            change: '+8%',
            changeType: 'positive'
        },
        {
            title: 'Pending Orders',
            value: stats.pendingOrders,
            icon: Clock,
            bgGradient: 'from-orange-500 to-amber-500',
            iconBg: 'bg-orange-50',
            change: '-3%',
            changeType: 'negative'
        },
        {
            title: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            bgGradient: 'from-green-500 to-emerald-500',
            iconBg: 'bg-green-50',
            change: '+23%',
            changeType: 'positive'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="mb-12">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                                Admin Dashboard
                            </h1>
                            <p className="text-slate-600 text-lg flex items-center gap-2">
                                Welcome back, <span className="font-semibold text-slate-900">{user.name}</span> <Hand className="w-5 h-5" />
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Link href="/">
                                <Button variant="outline" className="flex items-center gap-2">
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
                            className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200"
                        >
                            {/* Gradient Background Decoration */}
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.bgGradient} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>

                            <div className="relative p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-14 h-14 ${stat.iconBg} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                        <stat.icon className="w-7 h-7 text-slate-700" />
                                    </div>
                                    {/* <div className={`px-3 py-1 rounded-full text-xs font-semibold ${stat.changeType === 'positive'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                        }`}>
                                        {stat.change}
                                    </div> */}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Product Management Card */}
                        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200">
                            <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                        <Package className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">Product Management</h3>
                                </div>
                                <p className="text-slate-600 mb-6 leading-relaxed">
                                    Manage your product catalog, add new items, update prices and inventory.
                                </p>
                                <div className="flex gap-3">
                                    <Link href="/admin/products" className="flex-1">
                                        <Button variant="outline" className="w-full hover:border-blue-500 hover:text-blue-600 transition-colors">
                                            View All
                                        </Button>
                                    </Link>
                                    <Link href="/admin/products/new" className="flex-1">
                                        <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 border-0">
                                            Add New
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Order Management Card */}
                        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200">
                            <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">Order Management</h3>
                                </div>
                                <p className="text-slate-600 mb-6 leading-relaxed">
                                    View and manage customer orders, update order status and track shipments.
                                </p>
                                <Link href="/admin/orders" className="block">
                                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0">
                                        Manage Orders
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Analytics Card */}
                        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200">
                            <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                                        <BarChart3 className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">Quick Links</h3>
                                </div>
                                <div className="space-y-3">
                                    <Link href="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group/link">
                                        <Store className="w-5 h-5 text-slate-600" />
                                        <span className="text-slate-700 group-hover/link:text-slate-900 font-medium">View Store Frontend</span>
                                    </Link>
                                    <Link href="/admin/products" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group/link">
                                        <Package className="w-5 h-5 text-slate-600" />
                                        <span className="text-slate-700 group-hover/link:text-slate-900 font-medium">All Products</span>
                                    </Link>
                                    <Link href="/admin/orders" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group/link">
                                        <FileText className="w-5 h-5 text-slate-600" />
                                        <span className="text-slate-700 group-hover/link:text-slate-900 font-medium">All Orders</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-slate-900">Product Updates Available</p>
                                <p className="text-sm text-slate-600">Check for inventory and pricing changes</p>
                            </div>
                            <span className="text-sm text-slate-500">Just now</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <ShoppingCart className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-slate-900">New Orders</p>
                                <p className="text-sm text-slate-600">You have pending orders to process</p>
                            </div>
                            <span className="text-sm text-slate-500">2h ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}