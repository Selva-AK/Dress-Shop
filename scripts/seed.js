import { seedDatabase } from '../lib/seed.js';

async function seed() {
    console.log('Starting database initialization...');
    await seedDatabase();
    process.exit(0);
}

seed();
