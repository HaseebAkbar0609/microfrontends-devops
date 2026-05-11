import type { CustomerCategory } from "@/types/category";

export function normalizeCategory(
	raw: Record<string, unknown>,
): CustomerCategory | null {
	const id = String(raw.id ?? raw.category_id ?? "").trim();
	const name = String(
		raw.name ?? raw.title ?? raw.category_name ?? "",
	).trim();
	if (!id || !name) {
		return null;
	}
	return { id, name };
}
