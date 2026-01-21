'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';

const WishlistContext = createContext({
    wishlist: [],
    addToWishlist: () => { },
    removeFromWishlist: () => { },
    isInWishlist: () => false,
    toggleWishlist: () => { },
});

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([]);
    const { user, loading } = useAuth();
    const [isInitialized, setIsInitialized] = useState(false);

    // Initial load from local storage
    useEffect(() => {
        const stored = localStorage.getItem('wishlist');
        if (stored) {
            try {
                setWishlist(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse wishlist from local storage', e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Sync with server when user logs in
    useEffect(() => {
        if (!loading && user && isInitialized) {
            syncWishlistWithServer();
        }
    }, [user, loading, isInitialized]);

    // Save wishlist to localStorage and Server whenever it changes
    useEffect(() => {
        if (!isInitialized) return;

        localStorage.setItem('wishlist', JSON.stringify(wishlist));

        if (user) {
            saveWishlistToServer(wishlist);
        }
    }, [wishlist, user, isInitialized]);

    const syncWishlistWithServer = async () => {
        try {
            const res = await fetch('/api/user/wishlist');
            if (res.ok) {
                const data = await res.json();
                const serverWishlist = data.wishlist || [];

                // Merge: Union of Server and Local
                setWishlist(prevWishlist => {
                    const merged = [...prevWishlist];
                    const existingIds = new Set(merged.map(item => item._id));

                    serverWishlist.forEach(item => {
                        if (!existingIds.has(item._id)) {
                            merged.push(item);
                        }
                    });

                    return merged;
                });
            }
        } catch (error) {
            console.error('Sync wishlist error:', error);
        }
    };

    const saveWishlistToServer = async (currentWishlist) => {
        try {
            // Server expects array of IDs
            const wishlistIds = currentWishlist.map(item => item._id);

            await fetch('/api/user/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ wishlist: wishlistIds }),
            });
        } catch (error) {
            console.error('Save wishlist error:', error);
        }
    };

    const addToWishlist = (product) => {
        setWishlist(prev => {
            if (prev.some(item => item._id === product._id)) return prev;
            return [...prev, product];
        });
    };

    const removeFromWishlist = (productId) => {
        setWishlist(prev => prev.filter(item => item._id !== productId));
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item._id === productId);
    };

    const toggleWishlist = (product) => {
        if (isInWishlist(product._id)) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                toggleWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export const useWishlist = () => useContext(WishlistContext);
