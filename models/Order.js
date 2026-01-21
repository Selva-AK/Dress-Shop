import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
            default: function () {
                const date = new Date();
                const timestamp = date.getTime();
                const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
                return `ORD${timestamp}${random}`;
            },
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        products: [
            {
                productId: {
                    type: String,
                    ref: 'Product',
                    required: true,
                },
                title: String,
                image: String,
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                size: String,
                color: String,
                price: {
                    type: Number,
                    required: true,
                },
            },
        ],
        shippingAddress: {
            fullName: {
                type: String,
                required: true,
            },
            phone: {
                type: String,
                required: true,
            },
            addressLine1: {
                type: String,
                required: true,
            },
            addressLine2: String,
            city: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
            pincode: {
                type: String,
                required: true,
            },
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        paymentMethod: {
            type: String,
            enum: ['COD'],
            default: 'COD',
        },
        status: {
            type: String,
            enum: ['pending', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
OrderSchema.index({ userId: 1, createdAt: -1 });
// Order number index is already defined with unique: true
OrderSchema.index({ status: 1 });



export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
