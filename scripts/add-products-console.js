// Simple script to add products via API
// Run this in browser console when logged in as admin

const products = [
    // CASUAL
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
        featured: true
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
        featured: false
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
        featured: false
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
        featured: false
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
        featured: true
    }
];

// Function to add products
async function addProducts() {
    console.log(`Adding ${products.length} products...`);

    for (const product of products) {
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });

            if (response.ok) {
                console.log(`✓ Added: ${product.title}`);
            } else {
                const error = await response.json();
                console.log(`✗ Failed: ${product.title} - ${error.error}`);
            }
        } catch (error) {
            console.log(`✗ Error adding ${product.title}:`, error);
        }
    }

    console.log('Done!');
}

// Run it
addProducts();
