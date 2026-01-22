import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User'; // Ensure User model is registered
import { getCurrentUser, isAdmin } from '@/lib/auth';

// GET /api/orders/[id]
export async function GET(request, { params }) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;

        await dbConnect();

        const order = await Order.findById(id).populate('userId', 'name email');

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Check authorization
        if (user.role !== 'admin' && order.userId?._id.toString() !== user.userId) {
            // Note: order.userId might be populated, so we check ._id
            // If population failed (e.g. user deleted), order.userId is null.
            // But if order.userId is null, we can't check ownership easily unless we store userId string separately or rely on it being present.
            // However, typical strict schema returns null if populated doc not found.
            // Let's assume for authorization check we might need the raw ID if population fails, 
            // but for now let's keep the logic safe.

            const orderUserId = order.userId?._id?.toString() || order.userId?.toString();

            if (orderUserId !== user.userId) {
                return NextResponse.json(
                    { error: 'Unauthorized' },
                    { status: 403 }
                );
            }
        }

        return NextResponse.json({ order });
    } catch (error) {
        console.error('Get order error:', error);
        return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500 }
        );
    }
}

// PUT /api/orders/[id] - Admin only (update status)
export async function PUT(request, { params }) {
    try {
        if (!await isAdmin()) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const { id } = await params;
        const { status } = await request.json();

        if (!status) {
            return NextResponse.json(
                { error: 'Status is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        ).populate('userId', 'name email');

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Send Push Notification
        try {
            const user = await User.findById(order.userId._id).select('pushSubscription');

            if (user && user.pushSubscription && user.pushSubscription.endpoint) {
                const webpush = require('web-push');

                webpush.setVapidDetails(
                    process.env.VAPID_SUBJECT || 'mailto:admin@dressshop.com',
                    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
                    process.env.VAPID_PRIVATE_KEY
                );

                const statusMessages = {
                    processing: '📦 Your order is being processed',
                    shipped: '🚚 Your order has been shipped!',
                    delivered: '✅ Your order has been delivered',
                    cancelled: '❌ Your order has been cancelled',
                };

                const message = statusMessages[status] || `Order status updated to ${status}`;

                const payload = JSON.stringify({
                    title: `Order #${id.slice(-6).toUpperCase()} Update`,
                    body: message,
                    icon: '/logo.png', // Ensure this exists or use absolute URL
                    url: `/orders`
                });

                await webpush.sendNotification(user.pushSubscription, payload);
                console.log(`Push notification sent to user ${user._id}`);
            }
        } catch (pushError) {
            console.error('Failed to send push notification:', pushError);
            // Don't fail the request if push fails
        }

        return NextResponse.json({
            message: 'Order status updated successfully',
            order,
        });
    } catch (error) {
        console.error('Update order error:', error);
        return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500 }
        );
    }
}
