"use client";

import { useEffect, useRef } from "react";
import { ChevronDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

/** Only what a chip prints. A section's own draft type satisfies this. */
export interface RecordFileChip {
	id: string;
	name: string;
}

export interface RecordFileChipsLabels {
	/** Names the list for a screen reader — the field's own label. */
	list: TranslationKeys;
	/** Takes `{ name }` — the file the ✕ removes. */
	remove: TranslationKeys;
	/** Takes `{ count }` — the chips the collapsed box is hiding. */
	more: TranslationKeys;
	showAll: TranslationKeys;
	showFewer: TranslationKeys;
}

export interface RecordFileChipsProps {
	documents: readonly RecordFileChip[];
	onRemove: (id: string) => void;
	expanded: boolean;
	onToggle: () => void;
	listId: string;
	/** Where focus goes once the last chip is removed. */
	onFocusFallback: () => void;
	labels: RecordFileChipsLabels;
	/** How many chips the collapsed box shows. */
	collapsedCount: number;
}

/**
 * The edit frames' box of attached files, each a chip with ✕.
 *
 * Collapsed it shows the first chips and a count of the rest; the frames'
 * chevron opens and closes the full list. Hidden chips are not rendered rather
 * than clipped, so the keyboard never lands on an ✕ it cannot see. Removing a
 * chip moves focus to its neighbour, or back to the upload button.
 *
 * Shared by the record's sections that attach several files (Besiktning,
 * Garantiåtaganden), which differ only in their labels and how many chips they
 * show collapsed.
 */
export function RecordFileChips({
	documents,
	onRemove,
	expanded,
	onToggle,
	listId,
	onFocusFallback,
	labels,
	collapsedCount,
}: RecordFileChipsProps) {
	const t = useTranslate();
	const removeButtons = useRef(new Map<string, HTMLButtonElement>());
	const pendingFocus = useRef<string | null | undefined>(undefined);

	useEffect(() => {
		if (pendingFocus.current === undefined) return;
		const target = pendingFocus.current ? removeButtons.current.get(pendingFocus.current) : undefined;
		pendingFocus.current = undefined;
		if (target) target.focus();
		else onFocusFallback();
	}, [documents, onFocusFallback]);

	if (documents.length === 0) return null;

	const collapsible = documents.length > collapsedCount;
	const visible = expanded || !collapsible ? documents : documents.slice(0, collapsedCount);
	const hiddenCount = documents.length - visible.length;

	const remove = (index: number) => {
		const neighbour = visible[index + 1] ?? visible[index - 1];
		pendingFocus.current = neighbour?.id ?? null;
		onRemove(visible[index].id);
	};

	return (
		<div className="mt-1 flex items-start gap-2 rounded-md border border-slate-200 bg-white px-3 py-2">
			<ul id={listId} aria-label={t(labels.list)} className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
				{visible.map((doc, index) => (
					<li
						key={doc.id}
						className="inline-flex max-w-full min-w-0 items-center gap-1 rounded-md border border-slate-200 bg-slate-100 py-0.5 pr-0.5 pl-2 text-xs font-medium text-slate-900"
					>
						<span className="max-w-[12rem] truncate" title={doc.name}>
							{doc.name}
						</span>
						<button
							type="button"
							ref={(node) => {
								if (node) removeButtons.current.set(doc.id, node);
								else removeButtons.current.delete(doc.id);
							}}
							onClick={() => remove(index)}
							aria-label={t(labels.remove, { name: doc.name })}
							className="inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded text-slate-500 hover:bg-slate-200 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-none"
						>
							<X className="h-3 w-3" aria-hidden />
						</button>
					</li>
				))}
				{hiddenCount > 0 && (
					<li className="text-xs whitespace-nowrap text-slate-500">
						<Translate text={labels.more} values={{ count: hiddenCount }} />
					</li>
				)}
			</ul>
			{collapsible && (
				<button
					type="button"
					onClick={onToggle}
					aria-expanded={expanded}
					aria-controls={listId}
					aria-label={t(expanded ? labels.showFewer : labels.showAll)}
					className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-none"
				>
					<ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} aria-hidden />
				</button>
			)}
		</div>
	);
}

export default RecordFileChips;
