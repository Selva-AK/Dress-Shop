import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Define Product schema inline to avoid import issues
const ProductSchema = new mongoose.Schema({
    _id: String,
    title: String,
    description: String,
    slug: String,
    sizes: [{
        size: String,
        price: Number,
        stock: Number
    }],
    compareAtPrice: Number,
    colors: [{
        name: String,
        hex: String
    }],
    images: [String],
    category: String,
    tags: [String],
    featured: Boolean
}, { timestamps: true, strict: false });

// Migration function
async function migrateProducts() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ MongoDB connected successfully\n');

        // Get or create Product model
        const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

        // Find all products
        const products = await Product.find({}).lean();
        console.log(`Found ${products.length} products to check for migration\n`);

        let migrated = 0;
        let skipped = 0;

        for (const product of products) {
            // Check if product already has new size structure
            if (product.sizes && product.sizes.length > 0 && product.sizes[0].price !== undefined) {
                console.log(`⊘ Skipping "${product.title}" - already migrated`);
                skipped++;
                continue;
            }

            // Get the old price and stock values
            const oldPrice = product.price || 29.99;
            const oldStock = product.stock || 10;
            const oldSizes = product.sizes || [];

            // Create default size variants
            const defaultSizes = ['S', 'M', 'L'];
            const newSizes = defaultSizes.map(size => ({
                size: size,
                price: oldPrice,
                stock: Math.floor(oldStock / defaultSizes.length),
            }));

            // If product had specific sizes, use those instead
            if (oldSizes.length > 0 && typeof oldSizes[0] === 'string') {
                newSizes.length = 0; // Clear default sizes
                oldSizes.forEach(size => {
                    newSizes.push({
                        size: size,
                        price: oldPrice,
                        stock: Math.floor(oldStock / oldSizes.length),
                    });
                });
            }

            // Update the product using updateOne to avoid validation issues
            await mongoose.connection.collection('products').updateOne(
                { _id: product._id },
                {
                    $set: { sizes: newSizes },
                    $unset: { price: '', stock: '' }
                }
            );

            console.log(`✓ Migrated "${product.title}" with ${newSizes.length} size variants`);
            migrated++;
        }

        console.log(`\n✓ Migration completed!`);
        console.log(`  - Migrated: ${migrated} products`);
        console.log(`  - Skipped: ${skipped} products`);
        console.log(`\nNote: Please review and adjust individual size prices through the admin panel.`);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('✗ Migration error:', error);
        process.exit(1);
    }
}

// Run migration
migrateProducts();
