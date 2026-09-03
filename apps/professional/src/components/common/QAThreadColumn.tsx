"use client";

import { useState, type ReactNode } from "react";
import { ChevronUp } from "lucide-react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export interface QAThreadColumnProps {
	/** Already-translated column heading. */
	label: string;
	icon: ReactNode;
	/**
	 * The column's cards. Filtering by status happens in the caller — a column
	 * renders what it is handed.
	 */
	children: ReactNode;
	/**
	 * How many cards the column holds, shown as a zero-padded pill. Pass 0 to
	 * hide it.
	 */
	count?: number;
	/** Shown in place of the cards when the column is empty. */
	emptyMessageKey?: TranslationKeys;
	className?: string;
}

/**
 * One collapsible column of a Fråga/Svar board.
 *
 * Extracted from `ProjectMarketQATab`, which kept it module-private while the
 * purchase module needed the same three columns — the situation `QAThreadCard`
 * was in before it moved here.
 */
export function QAThreadColumn({
	label,
	icon,
	children,
	count = 0,
	emptyMessageKey,
	className,
}: QAThreadColumnProps) {
	const [open, setOpen] = useState(true);

	return (
		<div
			className={cn(
				"flex w-full min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs",
				className,
			)}
		>
			<Collapsible open={open} onOpenChange={setOpen}>
				<CollapsibleTrigger asChild>
					<button
						type="button"
						className="flex w-full cursor-pointer items-center justify-between border-b border-slate-200 bg-slate-100 px-4 py-3 transition-colors hover:bg-slate-200/70"
					>
						<div className="flex items-center gap-2.5">
							{icon}
							<span className="text-sm font-semibold text-slate-900">
								{label}
							</span>
							{count > 0 && (
								<span className="flex h-4 items-center justify-center rounded bg-orange-600 px-1.5 text-[10px] font-bold text-white">
									{String(count).padStart(2, "0")}
								</span>
							)}
						</div>
						<ChevronUp
							size={16}
							className={cn(
								"shrink-0 text-slate-400 transition-transform duration-200",
								!open && "rotate-180",
							)}
							aria-hidden
						/>
					</button>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<div className="flex flex-col gap-3.5 bg-white p-3.5">
						{count > 0 ? (
							children
						) : (
							<p className="py-6 text-center text-xs text-slate-400">
								{emptyMessageKey ? (
									<Translate text={emptyMessageKey} />
								) : (
									"—"
								)}
							</p>
						)}
					</div>
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
}

export default QAThreadColumn;
