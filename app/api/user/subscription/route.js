import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const subscription = await request.json();

        await dbConnect();

        await User.findOneAndUpdate(
            { email: user.email },
            { pushSubscription: subscription },
            { new: true }
        );

        return NextResponse.json({ message: 'Subscription saved successfully' });
    } catch (error) {
        console.error('Subscription error:', error);
        return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
    }
}
