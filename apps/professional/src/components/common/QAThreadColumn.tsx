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

/** The three columns every Fråga/Svar board draws, in order. */
export type QAThreadStatus = "new" | "opened" | "answered";

export interface QAThreadColumnProps {
	/** Already-translated column heading. */
	label: string;
	/** A 24px icon, as the Figma accordion header draws it. */
	icon: ReactNode;
	/**
	 * The column's cards. Filtering by status happens in the caller — a column
	 * renders what it is handed.
	 */
	children: ReactNode;
	/** How many cards the column holds. 0 shows the empty message. */
	count?: number;
	/**
	 * Whether the count is shown as a zero-padded pill. The frames badge only
	 * New — the unread figure — so a board turns it off for the other two.
	 *
	 * Kept apart from `count` on purpose: b2b's board used to pass `count={0}`
	 * to hide the pill, which also hid every card in Opened and Answered.
	 */
	showCount?: boolean;
	/** Shown in place of the cards when the column is empty. */
	emptyMessageKey?: TranslationKeys;
	className?: string;
}

/**
 * One collapsible column of a Fråga/Svar board, sized to the Figma accordion:
 * a 56px slate header with a 24px icon and a 16px title over a 16px-padded body.
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
	showCount = true,
	emptyMessageKey,
	className,
}: QAThreadColumnProps) {
	const [open, setOpen] = useState(true);

	return (
		<div
			className={cn(
				"flex w-full min-w-0 flex-1 flex-col self-start overflow-hidden rounded-xl border border-slate-200 bg-white",
				className,
			)}
		>
			<Collapsible open={open} onOpenChange={setOpen}>
				<CollapsibleTrigger asChild>
					<button
						type="button"
						className={cn(
							"flex h-14 w-full cursor-pointer items-center justify-between gap-4 bg-slate-100 p-4 transition-colors hover:bg-slate-200/70",
							open && "border-b border-slate-200",
						)}
					>
						<div className="flex min-w-0 items-center gap-2">
							{icon}
							<span className="truncate text-base leading-6 font-medium text-zinc-950">
								{label}
							</span>
							{showCount && count > 0 && (
								<span className="flex h-5 items-center justify-center rounded-md bg-orange-600 px-2 text-xs font-medium text-white">
									{String(count).padStart(2, "0")}
								</span>
							)}
						</div>
						<ChevronUp
							size={16}
							className={cn(
								"shrink-0 text-slate-700 transition-transform duration-200",
								!open && "rotate-180",
							)}
							aria-hidden
						/>
					</button>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<div className="flex flex-col gap-4 bg-white p-4">
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
