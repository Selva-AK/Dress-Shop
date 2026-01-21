import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { isAdmin } from '@/lib/auth';

// GET /api/products/[id] - Public endpoint (supports ID or slug)
export async function GET(request, { params }) {
    try {
        await dbConnect();

        const { id } = await params;

        // Try to find by ID or slug
        const product = await Product.findOne({
            $or: [{ _id: id }, { slug: id }],
        });

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ product });
    } catch (error) {
        console.error('Get product error:', error);
        return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500 }
        );
    }
}

// PUT /api/products/[id] - Admin only
export async function PUT(request, { params }) {
    try {
        if (!await isAdmin()) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const { id } = await params;
        const data = await request.json();

        await dbConnect();

        const product = await Product.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Product updated successfully',
            product,
        });
    } catch (error) {
        console.error('Update product error:', error);
        return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500 }
        );
    }
}

// DELETE /api/products/[id] - Admin only
export async function DELETE(request, { params }) {
    try {
        if (!await isAdmin()) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const { id } = await params;

        await dbConnect();

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Product deleted successfully',
        });
    } catch (error) {
        console.error('Delete product error:', error);
        return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500 }
        );
    }
}
