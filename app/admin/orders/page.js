'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Loader from '@/components/ui/Loader';
import {
    Search, LayoutGrid, List, Filter,
    Package, Clock, Settings, Truck, CheckCircle, XCircle,
    Eye, User, Calendar, DollarSign, AlertCircle
} from 'lucide-react';

export default function AdminOrdersPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            router.push('/login');
            return;
        }

        if (user && user.role === 'admin') {
            fetchOrders();
        }
    }, [user, loading]);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            setOrders(data.orders || []);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'pending':
                return {
                    color: 'bg-amber-100 text-amber-700 border-amber-200',
                    icon: Clock,
                    gradient: 'from-amber-500 to-orange-500'
                };
            case 'processing':
                return {
                    color: 'bg-blue-100 text-blue-700 border-blue-200',
                    icon: Settings,
                    gradient: 'from-blue-500 to-cyan-500'
                };
            case 'shipped':
                return {
                    color: 'bg-purple-100 text-purple-700 border-purple-200',
                    icon: Truck,
                    gradient: 'from-purple-500 to-pink-500'
                };
            case 'delivered':
                return {
                    color: 'bg-green-100 text-green-700 border-green-200',
                    icon: CheckCircle,
                    gradient: 'from-green-500 to-emerald-500'
                };
            case 'cancelled':
                return {
                    color: 'bg-red-100 text-red-700 border-red-200',
                    icon: XCircle,
                    gradient: 'from-red-500 to-pink-500'
                };
            default:
                return {
                    color: 'bg-slate-100 text-slate-700 border-slate-200',
                    icon: Package,
                    gradient: 'from-slate-500 to-slate-600'
                };
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        const matchesSearch =
            order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const statusCounts = {
        all: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
    };

    if (loading) return <Loader.Page />;
    if (!user || user.role !== 'admin') return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                                <Package className="w-10 h-10 text-slate-800" /> Orders Management
                            </h1>
                            <p className="text-slate-600">Track and manage all customer orders</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${viewMode === 'table'
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                    }`}
                            >
                                <List className="w-5 h-5" />
                                <span className="hidden sm:inline">Table</span>
                            </button>
                            <button
                                onClick={() => setViewMode('cards')}
                                className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${viewMode === 'cards'
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                    }`}
                            >
                                <LayoutGrid className="w-5 h-5" />
                                <span className="hidden sm:inline">Cards</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    {[
                        { status: 'all', label: 'All Orders', icon: Filter, gradient: 'from-slate-500 to-slate-600' },
                        { status: 'pending', label: 'Pending', icon: Clock, gradient: 'from-amber-500 to-orange-500' },
                        { status: 'processing', label: 'Processing', icon: Settings, gradient: 'from-blue-500 to-cyan-500' },
                        { status: 'shipped', label: 'Shipped', icon: Truck, gradient: 'from-purple-500 to-pink-500' },
                        { status: 'delivered', label: 'Delivered', icon: CheckCircle, gradient: 'from-green-500 to-emerald-500' },
                        { status: 'cancelled', label: 'Cancelled', icon: XCircle, gradient: 'from-red-500 to-pink-500' },
                    ].map(({ status, label, icon: Icon, gradient }) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`p-4 rounded-2xl transition-all duration-300 ${filterStatus === status
                                ? 'bg-white shadow-xl border-2 border-blue-500 scale-105'
                                : 'bg-white shadow-sm border border-slate-200 hover:shadow-lg hover:scale-102'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-2 mx-auto`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-2xl font-bold text-slate-900">{statusCounts[status]}</div>
                            <div className="text-xs text-slate-600 font-medium">{label}</div>
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by order ID, customer name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Orders Display */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader size="lg" />
                    </div>
                ) : viewMode === 'table' ? (
                    /* Table View */
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                    <tr>
                                        <th className="text-left p-4 font-semibold text-slate-700">Order ID</th>
                                        <th className="text-left p-4 font-semibold text-slate-700 hidden lg:table-cell">Customer</th>
                                        <th className="text-left p-4 font-semibold text-slate-700 hidden md:table-cell">Date</th>
                                        <th className="text-right p-4 font-semibold text-slate-700">Total</th>
                                        <th className="text-center p-4 font-semibold text-slate-700">Status</th>
                                        <th className="text-right p-4 font-semibold text-slate-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="p-12 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Package className="w-16 h-16 text-slate-300" />
                                                    <p className="text-slate-600 font-medium">No orders found</p>
                                                    <p className="text-slate-500 text-sm">Try adjusting your filters</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredOrders.map((order) => {
                                            const statusInfo = getStatusInfo(order.status);
                                            const StatusIcon = statusInfo.icon;
                                            return (
                                                <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-4">
                                                        <div className="font-bold text-slate-900">
                                                            #{order._id.slice(-6).toUpperCase()}
                                                        </div>
                                                        <div className="text-xs text-slate-500 lg:hidden">
                                                            {order.userId?.name || 'Unknown User'}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 hidden lg:table-cell">
                                                        <div className="font-medium text-slate-900">
                                                            {order.userId?.name || 'Unknown User'}
                                                        </div>
                                                        <div className="text-xs text-slate-500">{order.userId?.email}</div>
                                                    </td>
                                                    <td className="p-4 text-slate-600 hidden md:table-cell">
                                                        {new Date(order.createdAt || '').toLocaleDateString('en-IN', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <span className="font-bold text-slate-900">
                                                            ₹{(order.totalAmount || 0).toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold capitalize ${statusInfo.color} border`}>
                                                            <StatusIcon className="w-3 h-3" />
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <Link href={`/admin/orders/${order._id}`}>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-500 flex items-center gap-2"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                                <span className="hidden sm:inline">View Details</span>
                                                            </Button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* Cards View */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredOrders.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
                                <Package className="w-16 h-16 text-slate-300 mb-4" />
                                <p className="text-slate-600 font-medium">No orders found</p>
                                <p className="text-slate-500 text-sm">Try adjusting your filters</p>
                            </div>
                        ) : (
                            filteredOrders.map((order) => {
                                const statusInfo = getStatusInfo(order.status);
                                const StatusIcon = statusInfo.icon;
                                return (
                                    <div
                                        key={order._id}
                                        className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                                    >
                                        {/* Status Bar */}
                                        <div className={`h-2 bg-gradient-to-r ${statusInfo.gradient}`}></div>

                                        <div className="p-6">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <div className="text-xs text-slate-500 mb-1">Order ID</div>
                                                    <div className="text-xl font-bold text-slate-900">
                                                        #{order._id.slice(-6).toUpperCase()}
                                                    </div>
                                                </div>
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold capitalize ${statusInfo.color} border`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {order.status}
                                                </span>
                                            </div>

                                            {/* Customer Info */}
                                            <div className="mb-4 p-3 bg-slate-50 rounded-xl">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <User className="w-5 h-5 text-slate-400" />
                                                    <div className="font-semibold text-slate-900">
                                                        {order.userId?.name || 'Unknown User'}
                                                    </div>
                                                </div>
                                                <div className="text-xs text-slate-600 ml-7">
                                                    {order.userId?.email}
                                                </div>
                                            </div>

                                            {/* Details */}
                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-slate-600 flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" /> Date:
                                                    </span>
                                                    <span className="text-sm font-medium text-slate-900">
                                                        {new Date(order.createdAt || '').toLocaleDateString('en-IN', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-slate-600 flex items-center gap-2">
                                                        <DollarSign className="w-4 h-4" /> Total:
                                                    </span>
                                                    <span className="text-lg font-bold text-blue-600">
                                                        ₹{(order.totalAmount || 0).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <Link href={`/admin/orders/${order._id}`} className="block">
                                                <Button
                                                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 border-0 flex items-center justify-center gap-2"
                                                    size="sm"
                                                >
                                                    <Eye className="w-4 h-4" /> View Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}