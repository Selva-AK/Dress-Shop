import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/e-commerce';

// Inline schema
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
const imageMap = {
    casual: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
    formal: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400',
    party: 'https://placehold.co/600x800/000000/white?text=Party+Wear',
    ethnic: 'https://images.unsplash.com/photo-1583391733981-5aba2d5470e6?w=400',
    western: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400',
    summer: 'https://images.unsplash.com/photo-1589269216319-7648a4c5d42b?w=400',
    winter: 'https://placehold.co/600x800/8b5cf6/white?text=Winter+Coat',
};

function generateSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function seed() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        console.log('Clearing existing products to ensure clean slate...');
        await Product.deleteMany({});
        console.log('Cleared old products.');

        const products = [];
        let count = 0;

        for (const category of categories) {
            console.log(`Generating products for category: ${category}`);
            for (let i = 1; i <= 10; i++) {
                const title = `${category.charAt(0).toUpperCase() + category.slice(1)} Wear Item ${i}`;
                const price = Math.floor(Math.random() * 4000) + 1000;

                products.push({
                    title: title,
                    slug: generateSlug(`${title}-${count++}`), // Ensure unique slug
                    description: `Premium quality ${category} collection item. Perfect for style and comfort. Item number ${i} in ${category} series.`,
                    price: price,
                    compareAtPrice: price + Math.floor(Math.random() * 2000),
                    sizes: ['S', 'M', 'L', 'XL'],
                    colors: [
                        { name: 'Primary', hex: '#000000' },
                        { name: 'Secondary', hex: '#ffffff' }
                    ],
                    stock: Math.floor(Math.random() * 50) + 10,
                    images: [imageMap[category]],
                    category: category,
                    featured: i <= 2 // First 2 of each category are featured
                });
            }
        }

        console.log(`Inserting ${products.length} products...`);
        await Product.insertMany(products);
        console.log('Successfully inserted all products!');

    } catch (error) {
        console.error('Error seeding products:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
        process.exit(0);
    }
}

seed();
