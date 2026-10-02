import type { SortOrder } from "../types/access.types";
import type { AccessHolder, AccessItem, AccessItemSortField } from "../types/accessItems.types";

/**
 * Sorting and removal for the Access tab. Pure and free of runtime imports, so
 * it can be tested alone and swapped for server calls later.
 */

/** Items in Swedish order; an item with no value in the sorted column goes last in both directions. */
export function sortAccessItems(
	items: AccessItem[],
	field: AccessItemSortField | null,
	order: SortOrder,
): AccessItem[] {
	if (!field) return items;
	return [...items].sort((a, b) => {
		const left = a[field];
		const right = b[field];
		if (!left && !right) return 0;
		if (!left) return 1;
		if (!right) return -1;
		const result = left.localeCompare(right, "sv", { numeric: true });
		return order === "asc" ? result : -result;
	});
}

/** Removes one item. A person left with no items is dropped, since the tab lists only people who hold access. */
export function removeAccessItem(holders: AccessHolder[], itemId: string): AccessHolder[] {
	return holders
		.map((holder) => ({ ...holder, items: holder.items.filter((item) => item.id !== itemId) }))
		.filter((holder) => holder.items.length > 0);
}

/** Removes a person and all their items. */
export function removeAccessHolder(holders: AccessHolder[], holderId: string): AccessHolder[] {
	return holders.filter((holder) => holder.id !== holderId);
}
