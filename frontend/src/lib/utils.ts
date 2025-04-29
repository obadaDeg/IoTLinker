import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class values into a single className string,
 * with proper handling of Tailwind CSS class conflicts.
 * 
 * @param inputs - Class values to be combined
 * @returns A merged className string
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}