'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../providers/AuthProvider';
import { useCart } from '../providers/CartProvider';
import {
    LogoIcon, SearchIcon, HeartIcon, UserIcon, ChevronDownIcon,
    DashboardIcon, BoxIcon, LogoutIcon, LoginIcon, CartIcon
} from '../ui/Icons';

export default function Header() {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const searchRef = useRef(null);

    // Close search dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced search
    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (searchQuery.trim().length > 1) {
                performSearch(searchQuery);
            } else {
                setSearchResults([]);
                setShowSearchDropdown(false);
            }
        }, 300);

        return () => clearTimeout(delaySearch);
    }, [searchQuery]);

    const performSearch = async (query) => {
        setIsSearching(true);
        try {
            const response = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=5`);
            if (response.ok) {
                const data = await response.json();
                setSearchResults(data.products || []);
                setShowSearchDropdown(true);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setShowSearchDropdown(false);
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleResultClick = () => {
        setShowSearchDropdown(false);
        setSearchQuery('');
    };

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
            {/* Top Bar */}
            {/* Top Bar Removed */}

            {/* Main Header */}
            <div className="bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16 gap-4">
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0 group">
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                                    <LogoIcon className="w-5 h-5 text-white" />
                                </div>
                                <div className="hidden sm:flex flex-col">
                                    <span className="text-gray-900 font-bold text-lg leading-none">DressStore</span>
                                    <span className="text-indigo-600 text-[9px] font-medium tracking-wider uppercase">Premium Fashion</span>
                                </div>
                            </div>
                        </Link>

                        {/* Search Bar - Desktop */}
                        <div className="hidden md:flex flex-1 max-w-xl" ref={searchRef}>
                            <form onSubmit={handleSearchSubmit} className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Search for dresses, categories, brands..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => searchQuery.trim().length > 1 && setShowSearchDropdown(true)}
                                    className="w-full px-4 py-2 pr-10 rounded-lg border-2 border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-md transition-all"
                                >
                                    <SearchIcon className="w-4 h-4" />
                                </button>

                                {/* Search Dropdown */}
                                {showSearchDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                                        {isSearching ? (
                                            <div className="p-4 text-center text-gray-500">
                                                <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
                                                <p className="mt-2 text-sm">Searching...</p>
                                            </div>
                                        ) : searchResults.length > 0 ? (
                                            <>
                                                {searchResults.map((product) => {
                                                    const minPrice = product.sizes && product.sizes.length > 0
                                                        ? Math.min(...product.sizes.map(s => s.price))
                                                        : product.price || 0;
                                                    const maxPrice = product.sizes && product.sizes.length > 0
                                                        ? Math.max(...product.sizes.map(s => s.price))
                                                        : product.price || 0;

                                                    return (
                                                        <Link
                                                            key={product._id}
                                                            href={`/products/${product.slug}`}
                                                            onClick={handleResultClick}
                                                            className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                                                        >
                                                            <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                                                                <Image
                                                                    src={product.images[0] || '/placeholder-dress.jpg'}
                                                                    alt={product.title}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="text-sm font-medium text-gray-900 truncate">{product.title}</h4>
                                                                <p className="text-xs text-gray-500 mt-0.5 capitalize">{product.category}</p>
                                                                <p className="text-sm font-bold text-indigo-600 mt-1">
                                                                    {minPrice === maxPrice
                                                                        ? `₹${minPrice.toLocaleString()}`
                                                                        : `₹${minPrice.toLocaleString()} - ₹${maxPrice.toLocaleString()}`
                                                                    }
                                                                </p>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                                <Link
                                                    href={`/products?search=${encodeURIComponent(searchQuery)}`}
                                                    onClick={handleResultClick}
                                                    className="block p-3 text-center text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                >
                                                    View all results for "{searchQuery}"
                                                </Link>
                                            </>
                                        ) : (
                                            <div className="p-4 text-center text-gray-500">
                                                <p className="text-sm">No products found for "{searchQuery}"</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2">
                            {/* Wishlist - Desktop */}
                            <Link href="/wishlist" className="hidden lg:flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors group">
                                <HeartIcon className="w-5 h-5 group-hover:text-red-500 transition-colors" />
                                <span className="text-xs font-medium hidden xl:block">Wishlist</span>
                            </Link>

                            {/* User Menu */}
                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xs shadow-md">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="hidden lg:flex flex-col items-start">
                                            <span className="text-[10px] text-gray-500 leading-none">Hello,</span>
                                            <span className="text-xs font-semibold leading-none mt-0.5">{user.name}</span>
                                        </div>
                                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isUserMenuOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)}></div>
                                            <div
                                                className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="px-4 py-2.5 border-b border-gray-100">
                                                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                                                </div>
                                                {user.role === 'admin' && (
                                                    <Link
                                                        href="/admin/dashboard"
                                                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                    >
                                                        <DashboardIcon className="w-4 h-4" />
                                                        Admin Dashboard
                                                    </Link>
                                                )}
                                                <Link
                                                    href="/orders"
                                                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <BoxIcon className="w-4 h-4" />
                                                    My Orders
                                                </Link>
                                                <Link
                                                    href="/profile"
                                                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <UserIcon className="w-4 h-4" />
                                                    Profile
                                                </Link>
                                                <div className="border-t border-gray-100 mt-2 pt-2">
                                                    <button
                                                        onClick={() => {
                                                            setIsUserMenuOpen(false);
                                                            logout();
                                                        }}
                                                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                                                    >
                                                        <LogoutIcon className="w-4 h-4" />
                                                        Logout
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <Link href="/login" className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium transition-all shadow-md hover:shadow-lg text-xs">
                                    <LoginIcon className="w-4 h-4" />
                                    <span className="hidden sm:inline">Login</span>
                                </Link>
                            )}

                            {/* Cart */}
                            <Link href="/cart" className="relative flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 transition-colors group">
                                <CartIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span className="hidden md:inline text-xs font-semibold">Cart</span>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                                        {cartCount > 9 ? '9+' : cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar */}
            <div className="md:hidden bg-white border-t border-gray-100 px-4 py-2">
                <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                        type="text"
                        placeholder="Search for dresses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 pr-9 rounded-lg border-2 border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    />
                    <button
                        type="submit"
                        className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md flex items-center justify-center"
                    >
                        <SearchIcon className="w-3.5 h-3.5" />
                    </button>
                </form>
            </div>

            {/* Category Navigation */}
            <div className="hidden md:block bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center gap-1 py-1 overflow-x-auto scrollbar-hide">
                        <Link href="/products?category=casual" className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all whitespace-nowrap">
                            Casual Wear
                        </Link>
                        <Link href="/products?category=formal" className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all whitespace-nowrap">
                            Formal Wear
                        </Link>
                        <Link href="/products?category=party" className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all whitespace-nowrap">
                            Party Wear
                        </Link>
                        <Link href="/products?category=ethnic" className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all whitespace-nowrap">
                            Ethnic Wear
                        </Link>
                        <Link href="/products?category=western" className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all whitespace-nowrap">
                            Western Wear
                        </Link>
                        <Link href="/products?category=summer" className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all whitespace-nowrap">
                            Summer Collection
                        </Link>
                        <Link href="/products?tag=new" className="px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg transition-all whitespace-nowrap shadow-sm">
                            New Arrivals
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}
