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
        price: {
            type: Number,
            required: [true, 'Please provide a price'],
            min: 0,
        },
        compareAtPrice: {
            type: Number,
            min: 0,
        },
        sizes: [
            {
                type: String,
                enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            },
        ],
        colors: [
            {
                name: String,
                hex: String,
            },
        ],
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
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
