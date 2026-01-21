'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';

const CartContext = createContext({
    cart: [],
    addToCart: () => { },
    removeFromCart: () => { },
    updateQuantity: () => { },
    clearCart: () => { },
    cartCount: 0,
    cartTotal: 0,
});

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const { user, loading } = useAuth();
    const [isInitialized, setIsInitialized] = useState(false);

    // Initial load from local storage
    useEffect(() => {
        const stored = localStorage.getItem('cart');
        if (stored) {
            setCart(JSON.parse(stored));
        }
        setIsInitialized(true);
    }, []);

    // Sync with server when user logs in
    useEffect(() => {
        if (!loading && user && isInitialized) {
            syncCartWithServer();
        }
    }, [user, loading, isInitialized]);

    // Save cart to localStorage and Server whenever it changes
    useEffect(() => {
        if (!isInitialized) return;
        localStorage.setItem('cart', JSON.stringify(cart));

        if (user) {
            saveCartToServer(cart);
        }
    }, [cart, user, isInitialized]);

    const syncCartWithServer = async () => {
        try {
            // First fetch server cart
            const res = await fetch('/api/user/cart');
            if (res.ok) {
                const data = await res.json();
                const serverCart = data.cart || [];

                // Merge strategies could vary. Here we prioritize local changes if any,
                // or just merge. For simplicity/robustness in this "transient" cart model:
                // If local cart is empty/small, maybe server has more.
                // A simple strategy: If local cart has items, we assume they are "new" additions since last session
                // and push them to server. If local is empty, we pull server.
                // Or better: We merge them.

                // For now, let's just pull server cart if local is empty.
                // If local has items, we'll trigger a save to server (handled by the other useEffect, 
                // but we need to be careful not to overwrite server data with partial local data immediately).

                // Better strategy:
                // 1. Fetch Server Cart.
                // 2. Merge Server Cart into Local Cart (deduplicating).
                // 3. Set Local Cart.
                // 4. (The other useEffect will then save this merged state back to server).

                if (serverCart.length > 0) {
                    setCart(prevCart => {
                        const newCart = [...prevCart];
                        serverCart.forEach(serverItem => {
                            const existingIndex = newCart.findIndex(
                                localItem => localItem._id === serverItem.product &&
                                    localItem.size === serverItem.size &&
                                    localItem.color === serverItem.color
                            );

                            if (existingIndex === -1) {
                                // Server item not in local, add it
                                // Note: serverItem structure needs to match local structure
                                // Our API returns the cart object from DB.
                                // We need to map it if structure differs (e.g. populated product)
                                // Current Schema stores 'product' ID. Ideally we should populate it or
                                // store snapshot data. Our schema stores snapshot data (title, price, image).
                                // But 'product' is an ID.
                                newCart.push({
                                    ...serverItem, // has title, price, image, size, etc.
                                    _id: serverItem.product // map back for local usage
                                });
                            }
                        });
                        return newCart;
                    });
                }
            }
        } catch (error) {
            console.error('Sync cart error:', error);
        }
    };

    const saveCartToServer = async (currentCart) => {
        try {
            // Map local cart to server schema format
            const cartPayload = currentCart.map(item => ({
                product: item._id,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                title: item.title,
                price: item.price,
                image: item.image
            }));

            await fetch('/api/user/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart: cartPayload }),
            });
        } catch (error) {
            console.error('Save cart error:', error);
        }
    };

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingIndex = prevCart.findIndex(
                (item) =>
                    item._id === product._id &&
                    item.size === product.size &&
                    item.color === product.color
            );

            if (existingIndex > -1) {
                const newCart = [...prevCart];
                newCart[existingIndex].quantity += product.quantity || 1;
                return newCart;
            }

            return [...prevCart, { ...product, quantity: product.quantity || 1 }];
        });
    };

    const removeFromCart = (productId, size, color) => {
        setCart((prevCart) =>
            prevCart.filter(
                (item) =>
                    !(item._id === productId && item.size === size && item.color === color)
            )
        );
    };

    const updateQuantity = (productId, size, color, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId, size, color);
            return;
        }

        setCart((prevCart) =>
            prevCart.map((item) =>
                item._id === productId && item.size === size && item.color === color
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartCount,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
