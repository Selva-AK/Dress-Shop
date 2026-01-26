'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Loader from '@/components/ui/Loader';
import {
    Search,
    Plus,
    LayoutGrid,
    List,
    Package,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    MoreHorizontal
} from 'lucide-react';

export default function AdminProductsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [products, setProducts] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [jumpToPage, setJumpToPage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            router.push('/login');
            return;
        }

        if (user && user.role === 'admin') {
            fetchProducts();
        }
    }, [user, loading, page, itemsPerPage, searchTerm]);

    // Debounce search to avoid excessive API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            if (user && user.role === 'admin') {
                setPage(1); // Reset to first page on new search
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            // Build query string with search parameter
            const params = new URLSearchParams({
                limit: itemsPerPage.toString(),
                page: page.toString(),
            });

            if (searchTerm.trim()) {
                params.append('search', searchTerm.trim());
            }

            const res = await fetch(`/api/products?${params.toString()}`);
            const data = await res.json();
            setProducts(data.products || []);
            setTotalItems(data.total || 0);
            setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchProducts();
            } else {
                alert('Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    // Products are now filtered on the server side, no need for local filtering

    const getPriceDisplay = (product) => {
        if (product.price) return `₹${product.price.toLocaleString()}`;
        if (product.sizes?.length) {
            const prices = product.sizes.map(s => s.price);
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            return min === max ? `₹${min.toLocaleString()}` : `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
        }
        return '—';
    };

    const getStock = (product) => {
        if (typeof product.stock === 'number') return product.stock;
        return product.sizes?.reduce((sum, s) => sum + (s.stock || 0), 0) || 0;
    };

    if (loading) return <Loader.Page />;
    if (!user || user.role !== 'admin') return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                                Products
                            </h1>
                            <p className="text-slate-600">Manage your product catalog</p>
                        </div>
                        <Link href="/admin/products/new">
                            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 border-0 shadow-lg hover:shadow-xl transition-all">
                                <Plus className="mr-2 h-4 w-4" /> Add New Product
                            </Button>
                        </Link>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search products by name or category..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${viewMode === 'table'
                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    <List className="h-4 w-4" />
                                    <span className="hidden sm:inline">Table</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${viewMode === 'grid'
                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                    <span className="hidden sm:inline">Grid</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Display */}
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
                                        <th className="text-left p-4 font-semibold text-slate-700">Product</th>
                                        <th className="text-left p-4 font-semibold text-slate-700 hidden md:table-cell">Category</th>
                                        <th className="text-right p-4 font-semibold text-slate-700">Price</th>
                                        <th className="text-right p-4 font-semibold text-slate-700 hidden lg:table-cell">Stock</th>
                                        <th className="text-right p-4 font-semibold text-slate-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {products.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="p-12 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Package className="h-16 w-16 text-slate-300" />
                                                    <p className="text-slate-600 font-medium">No products found</p>
                                                    <p className="text-slate-500 text-sm">Try adjusting your search</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        products.map((product) => (
                                            <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        {product.images?.[0] ? (
                                                            <img
                                                                src={product.images[0]}
                                                                alt={product.title}
                                                                className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200 shadow-sm"
                                                            />
                                                        ) : (
                                                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                                                                <Package className="h-6 w-6 text-slate-500" />
                                                            </div>
                                                        )}
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-slate-900 truncate">{product.title}</p>
                                                            <p className="text-sm text-slate-500 capitalize md:hidden">{product.category}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-slate-600 capitalize hidden md:table-cell">
                                                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                                        {product.category}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <span className="font-bold text-slate-900">{getPriceDisplay(product)}</span>
                                                </td>
                                                <td className="p-4 text-right hidden lg:table-cell">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStock(product) > 10
                                                        ? 'bg-green-100 text-green-700'
                                                        : getStock(product) > 0
                                                            ? 'bg-amber-100 text-amber-700'
                                                            : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {getStock(product)} in stock
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/admin/products/${product._id || product.slug}`}>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="hover:bg-blue-50 hover:text-blue-600 flex items-center gap-1"
                                                            >
                                                                <Edit2 className="h-4 w-4" />
                                                                <span className="hidden sm:inline">Edit</span>
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-600 hover:bg-red-50 flex items-center gap-1"
                                                            onClick={() => handleDelete(product._id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="hidden sm:inline">Delete</span>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* Grid View */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
                                <Package className="h-16 w-16 text-slate-300 mb-4" />
                                <p className="text-slate-600 font-medium">No products found</p>
                                <p className="text-slate-500 text-sm">Try adjusting your search</p>
                            </div>
                        ) : (
                            products.map((product) => (
                                <div
                                    key={product._id}
                                    className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="relative aspect-square overflow-hidden bg-slate-100">
                                        {product.images?.[0] ? (
                                            <img
                                                src={product.images[0]}
                                                alt={product.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                                                <Package className="h-16 w-16 text-slate-400" />
                                            </div>
                                        )}
                                        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${getStock(product) > 10
                                            ? 'bg-green-500 text-white'
                                            : getStock(product) > 0
                                                ? 'bg-amber-500 text-white'
                                                : 'bg-red-500 text-white'
                                            }`}>
                                            {getStock(product)} left
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="mb-3">
                                            <span className="inline-flex px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 capitalize mb-2">
                                                {product.category}
                                            </span>
                                            <h3 className="font-bold text-slate-900 text-lg line-clamp-2 mb-1">
                                                {product.title}
                                            </h3>
                                            <p className="text-2xl font-bold text-blue-600">
                                                {getPriceDisplay(product)}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={`/admin/products/${product._id || product.slug}`} className="flex-1">
                                                <Button
                                                    variant="outline"
                                                    className="w-full hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center gap-2"
                                                    size="sm"
                                                >
                                                    <Edit2 className="h-4 w-4" /> Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-red-600 hover:bg-red-50 hover:border-red-500 flex items-center justify-center"
                                                onClick={() => handleDelete(product._id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <div className="space-y-6">
                            {/* Pagination Info & Items Per Page */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="text-sm text-slate-600">
                                    Showing <span className="font-bold text-slate-900">{((page - 1) * itemsPerPage) + 1}</span> to{' '}
                                    <span className="font-bold text-slate-900">{Math.min(page * itemsPerPage, totalItems)}</span> of{' '}
                                    <span className="font-bold text-slate-900">{totalItems}</span> products
                                </div>

                                <div className="flex items-center gap-3">
                                    <label htmlFor="itemsPerPage" className="text-sm font-medium text-slate-700">
                                        Show:
                                    </label>
                                    <select
                                        id="itemsPerPage"
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            setItemsPerPage(Number(e.target.value));
                                            setPage(1);
                                        }}
                                        className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </select>
                                </div>
                            </div>

                            {/* Page Navigation */}
                            <div className="flex flex-wrap items-center justify-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page === 1}
                                    onClick={() => setPage(1)}
                                    className="hidden sm:flex hover:bg-slate-50"
                                >
                                    <ChevronsLeft className="h-4 w-4 mr-1" /> First
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page === 1}
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    className="hover:bg-slate-50"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                                </Button>

                                <div className="flex items-center gap-1">
                                    {(() => {
                                        const pageNumbers = [];
                                        const maxVisible = 5;

                                        if (totalPages <= maxVisible + 2) {
                                            for (let i = 1; i <= totalPages; i++) {
                                                pageNumbers.push(i);
                                            }
                                        } else {
                                            pageNumbers.push(1);
                                            if (page > 3) pageNumbers.push('...');
                                            const start = Math.max(2, page - 1);
                                            const end = Math.min(totalPages - 1, page + 1);
                                            for (let i = start; i <= end; i++) {
                                                pageNumbers.push(i);
                                            }
                                            if (page < totalPages - 2) pageNumbers.push('...');
                                            pageNumbers.push(totalPages);
                                        }

                                        return pageNumbers.map((num, idx) => {
                                            if (num === '...') {
                                                return (
                                                    <span key={`ellipsis-${idx}`} className="px-3 text-slate-400 flex items-center">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </span>
                                                );
                                            }

                                            return (
                                                <button
                                                    key={num}
                                                    onClick={() => setPage(num)}
                                                    className={`min-w-[2.75rem] h-10 px-4 rounded-xl text-sm font-bold transition-all ${page === num
                                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-110'
                                                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                                                        }`}
                                                >
                                                    {num}
                                                </button>
                                            );
                                        });
                                    })()}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page === totalPages}
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    className="hover:bg-slate-50"
                                >
                                    Next <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page === totalPages}
                                    onClick={() => setPage(totalPages)}
                                    className="hidden sm:flex hover:bg-slate-50"
                                >
                                    Last <ChevronsRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>

                            {/* Jump to Page */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-4 border-t border-slate-200">
                                <label htmlFor="jumpToPage" className="text-sm font-medium text-slate-700 sm:mb-0">
                                    Jump to page:
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        id="jumpToPage"
                                        type="number"
                                        min="1"
                                        max={totalPages}
                                        value={jumpToPage}
                                        onChange={(e) => setJumpToPage(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                const pageNum = parseInt(jumpToPage);
                                                if (pageNum >= 1 && pageNum <= totalPages) {
                                                    setPage(pageNum);
                                                    setJumpToPage('');
                                                }
                                            }
                                        }}
                                        placeholder={`1-${totalPages}`}
                                        className="w-28 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            const pageNum = parseInt(jumpToPage);
                                            if (pageNum >= 1 && pageNum <= totalPages) {
                                                setPage(pageNum);
                                                setJumpToPage('');
                                            }
                                        }}
                                        disabled={!jumpToPage || parseInt(jumpToPage) < 1 || parseInt(jumpToPage) > totalPages}
                                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 border-0"
                                    >
                                        Go <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}