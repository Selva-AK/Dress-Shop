import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findById(currentUser.userId).select('cart');

        return NextResponse.json({ cart: user.cart });
    } catch (error) {
        console.error('Fetch cart error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { cart } = await request.json();

        await dbConnect();

        // Validate cart items have size information and stock availability
        const Product = (await import('@/models/Product')).default;

        for (const item of cart) {
            if (!item.size) {
                return NextResponse.json(
                    { error: `Size is required for product: ${item.title}` },
                    { status: 400 }
                );
            }

            // Verify product exists and size is available
            const product = await Product.findById(item.product);
            if (product) {
                const sizeVariant = product.sizes.find(s => s.size === item.size);
                if (!sizeVariant) {
                    return NextResponse.json(
                        { error: `Size ${item.size} is not available for ${item.title}` },
                        { status: 400 }
                    );
                }

                // Check stock availability
                if (sizeVariant.stock < item.quantity) {
                    return NextResponse.json(
                        { error: `Insufficient stock for ${item.title} in size ${item.size}. Available: ${sizeVariant.stock}` },
                        { status: 400 }
                    );
                }

                // Update price to match the selected size
                item.price = sizeVariant.price;
            }
        }

        // Update user cart
        // We're doing a full replacement here because the client side handles the merging logic
        // before sending the 'final' cart state to the server.
        // Alternatively, we could implement complex merge logic here.
        // For simplicity and to match the "sync" behavior, we trust the client's latest state
        // assuming the client has already fetched server state and merged it.
        // However, a safer approach for "login sync" specifically might be needed.
        // Let's assume the provider strategy is:
        // 1. Login -> Fetch Server Cart -> Merge with Local -> Push merged to Server.

        const user = await User.findByIdAndUpdate(
            currentUser.userId,
            { cart: cart },
            { new: true }
        ).select('cart');

        return NextResponse.json({ cart: user.cart });
    } catch (error) {
        console.error('Update cart error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
