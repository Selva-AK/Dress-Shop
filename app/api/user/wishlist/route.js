import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Product from '@/models/Product'; // Ensure Product model is registered

export async function GET() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findById(currentUser.userId)
            .select('wishlist')
            .populate('wishlist');

        return NextResponse.json({ wishlist: user.wishlist });
    } catch (error) {
        console.error('Fetch wishlist error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { wishlist } = await request.json();
        // wrapper for wishlist IDs array

        await dbConnect();

        // Ensure strictly saving ObjectIds
        const user = await User.findByIdAndUpdate(
            currentUser.userId,
            { wishlist: wishlist },
            { new: true }
        ).populate('wishlist');

        return NextResponse.json({ wishlist: user.wishlist });
    } catch (error) {
        console.error('Update wishlist error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
