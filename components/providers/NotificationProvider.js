'use client';

import { createContext, useContext, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { useCart } from './CartProvider';
import { useWishlist } from './WishlistProvider';
import { requestNotificationPermission, notifyCartReminder } from '@/lib/notifications';

const NotificationContext = createContext({});

export function NotificationProvider({ children }) {
    const { user } = useAuth();
    const { cart } = useCart();
    const { wishlist } = useWishlist();

    useEffect(() => {
        // Request notification permission on mount
        if (user) {
            requestNotificationPermission();
        }
    }, [user]);

    // Cart/Wishlist reminder - Check after 24 hours of inactivity
    useEffect(() => {
        if (!user) return;

        const checkReminders = async () => {
            const lastActivity = localStorage.getItem('lastActivity');
            const cartItems = cart?.length || 0;
            const wishlistItems = wishlist?.length || 0;

            if (lastActivity) {
                const hoursSinceActivity = (Date.now() - parseInt(lastActivity)) / (1000 * 60 * 60);

                // If user hasn't been active for 24 hours
                if (hoursSinceActivity >= 24) {
                    const { notifyCartReminder, notifyWishlistReminder } = await import('@/lib/notifications');

                    if (cartItems > 0) {
                        notifyCartReminder(cartItems);
                    } else if (wishlistItems > 0) {
                        notifyWishlistReminder(wishlistItems);
                    }

                    // Reset timer
                    localStorage.setItem('lastActivity', Date.now().toString());
                }
            } else {
                localStorage.setItem('lastActivity', Date.now().toString());
            }
        };

        // Check every hour
        const interval = setInterval(checkReminders, 60 * 60 * 1000);
        checkReminders(); // Check immediately

        return () => clearInterval(interval);
    }, [user, cart, wishlist]);

    // Order Status Polling
    useEffect(() => {
        // Only poll for regular customers, not admins
        // Admins see all orders in API, we don't want them getting "Your order shipped" notifications for customers
        if (!user || user.role === 'admin') return;

        const checkOrderStatuses = async () => {
            try {
                // Get stored statuses
                const storedStatuses = JSON.parse(localStorage.getItem('orderStatuses') || '{}');

                // Fetch recent orders
                const res = await fetch('/api/orders?limit=5');
                if (res.ok) {
                    const data = await res.json();
                    const currentOrders = data.orders || [];

                    let hasUpdates = false;

                    // Dynamically import notification function
                    const { notifyOrderStatusChange } = await import('@/lib/notifications');

                    currentOrders.forEach(order => {
                        const previousStatus = storedStatuses[order._id];

                        // If we have a previous status and it's different from current
                        if (previousStatus && previousStatus !== order.status) {
                            notifyOrderStatusChange(order._id.slice(-6).toUpperCase(), order.status);
                            hasUpdates = true;
                        }

                        // Update stored status
                        storedStatuses[order._id] = order.status;
                    });

                    if (hasUpdates || currentOrders.length > 0) {
                        localStorage.setItem('orderStatuses', JSON.stringify(storedStatuses));
                    }
                }
            } catch (error) {
                console.error('Failed to check order statuses:', error);
            }
        };

        // Check every 5 minutes
        const interval = setInterval(checkOrderStatuses, 5 * 60 * 1000);

        // Initial check after 5 seconds to allow app to load
        const initialTimer = setTimeout(checkOrderStatuses, 5000);

        return () => {
            clearInterval(interval);
            clearTimeout(initialTimer);
        };
    }, [user]);

    // Update last activity on user interaction
    useEffect(() => {
        const updateActivity = () => {
            localStorage.setItem('lastActivity', Date.now().toString());
        };

        window.addEventListener('click', updateActivity);
        window.addEventListener('scroll', updateActivity);
        window.addEventListener('keypress', updateActivity);

        return () => {
            window.removeEventListener('click', updateActivity);
            window.removeEventListener('scroll', updateActivity);
            window.removeEventListener('keypress', updateActivity);
        };
    }, []);

    return (
        <NotificationContext.Provider value={{}}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotification = () => useContext(NotificationContext);
