import clsx from 'clsx';

export default function Input({
    label,
    error,
    className,
    ...props
}) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-foreground mb-1.5">
                    {label}
                </label>
            )}
            <input
                className={clsx(
                    'w-full px-3 py-2 rounded-lg border bg-background text-foreground transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                    error
                        ? 'border-destructive focus:ring-destructive'
                        : 'border-input',
                    'placeholder:text-muted-foreground',
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-destructive">{error}</p>
            )}
        </div>
    );
}
