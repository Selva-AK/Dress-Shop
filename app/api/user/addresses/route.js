import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// POST - Add new address
export async function POST(request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { fullName, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = body;

        // Validate required fields
        if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
            return NextResponse.json(
                { error: 'All required fields must be provided' },
                { status: 400 }
            );
        }

        await dbConnect();

        const user = await User.findById(currentUser.userId);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // If this is set as default, unset all other defaults
        if (isDefault) {
            user.addresses.forEach(addr => {
                addr.isDefault = false;
            });
        }

        // If this is the first address, make it default
        const shouldBeDefault = isDefault || user.addresses.length === 0;

        // Add new address
        user.addresses.push({
            fullName,
            phone,
            addressLine1,
            addressLine2: addressLine2 || '',
            city,
            state,
            pincode,
            isDefault: shouldBeDefault,
        });

        await user.save();

        return NextResponse.json({
            message: 'Address added successfully',
            addresses: user.addresses,
        });
    } catch (error) {
        console.error('Add address error:', error);
        return NextResponse.json(
            { error: 'Failed to add address' },
            { status: 500 }
        );
    }
}

// PUT - Update existing address
export async function PUT(request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { addressId, fullName, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = body;

        if (!addressId) {
            return NextResponse.json(
                { error: 'Address ID is required' },
                { status: 400 }
            );
        }

        // Validate required fields
        if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
            return NextResponse.json(
                { error: 'All required fields must be provided' },
                { status: 400 }
            );
        }

        await dbConnect();

        const user = await User.findById(currentUser.userId);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const address = user.addresses.id(addressId);

        if (!address) {
            return NextResponse.json(
                { error: 'Address not found' },
                { status: 404 }
            );
        }

        // If setting as default, unset all other defaults
        if (isDefault) {
            user.addresses.forEach(addr => {
                addr.isDefault = false;
            });
        }

        // Update address
        address.fullName = fullName;
        address.phone = phone;
        address.addressLine1 = addressLine1;
        address.addressLine2 = addressLine2 || '';
        address.city = city;
        address.state = state;
        address.pincode = pincode;
        address.isDefault = isDefault;

        await user.save();

        return NextResponse.json({
            message: 'Address updated successfully',
            addresses: user.addresses,
        });
    } catch (error) {
        console.error('Update address error:', error);
        return NextResponse.json(
            { error: 'Failed to update address' },
            { status: 500 }
        );
    }
}

// DELETE - Remove address
export async function DELETE(request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const addressId = searchParams.get('addressId');

        if (!addressId) {
            return NextResponse.json(
                { error: 'Address ID is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        const user = await User.findById(currentUser.userId);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const address = user.addresses.id(addressId);

        if (!address) {
            return NextResponse.json(
                { error: 'Address not found' },
                { status: 404 }
            );
        }

        const wasDefault = address.isDefault;

        // Remove address
        user.addresses.pull(addressId);

        // If the deleted address was default and there are other addresses, make the first one default
        if (wasDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        await user.save();

        return NextResponse.json({
            message: 'Address deleted successfully',
            addresses: user.addresses,
        });
    } catch (error) {
        console.error('Delete address error:', error);
        return NextResponse.json(
            { error: 'Failed to delete address' },
            { status: 500 }
        );
    }
}

// PATCH - Set default address
export async function PATCH(request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { addressId } = body;

        if (!addressId) {
            return NextResponse.json(
                { error: 'Address ID is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        const user = await User.findById(currentUser.userId);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const address = user.addresses.id(addressId);

        if (!address) {
            return NextResponse.json(
                { error: 'Address not found' },
                { status: 404 }
            );
        }

        // Unset all defaults
        user.addresses.forEach(addr => {
            addr.isDefault = false;
        });

        // Set new default
        address.isDefault = true;

        await user.save();

        return NextResponse.json({
            message: 'Default address updated successfully',
            addresses: user.addresses,
        });
    } catch (error) {
        console.error('Set default address error:', error);
        return NextResponse.json(
            { error: 'Failed to set default address' },
            { status: 500 }
        );
    }
}
