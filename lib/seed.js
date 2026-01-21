import dbConnect from './db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
    try {
        await dbConnect();

        // Check if data already exists
        const existingProducts = await Product.countDocuments();
        if (existingProducts > 0) {
            console.log('✓ Database already seeded');
            return;
        }

        console.log('🌱 Seeding database...');

        // Create admin user
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', salt);
        await User.create({
            name: 'Admin User',
            email: process.env.ADMIN_EMAIL || 'admin@dressstore.com',
            password: adminPassword,
            role: 'admin',
        });

        // Create sample products
        const products = [
            {
                title: 'Elegant Floral Summer Dress',
                slug: 'elegant-floral-summer-dress',
                description: 'Beautiful floral print dress perfect for summer occasions',
                price: 1299,
                compareAtPrice: 2499,
                images: ['https://placehold.co/600x800/3b82f6/white?text=Floral+Dress'],
                sizes: ['S', 'M', 'L', 'XL'],
                colors: [{ name: 'Blue', hex: '#3b82f6' }],
                stock: 50,
                category: 'summer',
                featured: true,
            },
            {
                title: 'Classic Black Evening Gown',
                slug: 'classic-black-evening-gown',
                description: 'Timeless black evening gown for special occasions',
                price: 2999,
                compareAtPrice: 4999,
                images: ['https://placehold.co/600x800/000000/white?text=Evening+Gown'],
                sizes: ['S', 'M', 'L'],
                colors: [{ name: 'Black', hex: '#000000' }],
                stock: 30,
                category: 'party',
                featured: true,
            },
            {
                title: 'Casual Denim Midi Dress',
                slug: 'casual-denim-midi-dress',
                description: 'Comfortable denim dress for everyday wear',
                price: 899,
                compareAtPrice: 1599,
                images: ['https://placehold.co/600x800/1e40af/white?text=Denim+Dress'],
                sizes: ['XS', 'S', 'M', 'L', 'XL'],
                colors: [{ name: 'Denim Blue', hex: '#1e40af' }],
                stock: 75,
                category: 'casual',
                featured: true,
            },
            {
                title: 'Red Cocktail Party Dress',
                slug: 'red-cocktail-party-dress',
                description: 'Stunning red dress perfect for cocktail parties',
                price: 1899,
                compareAtPrice: 3299,
                images: ['https://placehold.co/600x800/ef4444/white?text=Red+Dress'],
                sizes: ['S', 'M', 'L'],
                colors: [{ name: 'Red', hex: '#ef4444' }],
                stock: 40,
                category: 'party',
                featured: true,
            },
            {
                title: 'White Cotton Maxi Dress',
                slug: 'white-cotton-maxi-dress',
                description: 'Comfortable cotton maxi dress for any occasion',
                price: 1499,
                compareAtPrice: 2299,
                images: ['https://placehold.co/600x800/ffffff/333333?text=White+Maxi'],
                sizes: ['S', 'M', 'L', 'XL'],
                colors: [{ name: 'White', hex: '#ffffff' }],
                stock: 60,
                category: 'casual',
                featured: true,
            },
            {
                title: 'Ethnic Embroidered Anarkali',
                slug: 'ethnic-embroidered-anarkali',
                description: 'Traditional embroidered Anarkali dress',
                price: 2499,
                compareAtPrice: 4499,
                images: ['https://placehold.co/600x800/991b1b/white?text=Anarkali'],
                sizes: ['S', 'M', 'L', 'XL', 'XXL'],
                colors: [{ name: 'Maroon', hex: '#991b1b' }],
                stock: 35,
                category: 'ethnic',
                featured: true,
            },
        ];

        await Product.insertMany(products);

        console.log('✓ Database seeded successfully!');
        console.log(`  - Created admin user: ${process.env.ADMIN_EMAIL || 'admin@dressstore.com'}`);
        console.log(`  - Created ${products.length} products`);
    } catch (error) {
        console.error('✗ Error seeding database:', error);
    }
}
