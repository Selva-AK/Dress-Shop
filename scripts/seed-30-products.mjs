import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/e-commerce';

// Inline schema to avoid Next.js import issues in standalone script
const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    compareAtPrice: Number,
    sizes: [String],
    colors: [{ name: String, hex: String }],
    stock: { type: Number, required: true },
    images: [String],
    category: { type: String, required: true },
    featured: Boolean,
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const categories = ['casual', 'formal', 'party', 'ethnic', 'western', 'summer', 'winter'];
const sampleImages = [
    'https://placehold.co/600x800/3b82f6/white?text=Product',
    'https://placehold.co/600x800/ef4444/white?text=Dress',
    'https://placehold.co/600x800/10b981/white?text=Top',
    'https://placehold.co/600x800/f59e0b/white?text=Outfit',
    'https://placehold.co/600x800/8b5cf6/white?text=Fashion'
];

function generateSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function seed() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const products = [];
        for (let i = 1; i <= 30; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const title = `${category.charAt(0).toUpperCase() + category.slice(1)} Collection Item ${i}`;
            const price = Math.floor(Math.random() * 5000) + 500;

            products.push({
                title: title,
                slug: generateSlug(`${title}-${i}`),
                description: `This is a high-quality ${category} item perfect for any occasion. Features premium fabric and comfortable fit. Item #${i}.`,
                price: price,
                compareAtPrice: Math.random() > 0.5 ? price + Math.floor(Math.random() * 2000) : undefined,
                sizes: ['S', 'M', 'L', 'XL'],
                colors: [
                    { name: 'Black', hex: '#000000' },
                    { name: 'White', hex: '#ffffff' },
                    { name: 'Blue', hex: '#3b82f6' }
                ],
                stock: Math.floor(Math.random() * 100), // 0-99
                images: [sampleImages[Math.floor(Math.random() * sampleImages.length)]],
                category: category,
                featured: Math.random() > 0.8 // 20% chance
            });
        }

        console.log(`Inserting ${products.length} products...`);
        // Use insertMany with ordered: false to continue if duplicates exist (though slugs are unique)
        await Product.insertMany(products, { ordered: false });
        console.log('Successfully inserted 30 products!');

    } catch (error) {
        if (error.code === 11000) {
            console.log('Some products already existed (duplicate key error), but new ones were added.');
        } else {
            console.error('Error seeding products:', error);
        }
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
        process.exit(0);
    }
}

seed();
