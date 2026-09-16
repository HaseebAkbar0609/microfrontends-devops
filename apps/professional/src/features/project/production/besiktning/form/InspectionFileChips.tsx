"use client";

import { useEffect, useRef } from "react";
import { ChevronDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { INSPECTION_CHIPS_COLLAPSED } from "../projectInspection.config";
import type { InspectionDocumentInput } from "../types";

export interface InspectionFileChipsProps {
	documents: InspectionDocumentInput[];
	onRemove: (id: string) => void;
	expanded: boolean;
	onToggle: () => void;
	listId: string;
	/** Where focus goes once the last chip is removed. */
	onFocusFallback: () => void;
}

/**
 * The edit frame's box of attached files, each a chip with ×.
 *
 * Collapsed it shows the first chips and a count of the rest; the frame's
 * chevron opens and closes the full list. Hidden chips are not rendered rather
 * than clipped, so the keyboard never lands on an × it cannot see. Removing a
 * chip moves focus to its neighbour, or back to the upload button.
 */
export function InspectionFileChips({
	documents,
	onRemove,
	expanded,
	onToggle,
	listId,
	onFocusFallback,
}: InspectionFileChipsProps) {
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

	const collapsible = documents.length > INSPECTION_CHIPS_COLLAPSED;
	const visible = expanded || !collapsible ? documents : documents.slice(0, INSPECTION_CHIPS_COLLAPSED);
	const hiddenCount = documents.length - visible.length;

	const remove = (index: number) => {
		const neighbour = visible[index + 1] ?? visible[index - 1];
		pendingFocus.current = neighbour?.id ?? null;
		onRemove(visible[index].id);
	};

	return (
		<div className="mt-1 flex items-start gap-2 rounded-md border border-slate-200 bg-white px-3 py-2">
			<ul
				id={listId}
				aria-label={t(localizationConstants.inspectionDocumentFieldLabel)}
				className="flex min-w-0 flex-1 flex-wrap items-center gap-2"
			>
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
							aria-label={t(localizationConstants.projectInspectionRemoveFile, { name: doc.name })}
							className="inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded text-slate-500 hover:bg-slate-200 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-none"
						>
							<X className="h-3 w-3" aria-hidden />
						</button>
					</li>
				))}
				{hiddenCount > 0 && (
					<li className="text-xs whitespace-nowrap text-slate-500">
						<Translate text={localizationConstants.projectInspectionMoreFiles} values={{ count: hiddenCount }} />
					</li>
				)}
			</ul>
			{collapsible && (
				<button
					type="button"
					onClick={onToggle}
					aria-expanded={expanded}
					aria-controls={listId}
					aria-label={t(
						expanded
							? localizationConstants.projectInspectionShowFewerFiles
							: localizationConstants.projectInspectionShowAllFiles,
					)}
					className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-none"
				>
					<ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} aria-hidden />
				</button>
			)}
		</div>
	);
}

export default InspectionFileChips;
