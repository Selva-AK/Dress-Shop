import dbConnect from './db.js';
import User from '../models/User.js';
import { hashPassword } from './auth.js';

let isInitialized = false;

export async function initializeDatabase() {
    // Prevent multiple initializations
    if (isInitialized) {
        return;
    }

    try {
        await dbConnect();

        // Check if admin user exists
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@dressstore.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            console.log('🔧 Initializing database...');

            // Create admin user
            const adminPassword = await hashPassword(process.env.ADMIN_PASSWORD || 'admin123');
            await User.create({
                name: 'Admin User',
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
            });

            console.log(`✓ Created admin user: ${adminEmail}`);
            console.log('✓ Database initialized successfully!');
        }

        isInitialized = true;
    } catch (error) {
        console.error('✗ Database initialization error:', error.message);
    }
}

// Auto-initialize on import
if (process.env.NODE_ENV !== 'production') {
    initializeDatabase().catch(console.error);
}
