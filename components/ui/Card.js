import clsx from 'clsx';

export default function Card({ children, className, ...props }) {
    return (
        <div
            className={clsx(
                'bg-card rounded-lg border border-border shadow-sm',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className, ...props }) {
    return (
        <div className={clsx('p-4 border-b border-border', className)} {...props}>
            {children}
        </div>
    );
}

export function CardBody({ children, className, ...props }) {
    return (
        <div className={clsx('p-4', className)} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className, ...props }) {
    return (
        <div className={clsx('p-4 border-t border-border', className)} {...props}>
            {children}
        </div>
    );
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
