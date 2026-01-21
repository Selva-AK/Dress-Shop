import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { getCurrentUser, isAdmin } from '@/lib/auth';


// GET /api/orders - Get orders (customers see their own, admins see all)
export async function GET(request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        let query = {};
        if (user.role !== 'admin') {
            query.userId = user.userId;
        }

        const orders = await Order.find(query)
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .lean();

        console.log(`Fetched ${orders.length} orders for user ${user.userId}`);

        return NextResponse.json({
            orders: JSON.parse(JSON.stringify(orders))
        });
    } catch (error) {
        console.error('Get orders error:', error);

        return NextResponse.json({ orders: [] });
    }
}

// POST /api/orders
export async function POST(request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { products, shippingAddress } = await request.json();

        if (!products || products.length === 0) {
            return NextResponse.json(
                { error: 'Cart is empty' },
                { status: 400 }
            );
        }

        if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
            return NextResponse.json(
                { error: 'Complete shipping address is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Validate products and calculate total
        let totalAmount = 0;
        const orderProducts = [];

        for (const item of products) {
            const product = await Product.findById(item._id);

            if (!product) {
                console.error(`Product not found: ${item.title} (${item._id})`);
                return NextResponse.json(
                    { error: `Product ${item.title} no longer available` },
                    { status: 400 } // Use 400 for bad reference, distinct from 404 (endpoint not found)
                );
            }

            if (product.stock < item.quantity) {
                return NextResponse.json(
                    { error: `Insufficient stock for ${product.title}` },
                    { status: 400 }
                );
            }

            orderProducts.push({
                productId: product._id,
                title: product.title,
                image: product.images[0],
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                price: product.price,
            });

            totalAmount += product.price * item.quantity;

            // Reduce stock
            product.stock -= item.quantity;
            await product.save();
        }

        // Generate order number
        const date = new Date();
        const timestamp = date.getTime();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const orderNumber = `ORD${timestamp}${random}`;

        // Create order
        const order = await Order.create({
            orderNumber,
            userId: user.userId,
            products: orderProducts,
            shippingAddress,
            totalAmount,
            paymentMethod: 'COD',
            status: 'pending',
        });

        return NextResponse.json({
            message: 'Order placed successfully',
            order,
        });
    } catch (error) {
        console.error('Create order error:', error);
        return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500 }
        );
    }
}
