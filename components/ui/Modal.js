'use client';

import { useEffect } from 'react';
import clsx from 'clsx';

export default function Modal({ isOpen, onClose, children, title, size = 'md' }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={clsx(
                    'relative bg-card rounded-lg shadow-xl max-h-[90vh] overflow-y-auto',
                    {
                        'max-w-sm w-full': size === 'sm',
                        'max-w-lg w-full': size === 'md',
                        'max-w-2xl w-full': size === 'lg',
                        'max-w-4xl w-full': size === 'xl',
                    }
                )}
            >
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <h3 className="text-lg font-semibold text-foreground">
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Body */}
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
}
