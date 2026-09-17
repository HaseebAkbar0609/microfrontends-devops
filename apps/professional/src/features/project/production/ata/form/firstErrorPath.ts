import type { FieldErrors, FieldValues } from "react-hook-form";

/** The first field path that carries an error, for focusing it after a failed save. */
export function firstErrorPath<T extends FieldValues>(errors: FieldErrors<T>, prefix = ""): string | null {
	for (const [key, value] of Object.entries(errors)) {
		if (!value || typeof value !== "object") continue;
		const path = prefix ? `${prefix}.${key}` : key;
		if ("message" in value && typeof value.message === "string") return path;
		const nested = firstErrorPath(value as FieldErrors<T>, path);
		if (nested) return nested;
	}
	return null;
}
