import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => new mongoose.Types.ObjectId().toString()
        },
        title: {
            type: String,
            required: [true, 'Please provide a product title'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please provide a product description'],
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        // Size variants with individual pricing and stock
        sizes: [
            {
                size: {
                    type: String,
                    required: true,
                    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0,
                },
                stock: {
                    type: Number,
                    required: true,
                    min: 0,
                    default: 0,
                },
            },
        ],
        compareAtPrice: {
            type: Number,
            min: 0,
        },
        colors: [
            {
                name: String,
                hex: String,
            },
        ],
        images: [
            {
                type: String, // Vercel Blob URLs
                required: true,
            },
        ],
        category: {
            type: String,
            required: true,
            enum: ['casual', 'formal', 'party', 'ethnic', 'western', 'summer', 'winter'],
        },
        tags: [String],
        featured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Virtual properties for price range
ProductSchema.virtual('minPrice').get(function () {
    if (!this.sizes || this.sizes.length === 0) return 0;
    return Math.min(...this.sizes.map(s => s.price));
});

ProductSchema.virtual('maxPrice').get(function () {
    if (!this.sizes || this.sizes.length === 0) return 0;
    return Math.max(...this.sizes.map(s => s.price));
});

ProductSchema.virtual('totalStock').get(function () {
    if (!this.sizes || this.sizes.length === 0) return 0;
    return this.sizes.reduce((total, s) => total + s.stock, 0);
});

// Ensure virtuals are included in JSON
ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

// Indexes
// Removed duplicate index for slug (defined by unique: true)
ProductSchema.index({ category: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ createdAt: -1 });

// Generate slug from title before saving
ProductSchema.pre('save', function () {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim();
    }
});

// Prevent duplicate model compilation and force schema update in dev
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.Product;
}

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
