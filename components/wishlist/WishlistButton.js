'use client';

import { useWishlist } from '../providers/WishlistProvider';
import { HeartIcon } from '../ui/Icons';

export default function WishlistButton({ product, className = '' }) {
    const { isInWishlist, toggleWishlist } = useWishlist();
    const isWished = isInWishlist(product._id);

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
    };

    return (
        <button
            onClick={handleClick}
            className={`p-2 rounded-full transition-all ${isWished
                ? 'bg-red-50 text-red-500 hover:bg-red-100'
                : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-red-500'
                } ${className}`}
            aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
        >
            <HeartIcon className={`w-5 h-5 ${isWished ? 'fill-current' : ''}`} />
        </button>
    );
}
