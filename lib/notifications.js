// Native browser notification helper functions

const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
    }
};

const showNotification = ({ title, message, icon = '/logo.png', tag, onClick }) => {
    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(title, {
            body: message,
            icon,
            badge: icon,
            tag,
            vibrate: [200, 100, 200],
            requireInteraction: false,
        });

        if (onClick) {
            notification.onclick = onClick;
        }

        return notification;
    }
    return null;
};

// Order placed notification
export const notifyOrderPlaced = (orderNumber, total) => {
    return showNotification({
        title: '🎉 Order Placed Successfully!',
        message: `Order #${orderNumber} for ₹${total.toLocaleString()} has been confirmed. Thank you for shopping with us!`,
        tag: 'order-placed',
        onClick: () => {
            window.focus();
            window.location.href = '/orders';
        },
    });
};

// Order status update notification
export const notifyOrderStatusChange = (orderNumber, status) => {
    const statusMessages = {
        processing: '📦 Your order is being processed',
        shipped: '🚚 Your order has been shipped!',
        delivered: '✅ Your order has been delivered',
        cancelled: '❌ Your order has been cancelled',
    };

    return showNotification({
        title: `Order #${orderNumber} Update`,
        message: statusMessages[status] || `Order status updated to ${status}`,
        tag: `order-${orderNumber}`,
        onClick: () => {
            window.focus();
            window.location.href = '/orders';
        },
    });
};

// Cart reminder notification
export const notifyCartReminder = (itemCount) => {
    return showNotification({
        title: '🛒 Don\'t Forget Your Cart!',
        message: `You have ${itemCount} item${itemCount > 1 ? 's' : ''} waiting in your cart. Complete your purchase now!`,
        tag: 'cart-reminder',
        onClick: () => {
            window.focus();
            window.location.href = '/cart';
        },
    });
};

// Wishlist reminder notification
export const notifyWishlistReminder = (itemCount) => {
    return showNotification({
        title: '❤️ Your Wishlist is Waiting!',
        message: `You have ${itemCount} item${itemCount > 1 ? 's' : ''} in your wishlist. Check them out before they're gone!`,
        tag: 'wishlist-reminder',
        onClick: () => {
            window.focus();
            window.location.href = '/wishlist';
        },
    });
};

// Product added to cart notification
export const notifyAddedToCart = (productName) => {
    return showNotification({
        title: '✅ Added to Cart',
        message: `${productName} has been added to your cart`,
        tag: 'cart-add',
    });
};

// Product added to wishlist notification
export const notifyAddedToWishlist = (productName) => {
    return showNotification({
        title: '❤️ Added to Wishlist',
        message: `${productName} has been saved to your wishlist`,
        tag: 'wishlist-add',
    });
};

// Low stock notification
export const notifyLowStock = (productName) => {
    return showNotification({
        title: '⚠️ Low Stock Alert',
        message: `${productName} is running low on stock. Order now before it's gone!`,
        tag: 'low-stock',
    });
};

// Request permission function
export { requestNotificationPermission };
