import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    "rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
    {
        variants: {
            variant: {
                primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
                secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
                danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
                outline: "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50",
                ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
            },
            size: {
                sm: "py-1 px-3 text-sm",
                md: "py-2 px-4 text-base",
                lg: "py-3 px-6 text-lg",
            },
            fullWidth: {
                true: "w-full",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    children: ReactNode;
    fullWidth?: boolean;
}

export function Button({ 
    children, 
    variant, 
    size, 
    fullWidth,
    disabled,
    className, 
    ...props 
}: ButtonProps) {
    return (
        <button 
            className={cn(
                buttonVariants({ variant, size, fullWidth, className }),
                disabled && "opacity-50 cursor-not-allowed pointer-events-none"
            )}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}