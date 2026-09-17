"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { SortDir } from "@/utils/tableSort";
import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

const HEAD = "h-12 px-4 text-sm font-medium whitespace-nowrap text-slate-500";

function ariaSort(active: boolean, dir: SortDir) {
	if (!active || !dir) return "none" as const;
	return dir === "asc" ? ("ascending" as const) : ("descending" as const);
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
	if (active && dir === "asc") return <ArrowUp className="h-3.5 w-3.5" aria-hidden />;
	if (active && dir === "desc") return <ArrowDown className="h-3.5 w-3.5" aria-hidden />;
	return <ArrowUpDown className="h-3.5 w-3.5 opacity-60" aria-hidden />;
}

export interface SortableHeadProps {
	labelKey: TranslationKeys;
	/** Omit for a column that does not sort. */
	onSort?: () => void;
	active?: boolean;
	dir?: SortDir;
	className?: string;
}

/**
 * A table header that sorts: a real button carrying `aria-sort`, so the
 * keyboard and a screen reader both reach it — the path `DataTable`'s
 * clickable `<th>` lacks. Without `onSort` it is a plain header.
 */
export function SortableHead({ labelKey, onSort, active = false, dir = null, className }: SortableHeadProps) {
	if (!onSort) {
		return (
			<TableHead className={cn(HEAD, className)}>
				<Translate text={labelKey} />
			</TableHead>
		);
	}

	return (
		<TableHead aria-sort={ariaSort(active, dir)} className={cn(HEAD, className)}>
			<button
				type="button"
				onClick={onSort}
				className="inline-flex cursor-pointer items-center gap-2 rounded hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-none"
			>
				<Translate text={labelKey} />
				<SortIcon active={active} dir={dir} />
			</button>
		</TableHead>
	);
}

export default SortableHead;
