'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import { FileText, Tag, DollarSign, Package, Palette, Image, Settings, Clock, Save, Shirt, Briefcase, Sun, Snowflake, PartyPopper, Sparkles, Edit, Link as LinkIcon, FileType, IndianRupee, Folder, Eye, Check, X, Star } from 'lucide-react';

export default function ProductForm({
    initialData = {
        title: '',
        slug: '',
        description: '',
        sizes: [
            { size: 'S', price: '', stock: '' },
            { size: 'M', price: '', stock: '' },
            { size: 'L', price: '', stock: '' },
        ],
        compareAtPrice: '',
        category: '',
        featured: false,
        imageUrl: '',
    },
    onSubmit,
    isSubmitting = false,
    mode = 'create'
}) {
    const [formData, setFormData] = useState(initialData);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSizeChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.map((size, i) =>
                i === index ? { ...size, [field]: value } : size
            )
        }));
    };

    const addSize = () => {
        setFormData(prev => ({
            ...prev,
            sizes: [...prev.sizes, { size: '', price: '', stock: '' }]
        }));
    };

    const removeSize = (index) => {
        if (formData.sizes.length > 1) {
            setFormData(prev => ({
                ...prev,
                sizes: prev.sizes.filter((_, i) => i !== index)
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const productData = {
            ...formData,
            sizes: formData.sizes.map(s => ({
                size: s.size,
                price: parseFloat(s.price),
                stock: parseInt(s.stock)
            })),
            compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : 0,
            images: formData.imageUrl ? [formData.imageUrl] : [],
            colors: [],
        };

        onSubmit(productData);
    };

    const categories = [
        { value: 'summer', label: 'Summer', icon: 'Sun' },
        { value: 'winter', label: 'Winter', icon: 'Snowflake' },
        { value: 'party', label: 'Party', icon: 'PartyPopper' },
        { value: 'casual', label: 'Casual', icon: 'Shirt' },
        { value: 'ethnic', label: 'Ethnic', icon: 'Palette' },
        { value: 'formal', label: 'Formal', icon: 'Briefcase' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2 flex items-center gap-2">
                                {mode === 'create' ? <><Sparkles className="w-8 h-8" /> Add New Product</> : <><Edit className="w-8 h-8" /> Edit Product</>}
                            </h1>
                            <p className="text-slate-600">
                                {mode === 'create' ? 'Create a new product in your catalog' : 'Update product details'}
                            </p>
                        </div>
                        <Link href="/admin/products">
                            <Button variant="outline" className="hover:bg-slate-100">
                                ← Back to Products
                            </Button>
                        </Link>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <FileText className="w-5 h-5" /> Basic Information
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Title */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <Tag className="w-4 h-4" /> Product Title
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        placeholder="Enter product title..."
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        value={formData.title}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Slug */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <LinkIcon className="w-4 h-4" /> URL Slug
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="slug"
                                        required
                                        placeholder="product-url-slug"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        value={formData.slug}
                                        onChange={handleChange}
                                    />
                                    <p className="text-xs text-slate-500">Use lowercase letters and hyphens only</p>
                                </div>

                                {/* Description */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <FileType className="w-4 h-4" /> Description
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="description"
                                        required
                                        rows="5"
                                        placeholder="Describe your product in detail..."
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Size Variants Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Package className="w-5 h-5" /> Size Variants & Pricing
                            </h2>
                            <p className="text-sm text-slate-600 mt-1">Add sizes with individual pricing and stock levels</p>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {formData.sizes.map((sizeVariant, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border-2 border-slate-200">
                                        {/* Size */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                <Tag className="w-4 h-4" /> Size
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                required
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                value={sizeVariant.size}
                                                onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                                            >
                                                <option value="">Select...</option>
                                                <option value="XS">XS</option>
                                                <option value="S">S</option>
                                                <option value="M">M</option>
                                                <option value="L">L</option>
                                                <option value="XL">XL</option>
                                                <option value="XXL">XXL</option>
                                            </select>
                                        </div>

                                        {/* Price */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                <IndianRupee className="w-4 h-4" /> Price (₹)
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                                                <input
                                                    type="number"
                                                    required
                                                    min="0"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                    value={sizeVariant.price}
                                                    onChange={(e) => handleSizeChange(index, 'price', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Stock */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                <Package className="w-4 h-4" /> Stock
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                placeholder="0"
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                value={sizeVariant.stock}
                                                onChange={(e) => handleSizeChange(index, 'stock', e.target.value)}
                                            />
                                        </div>

                                        {/* Remove Button */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 opacity-0">Action</label>
                                            <button
                                                type="button"
                                                onClick={() => removeSize(index)}
                                                disabled={formData.sizes.length === 1}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                                            >
                                                <X className="w-4 h-4 inline" /> Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* Add Size Button */}
                                <button
                                    type="button"
                                    onClick={addSize}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-green-300 bg-green-50 text-green-700 hover:bg-green-100 transition-all font-semibold flex items-center justify-center gap-2"
                                >
                                    <Package className="w-4 h-4" /> Add Another Size
                                </button>

                                {/* Compare at Price */}
                                <div className="pt-4 border-t border-slate-200">
                                    <div className="space-y-2 max-w-xs">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                            <Tag className="w-4 h-4" /> Compare at Price (₹)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                                            <input
                                                type="number"
                                                name="compareAtPrice"
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                value={formData.compareAtPrice}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500">Original price for discount display (optional)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Category & Media Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Palette className="w-5 h-5" /> Category & Media
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-6">
                                {/* Category */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <Folder className="w-4 h-4" /> Category
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="category"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                                        value={formData.category}
                                        onChange={handleChange}
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 1rem center',
                                            backgroundSize: '1.5em 1.5em',
                                            paddingRight: '3rem'
                                        }}
                                    >
                                        <option value="">Select a category...</option>
                                        {categories.map(cat => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Image URL */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <Image className="w-4 h-4" /> Product Image URL
                                    </label>
                                    <input
                                        type="url"
                                        name="imageUrl"
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        value={formData.imageUrl}
                                        onChange={handleChange}
                                    />

                                    {/* Image Preview */}
                                    {formData.imageUrl && (
                                        <div className="mt-4 p-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                                            <p className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                                                <Eye className="w-4 h-4" /> Preview:
                                            </p>
                                            <div className="relative inline-block">
                                                <img
                                                    src={formData.imageUrl}
                                                    alt="Product Preview"
                                                    className="h-48 w-auto object-cover rounded-lg border-2 border-slate-200 shadow-lg"
                                                />
                                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                                    <Check className="w-4 h-4 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Settings Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Settings className="w-5 h-5" /> Additional Settings
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="flex items-start space-x-4">
                                <div className="flex items-center h-12">
                                    <input
                                        type="checkbox"
                                        id="featured"
                                        name="featured"
                                        className="w-5 h-5 rounded-lg border-2 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer transition-all"
                                        checked={formData.featured}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="featured" className="font-semibold text-slate-900 cursor-pointer flex items-center gap-2">
                                        <Star className="w-4 h-4" /> Featured Product
                                    </label>
                                    <p className="text-sm text-slate-600 mt-1">
                                        Featured products will be displayed prominently on the homepage and in special sections
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <div className="flex flex-col sm:flex-row justify-end gap-4">
                            <Link href="/admin/products" className="sm:order-1">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full sm:w-auto hover:bg-slate-100 border-2"
                                >
                                    <X className="w-4 h-4 inline" /> Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                loading={isSubmitting}
                                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 border-0 shadow-lg hover:shadow-xl transition-all sm:order-2"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 animate-spin" /> Processing...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        {mode === 'create' ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                        {mode === 'create' ? 'Create Product' : 'Update Product'}
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}