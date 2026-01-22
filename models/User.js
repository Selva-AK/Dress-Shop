import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 6,
            select: false, // Don't include password by default in queries
        },
        role: {
            type: String,
            enum: ['customer', 'admin'],
            default: 'customer',
        },
        addresses: [
            {
                fullName: String,
                phone: String,
                addressLine1: String,
                addressLine2: String,
                city: String,
                state: String,
                pincode: String,
                isDefault: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
        cart: [
            {
                product: {
                    type: String,
                    ref: 'Product',
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
                size: String,
                color: String,
                title: String,
                price: Number,
                image: String,
            }
        ],
        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            }
        ],
        pushSubscription: {
            endpoint: String,
            keys: {
                p256dh: String,
                auth: String,
            },
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
// Email index is already defined with unique: true

export default mongoose.models.User || mongoose.model('User', UserSchema);
