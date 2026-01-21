import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { isAdmin } from '@/lib/auth';
import { mockProducts } from '@/lib/mockData';

// GET /api/products - Public endpoint
export async function GET(request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const featured = searchParams.get('featured');
        const search = searchParams.get('search');
        const limit = parseInt(searchParams.get('limit')) || 20;
        const page = parseInt(searchParams.get('page')) || 1;
        const skip = parseInt(searchParams.get('skip')) || ((page - 1) * limit);

        const query = {};
        if (category) query.category = category;
        if (featured) query.featured = featured === 'true';

        // Add search functionality
        if (search && search.trim()) {
            query.$or = [
                { title: { $regex: search.trim(), $options: 'i' } },
                { description: { $regex: search.trim(), $options: 'i' } },
                { category: { $regex: search.trim(), $options: 'i' } },
            ];
        }

        const products = await Product.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .lean();

        const total = await Product.countDocuments(query);

        // If no products in database, return mock data
        if (products.length === 0 && !search) {
            let filteredMockProducts = mockProducts;

            if (category) {
                filteredMockProducts = mockProducts.filter(p => p.category === category);
            }
            if (featured === 'true') {
                filteredMockProducts = filteredMockProducts.filter(p => p.featured === true);
            }

            return NextResponse.json({
                products: filteredMockProducts.slice(skip, skip + limit),
                total: filteredMockProducts.length,
                hasMore: (skip + limit) < filteredMockProducts.length,
            });
        }

        return NextResponse.json({
            products,
            total,
            hasMore: (skip + limit) < total,
        });
    } catch (error) {
        console.error('Get products error:', error);

        // On error, return mock data
        return NextResponse.json({
            products: mockProducts.slice(0, 20),
            total: mockProducts.length,
            hasMore: mockProducts.length > 20,
        });
    }
}

// POST /api/products - Admin only
export async function POST(request) {
    try {
        if (!await isAdmin()) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const data = await request.json();

        await dbConnect();

        const product = await Product.create(data);

        return NextResponse.json({
            message: 'Product created successfully',
            product,
        });
    } catch (error) {
        console.error('Create product error:', error);
        return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500 }
        );
    }
}
