// Native browser notification helper functions

// Register Service Worker and Subscribe to Push
const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            return registration;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            return null;
        }
    }
    return null;
};

// Convert VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const subscribeUserToPush = async () => {
    const registration = await registerServiceWorker();
    if (!registration) {
        console.error('Service Worker registration not found');
        return;
    }

    try {
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

        if (!vapidPublicKey) {
            console.error('VAPID Public Key is missing in environment variables');
            return;
        }

        console.log('Subscribing with VAPID Key:', vapidPublicKey.substring(0, 10) + '...');

        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey
        });

        // Send subscription to server - only if it's new or changed (optimization logic can be added)
        // For now, send always on login to be safe
        const res = await fetch('/api/user/subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription)
        });

        if (!res.ok) {
            throw new Error('Failed to save subscription on server');
        }

        console.log('User subscribed to push notifications successfully');
    } catch (error) {
        console.error('Failed to subscribe user to push:', error);
    }
};

const requestNotificationPermission = async () => {
    if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            // Subscribe to push when permission is granted
            await subscribeUserToPush();
        }
    }
};

const showNotification = ({ title, message, icon = '/logo.png', tag, onClick }) => {
    // Try to show via Service Worker if available (more reliable on mobile)
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification(title, {
                body: message,
                icon,
                badge: icon,
                tag,
                vibrate: [200, 100, 200],
                data: { url: window.location.href } // simplified
            });
        });
        return;
    }

    // Fallback to classic Notification API
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

// ... (Rest of the notification helper functions remain strictly for *local* feedback)
// Order placed notification (Local feedback is fine here)
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

// Order status update notification (This one updates via Polling - KEEPING IT for now as a backup/enhancement for open tabs)
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
