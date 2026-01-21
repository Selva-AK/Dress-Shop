import clsx from 'clsx';

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className,
    disabled,
    loading,
    ...props
}) {
    return (
        <button
            className={clsx(
                'inline-flex items-center justify-center font-medium rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
                {
                    // Variants
                    'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary':
                        variant === 'primary',
                    'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary':
                        variant === 'secondary',
                    'border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent':
                        variant === 'outline',
                    'hover:bg-accent hover:text-accent-foreground':
                        variant === 'ghost',
                    'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive':
                        variant === 'destructive',
                    // Sizes
                    'h-8 px-3 text-sm': size === 'sm',
                    'h-10 px-4 text-base': size === 'md',
                    'h-12 px-6 text-lg': size === 'lg',
                },
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <>
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    Loading...
                </>
            ) : (
                children
            )}
        </button>
    );
}
