'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import {
    User, MapPin, Lock, Package, Heart, Mail, Calendar,
    Edit2, Save, X, Plus, Trash2, Check, AlertTriangle,
    Eye, EyeOff, ShieldCheck, LogOut, Sparkles
} from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ProfilePage() {
    const { user, loading: authLoading, logout } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Profile data
    const [profileData, setProfileData] = useState(null);
    const [statistics, setStatistics] = useState({ orderCount: 0, wishlistCount: 0 });

    // Edit states
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({ name: '', email: '' });

    // Password change
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    // Address management
    const [addresses, setAddresses] = useState([]);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [addressForm, setAddressForm] = useState({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false,
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?redirect=/profile');
        } else if (user) {
            fetchProfileData();
        }
    }, [user, authLoading]);

    const fetchProfileData = async () => {
        try {
            const res = await fetch('/api/user/profile');
            const data = await res.json();

            if (res.ok) {
                setProfileData(data.user);
                setStatistics(data.statistics);
                setAddresses(data.user.addresses || []);
                setProfileForm({ name: data.user.name, email: data.user.email });
            } else {
                setError(data.error || 'Failed to fetch profile');
            }
        } catch (err) {
            setError('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSaving(true);

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileForm),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Profile updated successfully!');
                setProfileData(prev => ({ ...prev, ...data.user }));
                setIsEditingProfile(false);
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.error || 'Failed to update profile');
            }
        } catch (err) {
            setError('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setSaving(true);

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Password changed successfully!');
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.error || 'Failed to change password');
            }
        } catch (err) {
            setError('Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSaving(true);

        try {
            const res = await fetch('/api/user/addresses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addressForm),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Address added successfully!');
                setAddresses(data.addresses);
                setIsAddingAddress(false);
                resetAddressForm();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.error || 'Failed to add address');
            }
        } catch (err) {
            setError('Failed to add address');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateAddress = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSaving(true);

        try {
            const res = await fetch('/api/user/addresses', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...addressForm, addressId: editingAddressId }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Address updated successfully!');
                setAddresses(data.addresses);
                setEditingAddressId(null);
                resetAddressForm();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.error || 'Failed to update address');
            }
        } catch (err) {
            setError('Failed to update address');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        setError('');
        setSuccess('');

        try {
            const res = await fetch(`/api/user/addresses?addressId=${addressId}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Address deleted successfully!');
                setAddresses(data.addresses);
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.error || 'Failed to delete address');
            }
        } catch (err) {
            setError('Failed to delete address');
        }
    };

    const handleSetDefaultAddress = async (addressId) => {
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/user/addresses', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ addressId }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Default address updated!');
                setAddresses(data.addresses);
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.error || 'Failed to set default address');
            }
        } catch (err) {
            setError('Failed to set default address');
        }
    };

    const startEditAddress = (address) => {
        setEditingAddressId(address._id);
        setAddressForm({
            fullName: address.fullName,
            phone: address.phone,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2 || '',
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            isDefault: address.isDefault,
        });
    };

    const resetAddressForm = () => {
        setAddressForm({
            fullName: '',
            phone: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            pincode: '',
            isDefault: false,
        });
    };

    const cancelAddressEdit = () => {
        setEditingAddressId(null);
        setIsAddingAddress(false);
        resetAddressForm();
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <User className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'addresses', label: 'Addresses', icon: MapPin },
        { id: 'security', label: 'Security', icon: Lock },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl mb-3 shadow-2xl shadow-blue-500/50 transform hover:scale-110 transition-transform duration-300">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 tracking-tight">
                        My Profile
                    </h1>
                    <p className="text-slate-600 text-base flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        Manage your account settings and preferences
                    </p>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-6 max-w-4xl mx-auto animate-[slideDown_0.6s_ease-out]">
                        <div className="p-4 bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 border-2 border-green-400 rounded-2xl shadow-xl shadow-green-200/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Check className="w-6 h-6 text-white" />
                                </div>
                                <p className="font-black text-green-900 text-base">{success}</p>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mb-6 max-w-4xl mx-auto animate-[slideDown_0.6s_ease-out]">
                        <div className="p-4 bg-gradient-to-r from-red-100 via-rose-100 to-pink-100 border-2 border-red-400 rounded-2xl shadow-xl shadow-red-200/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <AlertTriangle className="w-6 h-6 text-white" />
                                </div>
                                <p className="font-black text-red-900 text-base">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-4 gap-6">
                        {/* Sidebar - Stats & Navigation */}
                        <div className="lg:col-span-1 space-y-4">
                            {/* User Card */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-indigo-200 shadow-xl shadow-indigo-100/50 p-5">
                                <div className="text-center">
                                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg mb-3">
                                        {profileData?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <h3 className="font-black text-slate-900 text-lg mb-1">{profileData?.name}</h3>
                                    <p className="text-xs text-slate-600 mb-3">{profileData?.email}</p>
                                    <div className="flex items-center justify-center gap-1 text-[10px] text-indigo-600 bg-indigo-50 rounded-full px-3 py-1">
                                        <Calendar className="w-3 h-3" />
                                        Joined {new Date(profileData?.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>

                            {/* Statistics */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-indigo-200 shadow-xl shadow-indigo-100/50 p-4 space-y-3">
                                <h3 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-3">Statistics</h3>
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <Package className="w-4 h-4 text-blue-600" />
                                        <span className="text-xs font-semibold text-slate-700">Orders</span>
                                    </div>
                                    <span className="text-base font-black text-blue-600">{statistics.orderCount}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <Heart className="w-4 h-4 text-purple-600" />
                                        <span className="text-xs font-semibold text-slate-700">Wishlist</span>
                                    </div>
                                    <span className="text-base font-black text-purple-600">{statistics.wishlistCount}</span>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-indigo-200 shadow-xl shadow-indigo-100/50 p-2 space-y-1">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                                    ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white shadow-lg'
                                                    : 'text-slate-600 hover:bg-slate-100'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-indigo-200 shadow-xl shadow-indigo-100/50 overflow-hidden">
                                {/* Profile Tab */}
                                {activeTab === 'profile' && (
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-xl font-black text-slate-900">Personal Information</h2>
                                            {!isEditingProfile && (
                                                <button
                                                    onClick={() => setIsEditingProfile(true)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-bold transition-all"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                    Edit
                                                </button>
                                            )}
                                        </div>

                                        {isEditingProfile ? (
                                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                                <div>
                                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                                                        <User className="w-4 h-4" /> Full Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={profileForm.name}
                                                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                                        required
                                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                                                        <Mail className="w-4 h-4" /> Email Address
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={profileForm.email}
                                                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                                        required
                                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    />
                                                </div>
                                                <div className="flex gap-3 pt-2">
                                                    <Button
                                                        type="submit"
                                                        loading={saving}
                                                        disabled={saving}
                                                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border-0"
                                                    >
                                                        <Save className="w-4 h-4 inline mr-2" />
                                                        Save Changes
                                                    </Button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setIsEditingProfile(false);
                                                            setProfileForm({ name: profileData.name, email: profileData.email });
                                                        }}
                                                        className="flex-1 px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold transition-all"
                                                    >
                                                        <X className="w-4 h-4 inline mr-2" />
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="p-4 bg-slate-50 rounded-xl">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
                                                    <p className="text-base font-bold text-slate-900 mt-1">{profileData?.name}</p>
                                                </div>
                                                <div className="p-4 bg-slate-50 rounded-xl">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
                                                    <p className="text-base font-bold text-slate-900 mt-1">{profileData?.email}</p>
                                                </div>
                                                <div className="p-4 bg-slate-50 rounded-xl">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Account Type</label>
                                                    <p className="text-base font-bold text-slate-900 mt-1 capitalize">{profileData?.role}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Addresses Tab */}
                                {activeTab === 'addresses' && (
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-xl font-black text-slate-900">Saved Addresses</h2>
                                            {!isAddingAddress && !editingAddressId && (
                                                <button
                                                    onClick={() => setIsAddingAddress(true)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-bold transition-all"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Add Address
                                                </button>
                                            )}
                                        </div>

                                        {(isAddingAddress || editingAddressId) && (
                                            <form onSubmit={editingAddressId ? handleUpdateAddress : handleAddAddress} className="mb-6 p-5 bg-blue-50 border-2 border-blue-200 rounded-xl">
                                                <h3 className="text-sm font-black text-blue-900 mb-4">
                                                    {editingAddressId ? 'Edit Address' : 'Add New Address'}
                                                </h3>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-xs font-semibold text-slate-700 mb-1 block">Full Name *</label>
                                                        <input
                                                            type="text"
                                                            value={addressForm.fullName}
                                                            onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                                                            required
                                                            className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-semibold text-slate-700 mb-1 block">Phone *</label>
                                                        <input
                                                            type="tel"
                                                            value={addressForm.phone}
                                                            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                                            required
                                                            className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="text-xs font-semibold text-slate-700 mb-1 block">Address Line 1 *</label>
                                                        <input
                                                            type="text"
                                                            value={addressForm.addressLine1}
                                                            onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                                                            required
                                                            className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="text-xs font-semibold text-slate-700 mb-1 block">Address Line 2</label>
                                                        <input
                                                            type="text"
                                                            value={addressForm.addressLine2}
                                                            onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                                                            className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-semibold text-slate-700 mb-1 block">City *</label>
                                                        <input
                                                            type="text"
                                                            value={addressForm.city}
                                                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                                            required
                                                            className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-semibold text-slate-700 mb-1 block">State *</label>
                                                        <input
                                                            type="text"
                                                            value={addressForm.state}
                                                            onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                                            required
                                                            className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-semibold text-slate-700 mb-1 block">Pincode *</label>
                                                        <input
                                                            type="text"
                                                            value={addressForm.pincode}
                                                            onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                                                            required
                                                            className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div className="flex items-center">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={addressForm.isDefault}
                                                                onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                                                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                                            />
                                                            <span className="text-xs font-semibold text-slate-700">Set as default</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3 mt-4">
                                                    <Button
                                                        type="submit"
                                                        loading={saving}
                                                        disabled={saving}
                                                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border-0"
                                                        size="sm"
                                                    >
                                                        <Save className="w-4 h-4 inline mr-2" />
                                                        {editingAddressId ? 'Update' : 'Save'} Address
                                                    </Button>
                                                    <button
                                                        type="button"
                                                        onClick={cancelAddressEdit}
                                                        className="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-sm font-bold transition-all"
                                                    >
                                                        <X className="w-4 h-4 inline mr-2" />
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        )}

                                        {addresses.length === 0 ? (
                                            <div className="text-center py-12">
                                                <MapPin className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                                                <p className="text-slate-600 mb-4">No addresses saved yet</p>
                                                <button
                                                    onClick={() => setIsAddingAddress(true)}
                                                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-all"
                                                >
                                                    <Plus className="w-4 h-4 inline mr-2" />
                                                    Add Your First Address
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {addresses.map((address) => (
                                                    <div
                                                        key={address._id}
                                                        className={`p-4 rounded-xl border-2 transition-all ${address.isDefault
                                                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
                                                                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                                                            }`}
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <h4 className="font-black text-slate-900 text-sm">{address.fullName}</h4>
                                                                    {address.isDefault && (
                                                                        <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full">
                                                                            DEFAULT
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-slate-700 leading-relaxed">
                                                                    {address.addressLine1}
                                                                    {address.addressLine2 && `, ${address.addressLine2}`}
                                                                    <br />
                                                                    {address.city}, {address.state} - {address.pincode}
                                                                    <br />
                                                                    Phone: {address.phone}
                                                                </p>
                                                            </div>
                                                            <div className="flex gap-2 ml-4">
                                                                {!address.isDefault && (
                                                                    <button
                                                                        onClick={() => handleSetDefaultAddress(address._id)}
                                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                                                        title="Set as default"
                                                                    >
                                                                        <ShieldCheck className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() => startEditAddress(address)}
                                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                                    title="Edit"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteAddress(address._id)}
                                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Security Tab */}
                                {activeTab === 'security' && (
                                    <div className="p-6">
                                        <h2 className="text-xl font-black text-slate-900 mb-6">Change Password</h2>
                                        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                                            <div>
                                                <label className="text-sm font-semibold text-slate-700 mb-2 block">Current Password</label>
                                                <div className="relative">
                                                    <input
                                                        type={showPasswords.current ? 'text' : 'password'}
                                                        value={passwordForm.currentPassword}
                                                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                                        required
                                                        className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                    >
                                                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-slate-700 mb-2 block">New Password</label>
                                                <div className="relative">
                                                    <input
                                                        type={showPasswords.new ? 'text' : 'password'}
                                                        value={passwordForm.newPassword}
                                                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                                        required
                                                        className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                    >
                                                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-slate-700 mb-2 block">Confirm New Password</label>
                                                <div className="relative">
                                                    <input
                                                        type={showPasswords.confirm ? 'text' : 'password'}
                                                        value={passwordForm.confirmPassword}
                                                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                                        required
                                                        className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                    >
                                                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <Button
                                                type="submit"
                                                loading={saving}
                                                disabled={saving}
                                                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 border-0"
                                            >
                                                <Lock className="w-4 h-4 inline mr-2" />
                                                Change Password
                                            </Button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
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
