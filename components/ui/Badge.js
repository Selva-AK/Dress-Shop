import clsx from 'clsx';

export default function Badge({ children, variant = 'default', className }) {
    return (
        <span
            className={clsx(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                {
                    'bg-secondary text-secondary-foreground':
                        variant === 'default',
                    'bg-primary/10 text-primary':
                        variant === 'primary',
                    'bg-green-100 text-green-800':
                        variant === 'success',
                    'bg-accent/10 text-accent':
                        variant === 'warning',
                    'bg-destructive/10 text-destructive':
                        variant === 'error',
                },
                className
            )}
        >
            {children}
        </span>
    );
}
