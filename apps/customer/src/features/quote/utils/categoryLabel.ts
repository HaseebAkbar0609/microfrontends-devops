import type { FormSelectOption } from "@/components/form";

function labelForId(options: FormSelectOption[], id: string): string {
	const o = options.find((x) => x.value === id);
	if (!o) return id;
	return typeof o.label === "string" ? o.label : id;
}

/** Single id or multiple category ids (project step). */
export function resolveCategoryLabel(
	options: FormSelectOption[],
	idOrIds: string | string[],
): string {
	const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
	if (ids.length === 0) return "";
	return ids.map((id) => labelForId(options, id)).join(", ");
}
