import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getInitials = (name: string) => {
	if (!name) return "U";
	const parts = name.split(" ");
	if (parts.length >= 2) {
		return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
	}
	return name[0].toUpperCase();
};

/**
 * Check if a value is in an allowed array and narrow its type
 */
export function isAllowedQueryValue<T extends string>(
	value: string | null | undefined,
	allowed: readonly T[],
): value is T {
	if (!value) return false; // null, undefined, or empty string is not allowed
	return (allowed as readonly string[]).includes(value);
}
