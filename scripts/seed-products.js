const mongoose = require('mongoose');

// MongoDB connection string from .env.local
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://selvaprogrammer_db_user:l1RJV2liAARpxZiM@cluster0.6xv7ale.mongodb.net/?appName=Cluster0';

// Product schema
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

const products = [
    // CASUAL CATEGORY (5 products)
    {
        title: "Cotton Casual Midi Dress",
        slug: "cotton-casual-midi-dress",
        description: "Comfortable cotton midi dress perfect for everyday wear. Features a relaxed fit and breathable fabric ideal for warm weather.",
        category: "casual",
        sizes: [
            { size: "S", price: 1299, stock: 15 },
            { size: "M", price: 1299, stock: 20 },
            { size: "L", price: 1399, stock: 18 },
            { size: "XL", price: 1499, stock: 12 }
        ],
        compareAtPrice: 2199,
        images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800"],
        featured: true,
        tags: ["cotton", "midi", "comfortable"]
    },
    {
        title: "Denim Shirt Dress",
        slug: "denim-shirt-dress",
        description: "Classic denim shirt dress with button-down front and belt. Versatile piece that can be dressed up or down.",
        category: "casual",
        sizes: [
            { size: "XS", price: 1599, stock: 10 },
            { size: "S", price: 1599, stock: 15 },
            { size: "M", price: 1699, stock: 20 },
            { size: "L", price: 1799, stock: 15 },
            { size: "XL", price: 1899, stock: 10 }
        ],
        compareAtPrice: 2999,
        images: ["https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800"],
        featured: false,
        tags: ["denim", "shirt-dress", "belt"]
    },
    {
        title: "Striped T-Shirt Dress",
        slug: "striped-tshirt-dress",
        description: "Relaxed fit striped t-shirt dress. Perfect for casual outings and weekend brunches.",
        category: "casual",
        sizes: [
            { size: "S", price: 999, stock: 25 },
            { size: "M", price: 999, stock: 30 },
            { size: "L", price: 1099, stock: 20 },
            { size: "XL", price: 1199, stock: 15 }
        ],
        compareAtPrice: 1799,
        images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800"],
        featured: false,
        tags: ["striped", "tshirt", "relaxed"]
    },
    {
        title: "Linen Blend Casual Dress",
        slug: "linen-blend-casual-dress",
        description: "Breathable linen blend dress with a loose silhouette. Ideal for hot summer days.",
        category: "casual",
        sizes: [
            { size: "S", price: 1499, stock: 12 },
            { size: "M", price: 1599, stock: 18 },
            { size: "L", price: 1699, stock: 15 },
            { size: "XL", price: 1799, stock: 10 }
        ],
        compareAtPrice: 2499,
        images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800"],
        featured: false,
        tags: ["linen", "breathable", "summer"]
    },
    {
        title: "Jersey Wrap Dress",
        slug: "jersey-wrap-dress",
        description: "Soft jersey wrap dress with adjustable tie waist. Flattering fit for all body types.",
        category: "casual",
        sizes: [
            { size: "XS", price: 1399, stock: 8 },
            { size: "S", price: 1399, stock: 15 },
            { size: "M", price: 1499, stock: 20 },
            { size: "L", price: 1599, stock: 12 },
            { size: "XL", price: 1699, stock: 8 }
        ],
        compareAtPrice: 2299,
        images: ["https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800"],
        featured: true,
        tags: ["jersey", "wrap", "adjustable"]
    },

    // FORMAL CATEGORY (5 products)
    {
        title: "Black Pencil Dress",
        slug: "black-pencil-dress",
        description: "Elegant black pencil dress perfect for office wear and formal events. Features a sleek silhouette and quality fabric.",
        category: "formal",
        sizes: [
            { size: "XS", price: 2499, stock: 10 },
            { size: "S", price: 2499, stock: 15 },
            { size: "M", price: 2599, stock: 20 },
            { size: "L", price: 2699, stock: 12 },
            { size: "XL", price: 2799, stock: 8 }
        ],
        compareAtPrice: 3999,
        images: ["https://images.unsplash.com/photo-1566206091558-7f218b696731?w=800"],
        featured: true,
        tags: ["black", "pencil", "office"]
    },
    {
        title: "Navy Blue Blazer Dress",
        slug: "navy-blue-blazer-dress",
        description: "Professional blazer-style dress in navy blue. Double-breasted design with gold buttons.",
        category: "formal",
        sizes: [
            { size: "S", price: 2799, stock: 12 },
            { size: "M", price: 2899, stock: 18 },
            { size: "L", price: 2999, stock: 15 },
            { size: "XL", price: 3099, stock: 10 }
        ],
        compareAtPrice: 4499,
        images: ["https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800"],
        featured: false,
        tags: ["navy", "blazer", "professional"]
    },
    {
        title: "Burgundy Sheath Dress",
        slug: "burgundy-sheath-dress",
        description: "Sophisticated burgundy sheath dress with three-quarter sleeves. Perfect for business meetings.",
        category: "formal",
        sizes: [
            { size: "XS", price: 2299, stock: 8 },
            { size: "S", price: 2299, stock: 15 },
            { size: "M", price: 2399, stock: 20 },
            { size: "L", price: 2499, stock: 15 },
            { size: "XL", price: 2599, stock: 10 }
        ],
        compareAtPrice: 3699,
        images: ["https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=800"],
        featured: false,
        tags: ["burgundy", "sheath", "sleeves"]
    },
    {
        title: "Charcoal Grey Midi Dress",
        slug: "charcoal-grey-midi-dress",
        description: "Classic charcoal grey midi dress with belt detail. Timeless piece for your work wardrobe.",
        category: "formal",
        sizes: [
            { size: "S", price: 2599, stock: 12 },
            { size: "M", price: 2699, stock: 18 },
            { size: "L", price: 2799, stock: 15 },
            { size: "XL", price: 2899, stock: 10 }
        ],
        compareAtPrice: 4199,
        images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800"],
        featured: true,
        tags: ["grey", "midi", "belt"]
    },
    {
        title: "White Collar Shift Dress",
        slug: "white-collar-shift-dress",
        description: "Crisp white shift dress with collar and button details. Professional yet stylish.",
        category: "formal",
        sizes: [
            { size: "XS", price: 2199, stock: 10 },
            { size: "S", price: 2199, stock: 15 },
            { size: "M", price: 2299, stock: 20 },
            { size: "L", price: 2399, stock: 12 }
        ],
        compareAtPrice: 3499,
        images: ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800"],
        featured: false,
        tags: ["white", "collar", "shift"]
    },

    // PARTY CATEGORY (5 products)
    {
        title: "Sequin Mini Dress",
        slug: "sequin-mini-dress",
        description: "Dazzling sequin mini dress perfect for parties and celebrations. Fully lined with comfortable fit.",
        category: "party",
        sizes: [
            { size: "XS", price: 3299, stock: 8 },
            { size: "S", price: 3299, stock: 12 },
            { size: "M", price: 3399, stock: 15 },
            { size: "L", price: 3499, stock: 10 }
        ],
        compareAtPrice: 5499,
        images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800"],
        featured: true,
        tags: ["sequin", "mini", "sparkle"]
    },
    {
        title: "Red Cocktail Dress",
        slug: "red-cocktail-dress",
        description: "Stunning red cocktail dress with sweetheart neckline. Perfect for evening events and parties.",
        category: "party",
        sizes: [
            { size: "XS", price: 2999, stock: 10 },
            { size: "S", price: 2999, stock: 15 },
            { size: "M", price: 3099, stock: 18 },
            { size: "L", price: 3199, stock: 12 },
            { size: "XL", price: 3299, stock: 8 }
        ],
        compareAtPrice: 4999,
        images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800"],
        featured: true,
        tags: ["red", "cocktail", "sweetheart"]
    },
    {
        title: "Black Velvet Party Dress",
        slug: "black-velvet-party-dress",
        description: "Luxurious black velvet dress with off-shoulder design. Elegant choice for special occasions.",
        category: "party",
        sizes: [
            { size: "S", price: 3499, stock: 10 },
            { size: "M", price: 3599, stock: 15 },
            { size: "L", price: 3699, stock: 12 },
            { size: "XL", price: 3799, stock: 8 }
        ],
        compareAtPrice: 5999,
        images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800"],
        featured: false,
        tags: ["velvet", "off-shoulder", "luxury"]
    },
    {
        title: "Gold Metallic Bodycon Dress",
        slug: "gold-metallic-bodycon-dress",
        description: "Eye-catching gold metallic bodycon dress. Stand out at any party with this stunning piece.",
        category: "party",
        sizes: [
            { size: "XS", price: 2799, stock: 8 },
            { size: "S", price: 2799, stock: 12 },
            { size: "M", price: 2899, stock: 15 },
            { size: "L", price: 2999, stock: 10 }
        ],
        compareAtPrice: 4499,
        images: ["https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800"],
        featured: false,
        tags: ["gold", "metallic", "bodycon"]
    },
    {
        title: "Emerald Satin Slip Dress",
        slug: "emerald-satin-slip-dress",
        description: "Elegant emerald green satin slip dress. Sophisticated and sexy for evening wear.",
        category: "party",
        sizes: [
            { size: "XS", price: 2599, stock: 10 },
            { size: "S", price: 2599, stock: 15 },
            { size: "M", price: 2699, stock: 18 },
            { size: "L", price: 2799, stock: 12 }
        ],
        compareAtPrice: 4199,
        images: ["https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800"],
        featured: true,
        tags: ["emerald", "satin", "slip"]
    },

    // ETHNIC CATEGORY (5 products)
    {
        title: "Floral Anarkali Dress",
        slug: "floral-anarkali-dress",
        description: "Beautiful floral print Anarkali dress with intricate embroidery. Perfect for festive occasions.",
        category: "ethnic",
        sizes: [
            { size: "S", price: 2999, stock: 12 },
            { size: "M", price: 3099, stock: 18 },
            { size: "L", price: 3199, stock: 15 },
            { size: "XL", price: 3299, stock: 10 },
            { size: "XXL", price: 3399, stock: 8 }
        ],
        compareAtPrice: 4999,
        images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800"],
        featured: true,
        tags: ["anarkali", "floral", "embroidery"]
    },
    {
        title: "Silk Saree Gown",
        slug: "silk-saree-gown",
        description: "Fusion silk saree gown with traditional draping and modern silhouette. Best of both worlds.",
        category: "ethnic",
        sizes: [
            { size: "S", price: 3499, stock: 10 },
            { size: "M", price: 3599, stock: 15 },
            { size: "L", price: 3699, stock: 12 },
            { size: "XL", price: 3799, stock: 8 }
        ],
        compareAtPrice: 5999,
        images: ["https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800"],
        featured: false,
        tags: ["silk", "saree", "fusion"]
    },
    {
        title: "Embroidered Kurti Dress",
        slug: "embroidered-kurti-dress",
        description: "Long embroidered kurti dress with mirror work. Comfortable yet elegant ethnic wear.",
        category: "ethnic",
        sizes: [
            { size: "S", price: 1999, stock: 15 },
            { size: "M", price: 2099, stock: 20 },
            { size: "L", price: 2199, stock: 18 },
            { size: "XL", price: 2299, stock: 12 },
            { size: "XXL", price: 2399, stock: 10 }
        ],
        compareAtPrice: 3499,
        images: ["https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800"],
        featured: false,
        tags: ["kurti", "embroidered", "mirror-work"]
    },
    {
        title: "Bandhani Print Maxi Dress",
        slug: "bandhani-print-maxi-dress",
        description: "Traditional Bandhani print maxi dress in vibrant colors. Perfect for cultural events.",
        category: "ethnic",
        sizes: [
            { size: "S", price: 2499, stock: 12 },
            { size: "M", price: 2599, stock: 18 },
            { size: "L", price: 2699, stock: 15 },
            { size: "XL", price: 2799, stock: 10 }
        ],
        compareAtPrice: 3999,
        images: ["https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800"],
        featured: true,
        tags: ["bandhani", "maxi", "traditional"]
    },
    {
        title: "Lehenga Style Dress",
        slug: "lehenga-style-dress",
        description: "Modern lehenga-style dress with crop top and flared skirt. Perfect for weddings and celebrations.",
        category: "ethnic",
        sizes: [
            { size: "XS", price: 3999, stock: 8 },
            { size: "S", price: 3999, stock: 12 },
            { size: "M", price: 4099, stock: 15 },
            { size: "L", price: 4199, stock: 10 },
            { size: "XL", price: 4299, stock: 8 }
        ],
        compareAtPrice: 6999,
        images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800"],
        featured: true,
        tags: ["lehenga", "wedding", "crop-top"]
    },

    // SUMMER CATEGORY (5 products)
    {
        title: "Tropical Print Sundress",
        slug: "tropical-print-sundress",
        description: "Breezy tropical print sundress with adjustable straps. Perfect for beach vacations.",
        category: "summer",
        sizes: [
            { size: "XS", price: 1299, stock: 15 },
            { size: "S", price: 1299, stock: 20 },
            { size: "M", price: 1399, stock: 25 },
            { size: "L", price: 1499, stock: 18 },
            { size: "XL", price: 1599, stock: 12 }
        ],
        compareAtPrice: 2299,
        images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800"],
        featured: true,
        tags: ["tropical", "sundress", "beach"]
    },
    {
        title: "White Linen Maxi Dress",
        slug: "white-linen-maxi-dress",
        description: "Elegant white linen maxi dress with button-down front. Lightweight and breathable.",
        category: "summer",
        sizes: [
            { size: "S", price: 1799, stock: 15 },
            { size: "M", price: 1899, stock: 20 },
            { size: "L", price: 1999, stock: 15 },
            { size: "XL", price: 2099, stock: 10 }
        ],
        compareAtPrice: 2999,
        images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800"],
        featured: false,
        tags: ["linen", "maxi", "white"]
    },
    {
        title: "Floral Off-Shoulder Dress",
        slug: "floral-off-shoulder-dress",
        description: "Romantic floral off-shoulder dress with ruffle details. Perfect for summer parties.",
        category: "summer",
        sizes: [
            { size: "XS", price: 1599, stock: 12 },
            { size: "S", price: 1599, stock: 18 },
            { size: "M", price: 1699, stock: 20 },
            { size: "L", price: 1799, stock: 15 }
        ],
        compareAtPrice: 2699,
        images: ["https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800"],
        featured: true,
        tags: ["floral", "off-shoulder", "ruffle"]
    },
    {
        title: "Chambray Shirt Dress",
        slug: "chambray-shirt-dress",
        description: "Light chambray shirt dress with roll-up sleeves. Versatile summer essential.",
        category: "summer",
        sizes: [
            { size: "S", price: 1499, stock: 15 },
            { size: "M", price: 1599, stock: 20 },
            { size: "L", price: 1699, stock: 18 },
            { size: "XL", price: 1799, stock: 12 }
        ],
        compareAtPrice: 2499,
        images: ["https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800"],
        featured: false,
        tags: ["chambray", "shirt-dress", "versatile"]
    },
    {
        title: "Yellow Wrap Sundress",
        slug: "yellow-wrap-sundress",
        description: "Cheerful yellow wrap sundress with tie waist. Bright and beautiful for sunny days.",
        category: "summer",
        sizes: [
            { size: "XS", price: 1399, stock: 10 },
            { size: "S", price: 1399, stock: 15 },
            { size: "M", price: 1499, stock: 20 },
            { size: "L", price: 1599, stock: 15 },
            { size: "XL", price: 1699, stock: 10 }
        ],
        compareAtPrice: 2399,
        images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800"],
        featured: false,
        tags: ["yellow", "wrap", "cheerful"]
    },

    // WINTER CATEGORY (5 products)
    {
        title: "Burgundy Sweater Dress",
        slug: "burgundy-sweater-dress",
        description: "Cozy burgundy sweater dress with turtleneck. Perfect for cold weather styling.",
        category: "winter",
        sizes: [
            { size: "S", price: 2299, stock: 15 },
            { size: "M", price: 2399, stock: 20 },
            { size: "L", price: 2499, stock: 18 },
            { size: "XL", price: 2599, stock: 12 }
        ],
        compareAtPrice: 3699,
        images: ["https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=800"],
        featured: true,
        tags: ["sweater", "turtleneck", "cozy"]
    },
    {
        title: "Black Wool Blend Dress",
        slug: "black-wool-blend-dress",
        description: "Elegant black wool blend dress with long sleeves. Warm and sophisticated.",
        category: "winter",
        sizes: [
            { size: "XS", price: 2599, stock: 10 },
            { size: "S", price: 2599, stock: 15 },
            { size: "M", price: 2699, stock: 18 },
            { size: "L", price: 2799, stock: 12 },
            { size: "XL", price: 2899, stock: 8 }
        ],
        compareAtPrice: 4299,
        images: ["https://images.unsplash.com/photo-1566206091558-7f218b696731?w=800"],
        featured: false,
        tags: ["wool", "black", "long-sleeve"]
    },
    {
        title: "Plaid Midi Dress",
        slug: "plaid-midi-dress",
        description: "Classic plaid midi dress in warm tones. Perfect for autumn and winter styling.",
        category: "winter",
        sizes: [
            { size: "S", price: 1999, stock: 15 },
            { size: "M", price: 2099, stock: 20 },
            { size: "L", price: 2199, stock: 15 },
            { size: "XL", price: 2299, stock: 10 }
        ],
        compareAtPrice: 3299,
        images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800"],
        featured: false,
        tags: ["plaid", "midi", "autumn"]
    },
    {
        title: "Knit Turtleneck Dress",
        slug: "knit-turtleneck-dress",
        description: "Soft knit turtleneck dress in neutral beige. Comfortable and warm for winter days.",
        category: "winter",
        sizes: [
            { size: "XS", price: 2199, stock: 10 },
            { size: "S", price: 2199, stock: 15 },
            { size: "M", price: 2299, stock: 20 },
            { size: "L", price: 2399, stock: 15 },
            { size: "XL", price: 2499, stock: 10 }
        ],
        compareAtPrice: 3599,
        images: ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800"],
        featured: true,
        tags: ["knit", "turtleneck", "beige"]
    },
    {
        title: "Corduroy Shirt Dress",
        slug: "corduroy-shirt-dress",
        description: "Trendy corduroy shirt dress with pockets. Retro-inspired winter essential.",
        category: "winter",
        sizes: [
            { size: "S", price: 1899, stock: 12 },
            { size: "M", price: 1999, stock: 18 },
            { size: "L", price: 2099, stock: 15 },
            { size: "XL", price: 2199, stock: 10 }
        ],
        compareAtPrice: 3199,
        images: ["https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800"],
        featured: false,
        tags: ["corduroy", "pockets", "retro"]
    }
];

async function seedProducts() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✓ MongoDB connected successfully\n');

        const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

        console.log(`Adding ${products.length} products to database...\n`);

        let added = 0;
        let skipped = 0;

        for (const productData of products) {
            const existing = await Product.findOne({ slug: productData.slug });

            if (existing) {
                console.log(`⊘ Skipping "${productData.title}" - already exists`);
                skipped++;
                continue;
            }

            await Product.create({
                _id: new mongoose.Types.ObjectId().toString(),
                ...productData
            });

            console.log(`✓ Added "${productData.title}" (${productData.category})`);
            added++;
        }

        console.log(`\n✓ Seeding completed!`);
        console.log(`  - Added: ${added} products`);
        console.log(`  - Skipped: ${skipped} products`);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('✗ Seeding error:', error);
        process.exit(1);
    }
}

seedProducts();
